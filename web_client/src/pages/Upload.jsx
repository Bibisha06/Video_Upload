import { useState } from "react";
import { Upload as UploadIcon, Video, Image as ImageIcon, CheckCircle, AlertCircle } from "lucide-react";
import API from "../api/axios";

const Upload = () => {
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!videoFile || !thumbnail) {
            setError("Please select both a video and a thumbnail.");
            return;
        }

        setUploading(true);
        setError("");

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("videoFile", videoFile);
        formData.append("thumbnail", thumbnail);

        try {
            await API.post("/videos", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setSuccess(true);
        } catch (err) {
            console.error("Upload error:", err);
            setError(err.response?.data?.message || "Failed to upload video. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-6 shadow-neon">
                    <CheckCircle className="text-primary" size={48} />
                </div>
                <h1 className="text-4xl font-black uppercase italic tracking-tighter">Neon Success!</h1>
                <p className="text-white/60 mt-2">Your video is now glowing on the platform.</p>
                <button
                    onClick={() => {
                        setSuccess(false);
                        setTitle("");
                        setDescription("");
                        setVideoFile(null);
                        setThumbnail(null);
                    }}
                    className="btn-primary mt-8"
                >
                    Upload Another
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-12 py-8">
            <header className="text-center">
                <h1 className="text-5xl font-black uppercase tracking-tighter italic leading-none">
                    Upload <span className="text-primary">Content</span>
                </h1>
                <p className="text-white/40 mt-4 uppercase text-xs font-black tracking-[0.3em]">Broadcast your vision to the world</p>
            </header>

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl flex items-center gap-3 text-red-500 text-sm max-w-3xl mx-auto">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-surface/30 p-8 rounded-3xl border border-border/50 backdrop-blur-sm shadow-2xl">

                <div className="lg:col-span-5 space-y-10">
                    <div className="space-y-4">
                        <label className="text-xs font-black uppercase tracking-widest text-primary/80 px-1 border-l-2 border-primary ml-1">Video Title</label>
                        <input
                            type="text"
                            placeholder="Give your video a catchy title..."
                            className="input-field bg-black/40 border-border/50 focus:border-primary text-lg h-14"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-xs font-black uppercase tracking-widest text-primary/80 px-1 border-l-2 border-primary ml-1">Description</label>
                        <textarea
                            placeholder="Tell your viewers what's happening in this video..."
                            className="input-field bg-black/40 border-border/50 focus:border-primary h-64 resize-none py-6 text-base"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>
                </div>


                <div className="lg:col-span-7 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                        <div className="space-y-4 flex flex-col">
                            <label className="text-xs font-black uppercase tracking-widest text-primary/80 px-1 border-l-2 border-primary ml-1">Master File</label>
                            <label className={`flex-1 flex flex-col items-center justify-center min-h-[250px] bg-black/40 border-2 border-dashed ${videoFile ? 'border-primary' : 'border-border/50'} rounded-2xl cursor-pointer hover:border-primary/50 transition-all group overflow-hidden relative shadow-inner`}>
                                <div className="z-10 flex flex-col items-center p-6 text-center">
                                    <div className={`p-4 rounded-full ${videoFile ? 'bg-primary/20' : 'bg-white/5'} group-hover:bg-primary/20 transition-colors mb-4`}>
                                        <Video className={`${videoFile ? 'text-primary' : 'text-white/40'} group-hover:text-primary transition-colors`} size={40} />
                                    </div>
                                    <span className="text-sm font-black uppercase tracking-widest text-white/80 group-hover:text-white leading-tight">
                                        {videoFile ? videoFile.name : 'Select Video Source'}
                                    </span>
                                    <p className="text-[10px] text-white/30 uppercase mt-2 font-bold">Standard MP4/WebM Formats</p>
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="video/*"
                                    onChange={(e) => setVideoFile(e.target.files[0])}
                                />
                            </label>
                        </div>

                        <div className="space-y-4 flex flex-col">
                            <label className="text-xs font-black uppercase tracking-widest text-primary/80 px-1 border-l-2 border-primary ml-1">Display Cover</label>
                            <label className={`flex-1 flex flex-col items-center justify-center min-h-[250px] bg-black/40 border-2 border-dashed ${thumbnail ? 'border-primary' : 'border-border/50'} rounded-2xl cursor-pointer hover:border-primary/50 transition-all group overflow-hidden relative shadow-inner`}>
                                <div className="z-10 flex flex-col items-center p-6 text-center">
                                    <div className={`p-4 rounded-full ${thumbnail ? 'bg-primary/20' : 'bg-white/5'} group-hover:bg-primary/20 transition-colors mb-4`}>
                                        <ImageIcon className={`${thumbnail ? 'text-primary' : 'text-white/40'} group-hover:text-primary transition-colors`} size={40} />
                                    </div>
                                    <span className="text-sm font-black uppercase tracking-widest text-white/80 group-hover:text-white leading-tight">
                                        {thumbnail ? thumbnail.name : 'Select Thumbnail'}
                                    </span>
                                    <p className="text-[10px] text-white/30 uppercase mt-2 font-bold">Recommended 1280x720</p>
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => setThumbnail(e.target.files[0])}
                                />
                            </label>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-12 flex justify-between items-center pt-8 border-t border-border/50 mt-4">
                    <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em]">By publishing, you agree to the Up-Vi Broadcast Protocols</p>
                    <button
                        type="submit"
                        disabled={uploading}
                        className="btn-primary flex items-center gap-4 px-12 h-16 shadow-neon-strong hover:scale-105 transition-transform"
                    >
                        {uploading ? (
                            <>
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span className="text-lg font-black uppercase">Transmitting...</span>
                            </>
                        ) : (
                            <>
                                <UploadIcon size={24} />
                                <span className="text-lg font-black uppercase">Publish Broadcast</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Upload;
