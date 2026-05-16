import { useState, useEffect } from "react";
import VideoCard from "../components/VideoCard";
import API from "../api/axios";
import { Search, RefreshCw, Upload } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const Home = () => {
    const { user } = useAuth();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "");

    useEffect(() => {
        const query = searchParams.get("query") || "";
        setSearchQuery(query);
    }, [searchParams]);

    const fetchVideos = async () => {
        setLoading(true);
        try {
            const response = await API.get("/videos", {
                params: { query: searchQuery }
            });
            setVideos(response.data.data);
        } catch (error) {
            console.error("Error fetching videos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, [searchQuery]);

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-text-main">
                        Discover <span className="text-primary">Videos</span>
                    </h1>
                    <div className="flex items-center gap-2 mt-1.5">
                        <p className="text-text-subtle text-sm">Explore what's trending</p>
                        {user && (
                            <Link to="/upload" className="flex items-center gap-1.5 text-primary hover:text-primary-hover transition-colors text-sm font-medium pl-3 border-l border-border-strong ml-2">
                                <Upload size={14} />
                                <span>Upload New</span>
                            </Link>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={fetchVideos}
                        className="p-2.5 text-text-muted hover:text-primary hover:bg-primary-light rounded-xl transition-all"
                        title="Refresh Feed"
                    >
                        <RefreshCw size={18} className={loading ? "animate-spin text-primary" : ""} />
                    </button>
                </div>
            </header>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-10">
                    {[1, 2, 3, 4, 8].map((i) => (
                        <div key={i} className="animate-pulse space-y-4">
                            <div className="aspect-video bg-gradient-to-br from-lavender to-pink-soft rounded-2xl" />
                            <div className="flex gap-3">
                                <div className="w-10 h-10 rounded-full bg-lavender" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-lavender rounded-lg w-3/4" />
                                    <div className="h-3 bg-lavender rounded-lg w-1/2" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-10"
                >
                    {videos.map((video) => (
                        <VideoCard key={video._id} video={video} />
                    ))}
                </motion.div>
            )}

            {!loading && videos.length === 0 && (
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
                        <Search size={28} className="text-primary" />
                    </motion.div>
                    <p className="text-lg font-semibold text-text-main">No videos found</p>
                    <p className="text-sm text-text-muted mt-1">Try adjusting your search terms</p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSearchQuery("")}
                        className="btn-primary mt-6"
                    >
                        Clear Search
                    </motion.button>
                </motion.div>
            )}
        </div>
    );
};

export default Home;
