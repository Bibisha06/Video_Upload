import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query

    const filter = {}
    if (query) {
        filter.$or = [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } }
        ]
    }
    if (userId) filter.owner = userId

    const videos = await Video.find(filter)
        .sort({ [sortBy || "createdAt"]: sortType === "desc" ? -1 : 1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .populate("owner", "fullName username avatar")

    return res.status(200).json(
        new ApiResponse(200, videos, "Videos fetched successfully")
    )
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body

    if ([title, description].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "Title and description are required")
    }

    const videoFileLocalPath = req.files?.videoFile?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    if (!videoFileLocalPath) {
        throw new ApiError(400, "Video file is required")
    }

    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail is required")
    }

    const videoFile = await uploadOnCloudinary(videoFileLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if (!videoFile) {
        throw new ApiError(400, "Video file upload failed")
    }

    if (!thumbnail) {
        throw new ApiError(400, "Thumbnail upload failed")
    }

    const video = await Video.create({
        title,
        description,
        duration: videoFile.duration,
        videoFile: videoFile.secure_url,
        thumbnail: thumbnail.secure_url,
        owner: req.user?._id,
        isPublished: true
    })

    const createdVideo = await Video.findById(video._id)

    if (!createdVideo) {
        throw new ApiError(500, "Something went wrong while publishing the video")
    }

    return res.status(201).json(
        new ApiResponse(201, createdVideo, "Video published successfully")
    )
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const video = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            fullName: 1,
                            username: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner: {
                    $first: "$owner"
                }
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "owner._id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $addFields: {
                likesCount: {
                    $size: "$likes"
                },
                isLiked: {
                    $cond: {
                        if: { $in: [req.user?._id, "$likes.likedBy"] },
                        then: true,
                        else: false
                    }
                },
                isSubscribed: {
                    $cond: {
                        if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                videoFile: 1,
                thumbnail: 1,
                title: 1,
                description: 1,
                views: 1,
                duration: 1,
                isPublished: 1,
                owner: 1,
                createdAt: 1,
                likesCount: 1,
                isLiked: 1,
                isSubscribed: 1
            }
        }
    ])

    if (!video?.length) {
        throw new ApiError(404, "Video not found")
    }

    return res.status(200).json(
        new ApiResponse(200, video[0], "Video fetched successfully")
    )
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById
}
