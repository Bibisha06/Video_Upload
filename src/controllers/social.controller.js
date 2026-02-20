import mongoose from "mongoose"
import { Like } from "../models/like.model.js"
import { Comment } from "../models/comment.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const userId = req.user?._id

    const existingLike = await Like.findOne({ video: videoId, likedBy: userId })

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id)
        return res.status(200).json(new ApiResponse(200, {}, "Unliked successfully"))
    }

    await Like.create({ video: videoId, likedBy: userId })
    return res.status(200).json(new ApiResponse(200, {}, "Liked successfully"))
})

const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { content } = req.body
    const userId = req.user?._id

    if (!content) throw new ApiError(400, "Comment content is required")

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: userId
    })

    return res.status(201).json(new ApiResponse(201, comment, "Comment added successfully"))
})

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const comments = await Comment.find({ video: videoId }).populate("owner", "username avatar")
    return res.status(200).json(new ApiResponse(200, comments, "Comments fetched successfully"))
})

const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    const userId = req.user?._id

    const existingSub = await Subscription.findOne({ subscriber: userId, channel: channelId })

    if (existingSub) {
        await Subscription.findByIdAndDelete(existingSub._id)
        return res.status(200).json(new ApiResponse(200, {}, "Unsubscribed successfully"))
    }

    await Subscription.create({ subscriber: userId, channel: channelId })
    return res.status(200).json(new ApiResponse(200, {}, "Subscribed successfully"))
})

export {
    toggleVideoLike,
    addComment,
    getVideoComments,
    toggleSubscription
}
