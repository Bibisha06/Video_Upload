import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown, Share2, MessageSquare, Bell, RefreshCw, AlertCircle, User } from "lucide-react";
import API from "../api/axios";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

const VideoDetail = () => {
    const { videoId } = useParams();
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
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
            setLikesCount(videoData.likesCount || 0);
            setIsSubscribed(videoData.isSubscribed || false);
        } catch (err) {
            console.error("Error fetching watch data:", err);
            setError("Failed to load video. Please try again.");
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, [videoId]);

    const handleLike = async () => {
        try { 
            await API.post(`/social/like/v/${videoId}`); 
            setIsLiked(!isLiked); 
            setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
        } catch (err) { console.error("Like error:", err); }
    };

    const handleSubscribe = async () => {
        try { await API.post(`/social/subscribe/${video.owner._id}`); setIsSubscribed(!isSubscribed); } catch (err) { console.error("Subscribe error:", err); }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            const res = await API.post(`/social/comment/${videoId}`, { content: newComment });
            setComments([res.data.data, ...comments]);
            setNewComment("");
        } catch (err) { console.error("Comment error:", err); }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 text-primary">
                <RefreshCw size={40} className="animate-spin mb-4" />
                <p className="text-sm font-medium text-text-muted">Loading video...</p>
            </div>
        );
    }

    if (error || !video) {
        return (
            <div className="flex flex-col items-center justify-center py-40">
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
                    <AlertCircle size={32} className="text-red-400" />
                </div>
                <h2 className="text-xl font-bold text-text-main">Video Not Found</h2>
                <p className="text-sm mt-2 text-text-muted">{error || "This video doesn't exist."}</p>
                <Link to="/" className="btn-primary mt-6">Back to Home</Link>
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
            <div className="lg:col-span-2 space-y-5">
                <div className="aspect-video bg-text-main rounded-2xl overflow-hidden neon-card">
                    <video controls className="w-full h-full object-contain bg-black" poster={video.thumbnail} playsInline crossOrigin="anonymous" preload="auto">
                        <source src={video.videoFile} type="video/mp4" />
                        <source src={video.videoFile} type="video/webm" />
                        <source src={video.videoFile} type="video/ogg" />
                        Your browser does not support the video tag.
                    </video>
                </div>

                <div className="space-y-4">
                    <h1 className="text-xl md:text-2xl font-bold text-text-main leading-tight">{video.title}</h1>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 border-b border-border pb-5">
                        <div className="flex items-center gap-3">
                            <img src={video.owner?.avatar} className="w-10 h-10 rounded-full border-2 border-primary-light" alt="" />
                            <div>
                                <p className="font-semibold text-sm text-text-main">{video.owner?.fullName}</p>
                                <p className="text-xs text-text-muted">Creator</p>
                            </div>
                            <button onClick={handleSubscribe} className={`ml-2 px-5 h-9 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${isSubscribed ? "bg-lavender text-text-main hover:bg-lavender-deep" : "btn-primary"}`}>
                                {isSubscribed ? <><Bell size={14} /> Subscribed</> : "Subscribe"}
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="flex items-center bg-lavender/50 rounded-xl p-1">
                                <button onClick={handleLike} className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg transition-all text-sm font-medium ${isLiked ? "bg-primary text-white" : "hover:bg-white/60 text-text-main"}`}>
                                    <ThumbsUp size={16} /><span>{likesCount > 0 ? likesCount : 'Like'}</span>
                                </button>
                                <div className="w-[1px] h-4 bg-border-strong mx-1" />
                                <button className="flex items-center px-3 py-1.5 rounded-lg hover:bg-white/60 transition-all text-text-main">
                                    <ThumbsDown size={16} />
                                </button>
                            </div>
                            <button className="flex items-center gap-1.5 bg-lavender/50 rounded-xl px-4 py-2 hover:bg-lavender transition-all text-sm font-medium text-text-main">
                                <Share2 size={16} /><span>Share</span>
                            </button>
                        </div>
                    </div>

                    <div className="bg-lavender/30 border border-border p-4 rounded-xl text-sm leading-relaxed">
                        <div className="flex items-center gap-2 font-semibold mb-2 text-xs text-text-muted">
                            <span>{video.views} views</span>
                            <span>·</span>
                            <span>{formatDistanceToNow(new Date(video.createdAt))} ago</span>
                        </div>
                        <p className="text-text-main">{video.description}</p>
                    </div>

                    <div className="space-y-5 pt-4">
                        <h3 className="text-base font-bold text-text-main flex items-center gap-2">
                            <MessageSquare className="text-primary" size={18} />
                            Comments <span className="text-text-subtle font-normal text-sm">({comments.length})</span>
                        </h3>

                        <form onSubmit={handleComment} className="flex gap-3">
                            <div className="w-9 h-9 p-2 bg-lavender rounded-full text-text-muted flex items-center justify-center flex-shrink-0">
                                <User size={18} />
                            </div>
                            <div className="flex-1 space-y-2">
                                <input type="text" placeholder="Add a comment..." className="input-field border-x-0 border-t-0 rounded-none focus:border-b-primary px-0 text-sm bg-transparent" value={newComment} onChange={(e) => setNewComment(e.target.value)} />
                                <div className="flex justify-end gap-2">
                                    <button type="button" onClick={() => setNewComment("")} className="text-sm text-text-muted hover:text-text-main px-3 py-1.5 rounded-lg transition-colors">Cancel</button>
                                    <button type="submit" className="btn-primary py-1.5 px-5 text-sm">Comment</button>
                                </div>
                            </div>
                        </form>

                        <div className="space-y-5 mt-6">
                            {comments.map(comment => (
                                <div key={comment._id} className="flex gap-3">
                                    <img src={comment.owner?.avatar} className="w-9 h-9 rounded-full border border-border" alt="" />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm font-semibold text-primary">@{comment.owner?.username}</span>
                                            <span className="text-xs text-text-subtle">{formatDistanceToNow(new Date(comment.createdAt))} ago</span>
                                        </div>
                                        <p className="text-sm text-text-main leading-relaxed">{comment.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-5">
                <h3 className="text-sm font-bold text-text-main">Recommended</h3>
                <div className="space-y-3">
                    {sidebarVideos.map(item => (
                        <Link key={item._id} to={`/watch/${item._id}`} className="flex gap-3 group hover:bg-lavender/30 p-2 rounded-xl transition-all">
                            <div className="w-36 md:w-40 aspect-video rounded-xl overflow-hidden flex-shrink-0 border border-border group-hover:border-primary/30 transition-colors">
                                <img src={item.thumbnail} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold line-clamp-2 leading-snug text-text-main group-hover:text-primary transition-colors">{item.title}</h4>
                                <p className="text-xs text-text-muted mt-1">{item.owner?.username}</p>
                                <p className="text-xs text-text-subtle mt-0.5">{item.views} views</p>
                            </div>
                        </Link>
                    ))}
                    {sidebarVideos.length === 0 && <p className="text-sm text-text-muted">Loading recommendations...</p>}
                </div>
            </div>
        </motion.div>
    );
};

export default VideoDetail;
