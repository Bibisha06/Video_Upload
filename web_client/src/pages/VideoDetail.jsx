import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown, Share2, MessageSquare, Bell, RefreshCw, AlertCircle, User } from "lucide-react";
import API from "../api/axios";
import { formatDistanceToNow } from "date-fns";

const VideoDetail = () => {
    const { videoId } = useParams();
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [isLiked, setIsLiked] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [sidebarVideos, setSidebarVideos] = useState([]);

    const fetchData = async () => {
        setLoading(true);
        setError("");
        try {
            const [videoRes, commentRes, sidebarRes] = await Promise.all([
                API.get(`/videos/${videoId}`),
                API.get(`/social/comment/${videoId}`),
                API.get("/videos?limit=10")
            ]);

            const videoData = videoRes.data.data;
            setVideo(videoData);
            setComments(commentRes.data.data);
            setSidebarVideos(sidebarRes.data.data.filter(v => v._id !== videoId));


            setIsLiked(videoData.isLiked || false);
            setIsSubscribed(videoData.isSubscribed || false);

        } catch (err) {
            console.error("Error fetching watch data:", err);
            setError("Failed to load video signal. Signal lost.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [videoId]);

    const handleLike = async () => {
        try {
            await API.post(`/social/like/v/${videoId}`);
            setIsLiked(!isLiked);
        } catch (err) {
            console.error("Like error:", err);
        }
    };

    const handleSubscribe = async () => {
        try {
            await API.post(`/social/subscribe/${video.owner._id}`);
            setIsSubscribed(!isSubscribed);
        } catch (err) {
            console.error("Subscribe error:", err);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            const res = await API.post(`/social/comment/${videoId}`, { content: newComment });
            setComments([res.data.data, ...comments]);
            setNewComment("");
        } catch (err) {
            console.error("Comment error:", err);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 text-primary">
                <RefreshCw size={48} className="animate-spin mb-4" />
                <p className="text-xs font-black uppercase tracking-widest animate-pulse">Scanning Frequency...</p>
            </div>
        );
    }

    if (error || !video) {
        return (
            <div className="flex flex-col items-center justify-center py-40 text-border">
                <AlertCircle size={48} className="text-primary mb-4" />
                <h2 className="text-2xl font-black uppercase italic tracking-tighter">Signal Failure</h2>
                <p className="text-sm mt-2">{error || "Video not found in the grid."}</p>
                <Link to="/" className="btn-primary mt-8">Return to Feed</Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <div className="aspect-video bg-black rounded-2xl overflow-hidden neon-card">
                    <video
                        controls
                        className="w-full h-full object-contain bg-black"
                        poster={video.thumbnail}
                        playsInline
                        crossOrigin="anonymous"
                        preload="auto"
                    >
                        <source src={video.videoFile} type="video/mp4" />
                        <source src={video.videoFile} type="video/webm" />
                        <source src={video.videoFile} type="video/ogg" />
                        Your browser does not support the video tag.
                    </video>
                </div>

                <div className="space-y-4">
                    <h1 className="text-2xl font-black uppercase tracking-tight italic text-primary">
                        {video.title}
                    </h1>

                    <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-border pb-6">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <img src={video.owner?.avatar} className="w-10 h-10 rounded-full border border-primary/50" alt="" />
                                <div>
                                    <p className="font-bold text-sm">{video.owner?.fullName}</p>
                                    <p className="text-[10px] text-border uppercase font-black">Member of System</p>
                                </div>
                            </div>
                            <button
                                onClick={handleSubscribe}
                                className={`btn-primary px-6 h-10 flex items-center gap-2 ${isSubscribed ? "bg-white text-black hover:bg-white/90 shadow-none border-none" : ""}`}
                            >
                                {isSubscribed ? <><Bell size={16} /> Subscribed</> : "Subscribe"}
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="flex items-center bg-surface border border-border rounded-full p-1">
                                <button
                                    onClick={handleLike}
                                    className={`flex items-center gap-2 px-4 py-1.5 rounded-full transition-colors ${isLiked ? "bg-primary text-white" : "hover:bg-white/5"}`}
                                >
                                    <ThumbsUp size={18} />
                                    <span className="font-bold text-sm">Like</span>
                                </button>
                                <div className="w-[1px] h-4 bg-border mx-1" />
                                <button className="flex items-center px-4 py-1.5 rounded-full hover:bg-white/5 transition-colors">
                                    <ThumbsDown size={18} />
                                </button>
                            </div>

                            <button className="flex items-center gap-2 bg-surface border border-border rounded-full px-4 py-2 hover:bg-white/5 transition-colors">
                                <Share2 size={18} />
                                <span className="font-bold text-sm">Share</span>
                            </button>
                        </div>
                    </div>

                    <div className="bg-surface border border-border p-4 rounded-xl text-sm leading-relaxed">
                        <div className="flex items-center gap-2 font-black mb-2 uppercase tracking-widest text-[10px] text-border">
                            <span>{video.views} transmissions</span>
                            <span>{formatDistanceToNow(new Date(video.createdAt))} ago</span>
                        </div>
                        <p className="text-white/80">{video.description}</p>
                    </div>

                    <div className="space-y-6 pt-4">
                        <h3 className="text-lg font-black uppercase italic flex items-center gap-2">
                            <MessageSquare className="text-primary" size={20} />
                            Comments <span className="text-border">{comments.length}</span>
                        </h3>

                        <form onSubmit={handleComment} className="flex gap-4">
                            <div className="w-10 h-10 p-2 bg-surface rounded-full text-border border border-border flex items-center justify-center">
                                <User size={20} />
                            </div>
                            <div className="flex-1 space-y-2">
                                <input
                                    type="text"
                                    placeholder="Add a comment..."
                                    className="input-field border-x-0 border-t-0 rounded-none focus:border-b-primary px-0 text-sm"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                />
                                <div className="flex justify-end gap-2">
                                    <button type="button" onClick={() => setNewComment("")} className="text-xs font-black text-border hover:text-white uppercase px-3 py-2">Purge</button>
                                    <button type="submit" className="btn-primary py-1 px-4 text-xs">Transmit</button>
                                </div>
                            </div>
                        </form>

                        <div className="space-y-6 mt-8">
                            {comments.map(comment => (
                                <div key={comment._id} className="flex gap-4 group">
                                    <img src={comment.owner?.avatar} className="w-10 h-10 rounded-full border border-border" alt="" />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-bold text-primary italic">@{comment.owner?.username}</span>
                                            <span className="text-[10px] text-border uppercase font-black">{formatDistanceToNow(new Date(comment.createdAt))} ago</span>
                                        </div>
                                        <p className="text-sm text-white/90 leading-relaxed">{comment.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="text-xs font-black text-border uppercase tracking-widest">Global Broadcasts</h3>
                <p className="text-[10px] text-border italic">Discover more neon signals in the grid.</p>
                <div className="space-y-4">
                    {sidebarVideos.map(item => (
                        <Link
                            key={item._id}
                            to={`/v/${item._id}`}
                            className="flex gap-3 group hover:bg-white/5 p-2 rounded-xl transition-all"
                        >
                            <div className="w-32 aspect-video bg-black rounded-lg overflow-hidden flex-shrink-0 border border-border group-hover:border-primary/50 transition-colors">
                                <img src={item.thumbnail} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-bold line-clamp-2 leading-tight group-hover:text-primary transition-colors uppercase">
                                    {item.title}
                                </h4>
                                <p className="text-[10px] text-border mt-1 font-black uppercase tracking-tighter italic">
                                    {item.owner?.username}
                                </p>
                                <div className="flex items-center gap-2 text-[9px] text-white/40 mt-1 uppercase font-black">
                                    <span>{item.views} Viewers</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                    {sidebarVideos.length === 0 && (
                        <p className="text-xs font-black text-primary animate-pulse italic">Connecting to more frequencies...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VideoDetail;
