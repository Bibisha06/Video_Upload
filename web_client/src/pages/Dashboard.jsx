import { useState, useEffect } from "react";
import { Users, Eye, Heart, Video, Play, RefreshCw, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchDashboardData = async () => {
        setLoading(true);
        setError("");
        try {
            const [statsRes, videosRes] = await Promise.all([
                API.get("/dashboard/stats"),
                API.get("/dashboard/videos")
            ]);
            setStats(statsRes.data.data);
            setVideos(videosRes.data.data);
        } catch (err) {
            console.error("Dashboard error:", err);
            setError("Failed to load dashboard data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 text-primary">
                <RefreshCw size={40} className="animate-spin mb-4" />
                <p className="text-sm font-medium text-text-muted">Loading your dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-40">
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
                    <AlertCircle size={32} className="text-red-400" />
                </div>
                <h2 className="text-xl font-bold text-text-main">Dashboard Error</h2>
                <p className="text-sm mt-2 text-text-muted">{error}</p>
                <button onClick={fetchDashboardData} className="btn-primary mt-6">Try Again</button>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
                <div className="flex items-center gap-4">
                    <img src={user?.avatar} alt={user?.username} className="w-16 h-16 rounded-full border-4 border-primary-light" />
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-text-main">Welcome, {user?.fullName}</h1>
                        <p className="text-text-muted mt-1 text-sm">@{user?.username} • Your Channel Dashboard</p>
                    </div>
                </div>
                <Link to="/upload" className="btn-primary flex items-center gap-2 px-6 h-12 w-full md:w-auto justify-center">
                    <Video size={18} />
                    <span>Upload Video</span>
                </Link>
            </header>

            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                <motion.div variants={itemVariants} className="bg-white border border-border p-6 rounded-2xl flex items-center gap-5" style={{ boxShadow: '0 4px 20px rgba(217, 70, 239, 0.05)' }}>
                    <div className="w-12 h-12 bg-primary-light/50 rounded-full flex items-center justify-center flex-shrink-0">
                        <Eye className="text-primary" size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-text-muted">Total Views</p>
                        <p className="text-2xl font-bold text-text-main mt-0.5">{stats?.totalViews?.toLocaleString() || 0}</p>
                    </div>
                </motion.div>
                <motion.div variants={itemVariants} className="bg-white border border-border p-6 rounded-2xl flex items-center gap-5" style={{ boxShadow: '0 4px 20px rgba(217, 70, 239, 0.05)' }}>
                    <div className="w-12 h-12 bg-primary-light/50 rounded-full flex items-center justify-center flex-shrink-0">
                        <Users className="text-primary" size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-text-muted">Subscribers</p>
                        <p className="text-2xl font-bold text-text-main mt-0.5">{stats?.totalSubscribers?.toLocaleString() || 0}</p>
                    </div>
                </motion.div>
                <motion.div variants={itemVariants} className="bg-white border border-border p-6 rounded-2xl flex items-center gap-5" style={{ boxShadow: '0 4px 20px rgba(217, 70, 239, 0.05)' }}>
                    <div className="w-12 h-12 bg-primary-light/50 rounded-full flex items-center justify-center flex-shrink-0">
                        <Heart className="text-primary" size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-text-muted">Total Likes</p>
                        <p className="text-2xl font-bold text-text-main mt-0.5">{stats?.totalLikes?.toLocaleString() || 0}</p>
                    </div>
                </motion.div>
                <motion.div variants={itemVariants} className="bg-white border border-border p-6 rounded-2xl flex items-center gap-5" style={{ boxShadow: '0 4px 20px rgba(217, 70, 239, 0.05)' }}>
                    <div className="w-12 h-12 bg-primary-light/50 rounded-full flex items-center justify-center flex-shrink-0">
                        <Video className="text-primary" size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-text-muted">Videos</p>
                        <p className="text-2xl font-bold text-text-main mt-0.5">{stats?.totalVideos?.toLocaleString() || 0}</p>
                    </div>
                </motion.div>
            </motion.div>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-text-main">Your Uploads</h2>
                </div>

                {videos.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-20 bg-white border border-border rounded-2xl" 
                        style={{ boxShadow: '0 4px 24px rgba(217, 70, 239, 0.06)' }}
                    >
                        <motion.div 
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="w-16 h-16 bg-lavender rounded-2xl flex items-center justify-center mb-4"
                        >
                            <Video size={28} className="text-primary" />
                        </motion.div>
                        <p className="text-lg font-semibold text-text-main">No videos uploaded yet</p>
                        <p className="text-sm text-text-muted mt-1">Share your first video with the world</p>
                        <Link to="/upload" className="btn-primary mt-6">Upload Video</Link>
                    </motion.div>
                ) : (
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-10"
                    >
                        {videos.map((video) => (
                            <motion.div variants={itemVariants} whileHover={{ y: -4 }} key={video._id} className="group space-y-3 block">
                                <Link to={`/watch/${video._id}`}>
                                    <div className="relative aspect-video rounded-2xl overflow-hidden neon-card">
                                        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <div className="w-12 h-12 bg-primary/90 backdrop-blur-sm rounded-full flex items-center justify-center" style={{ boxShadow: '0 4px 20px rgba(217, 70, 239, 0.4)' }}>
                                                <Play className="fill-white text-white ml-0.5" size={22} />
                                            </div>
                                        </div>
                                        <div className="absolute bottom-2 right-2 bg-text-main/75 backdrop-blur-sm text-white px-2 py-0.5 rounded-lg text-xs font-semibold">
                                            {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                                        </div>
                                    </div>
                                    <div className="flex flex-col flex-1 overflow-hidden px-1 mt-3">
                                        <h3 className="font-semibold text-sm line-clamp-2 leading-snug text-text-main group-hover:text-primary transition-colors">{video.title}</h3>
                                        <div className="flex items-center gap-1.5 text-xs text-text-subtle mt-1.5 font-medium">
                                            <span className="flex items-center gap-1"><Eye size={12} /> {video.views}</span>
                                            <span className="w-1 h-1 bg-text-subtle rounded-full mx-1" />
                                            <span>{formatDistanceToNow(new Date(video.createdAt))} ago</span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
