import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Play } from "lucide-react";

const VideoCard = ({ video }) => {
    return (
        <Link to={`/watch/${video?._id}`} className="group space-y-3">
            <div className="relative aspect-video rounded-xl overflow-hidden neon-card">
                <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-neon">
                        <Play className="fill-white text-white ml-1" size={24} />
                    </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-xs font-bold border border-white/10">
                    {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                </div>
            </div>

            <div className="flex gap-3 px-1">
                <img
                    src={video.owner?.avatar}
                    alt={video.owner?.username}
                    className="w-9 h-9 rounded-full border border-border mt-1"
                />
                <div className="flex flex-col flex-1 overflow-hidden">
                    <h3 className="font-bold text-sm line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                        {video.title}
                    </h3>
                    <p className="text-xs text-border mt-1 hover:text-white transition-colors">
                        {video.owner?.fullName}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-border/70 uppercase font-black tracking-widest mt-0.5">
                        <span>{video.views} views</span>
                        <span className="w-1 h-1 bg-border rounded-full" />
                        <span>{formatDistanceToNow(new Date(video.createdAt))} ago</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default VideoCard;
