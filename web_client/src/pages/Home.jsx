import { useState, useEffect } from "react";
import VideoCard from "../components/VideoCard";
import API from "../api/axios";
import { Search, RefreshCw, Upload } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Link, useSearchParams } from "react-router-dom";

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
                    <h1 className="text-3xl font-black uppercase tracking-tighter italic text-primary">
                        Up-<span className="text-white">Vi Feed</span>
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Universe Frequency</p>
                        {user && (
                            <Link to="/upload" className="flex items-center gap-1.5 text-primary hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest pl-3 border-l border-border ml-2">
                                <Upload size={12} />
                                <span>Signal New Broadcast</span>
                            </Link>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={fetchVideos}
                        className="p-2 text-white/60 hover:text-primary transition-colors"
                        title="Refresh Feed"
                    >
                        <RefreshCw size={20} className={loading ? "animate-spin text-primary" : "text-white/60"} />
                    </button>
                </div>
            </header>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-10">
                    {[1, 2, 3, 4, 8].map((i) => (
                        <div key={i} className="animate-pulse space-y-4">
                            <div className="aspect-video bg-surface rounded-xl border border-border" />
                            <div className="flex gap-3">
                                <div className="w-10 h-10 rounded-full bg-surface border border-border" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-surface rounded w-3/4" />
                                    <div className="h-3 bg-surface rounded w-1/2" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-10">
                    {videos.map((video) => (
                        <VideoCard key={video._id} video={video} />
                    ))}
                </div>
            )}

            {!loading && videos.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-border border border-dashed border-border rounded-2xl">
                    <Search size={48} className="mb-4 opacity-10" />
                    <p className="text-xl font-bold italic text-white/60">No videos found</p>
                    <button
                        onClick={() => setSearchQuery("")}
                        className="text-primary hover:underline mt-2 text-sm font-black"
                    >
                        Clear Search
                    </button>
                </div>
            )}
        </div>
    );
};

export default Home;
