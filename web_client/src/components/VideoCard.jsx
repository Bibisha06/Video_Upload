import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Play } from "lucide-react";
import { motion } from "framer-motion";

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

const VideoCard = ({ video }) => {
    return (
        <motion.div variants={itemVariants} whileHover={{ y: -4 }}>
            <Link to={`/watch/${video?._id}`} className="group space-y-3 block">
            <div className="relative aspect-video rounded-2xl overflow-hidden neon-card">
                <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 bg-primary/90 backdrop-blur-sm rounded-full flex items-center justify-center"
                        style={{ boxShadow: '0 4px 20px rgba(217, 70, 239, 0.4)' }}
                    >
                        <Play className="fill-white text-white ml-0.5" size={22} />
                    </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-text-main/75 backdrop-blur-sm text-white px-2 py-0.5 rounded-lg text-xs font-semibold">
                    {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                </div>
            </div>

            <div className="flex gap-3 px-1">
                <img
                    src={video.owner?.avatar}
                    alt={video.owner?.username}
                    className="w-9 h-9 rounded-full border-2 border-primary-light mt-0.5"
                />
                <div className="flex flex-col flex-1 overflow-hidden">
                    <h3 className="font-semibold text-sm line-clamp-2 leading-snug text-text-main group-hover:text-primary transition-colors">
                        {video.title}
                    </h3>
                    <p className="text-xs text-text-muted mt-1 hover:text-primary transition-colors">
                        {video.owner?.fullName}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-text-subtle mt-0.5">
                        <span>{video.views} views</span>
                        <span className="w-1 h-1 bg-text-subtle rounded-full" />
                        <span>{formatDistanceToNow(new Date(video.createdAt))} ago</span>
                    </div>
                </div>
            </div>
            </Link>
        </motion.div>
    );
};

export default VideoCard;
