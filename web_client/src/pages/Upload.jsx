import { useState } from "react";
import { Upload as UploadIcon, Video, Image as ImageIcon, CheckCircle, AlertCircle } from "lucide-react";
import API from "../api/axios";
import { motion } from "framer-motion";

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
        if (!videoFile || !thumbnail) { setError("Please select both a video and a thumbnail."); return; }
        setUploading(true);
        setError("");
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("videoFile", videoFile);
        formData.append("thumbnail", thumbnail);
        try {
            await API.post("/videos", formData, { headers: { "Content-Type": "multipart/form-data" } });
            setSuccess(true);
        } catch (err) {
            console.error("Upload error:", err);
            setError(err.response?.data?.message || "Failed to upload video. Please try again.");
        } finally { setUploading(false); }
    };

    if (success) {
        return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center justify-center py-20">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6" style={{ boxShadow: '0 8px 24px rgba(34,197,94,0.15)' }}>
                    <CheckCircle className="text-green-500" size={48} />
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-text-main">Upload Successful!</h1>
                <p className="text-text-muted mt-2">Your video is now live on the platform.</p>
                <button onClick={() => { setSuccess(false); setTitle(""); setDescription(""); setVideoFile(null); setThumbnail(null); }} className="btn-primary mt-8">Upload Another</button>
            </motion.div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-5xl mx-auto space-y-10 py-8">
            <header className="text-center">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-text-main">
                    Upload <span className="text-primary">Video</span>
                </h1>
                <p className="text-text-muted mt-3 text-sm">Share your content with the world</p>
            </header>

            {error && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-center gap-3 text-red-600 text-sm max-w-3xl mx-auto">
                    <AlertCircle size={20} /><span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 bg-white p-6 md:p-8 rounded-2xl border border-border" style={{ boxShadow: '0 8px 40px rgba(217,70,239,0.06)' }}>
                <div className="lg:col-span-5 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-text-main px-1 flex items-center gap-2">
                            <span className="w-1 h-4 bg-primary rounded-full"></span>Video Title
                        </label>
                        <input type="text" placeholder="Give your video a catchy title..." className="input-field text-base h-12" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-text-main px-1 flex items-center gap-2">
                            <span className="w-1 h-4 bg-primary rounded-full"></span>Description
                        </label>
                        <textarea placeholder="Tell your viewers what's happening in this video..." className="input-field h-52 md:h-64 resize-none py-4 text-sm" value={description} onChange={(e) => setDescription(e.target.value)} required />
                    </div>
                </div>

                <div className="lg:col-span-7 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                        <div className="space-y-2 flex flex-col">
                            <label className="text-sm font-semibold text-text-main px-1 flex items-center gap-2">
                                <span className="w-1 h-4 bg-primary rounded-full"></span>Video File
                            </label>
                            <label className={`flex-1 flex flex-col items-center justify-center min-h-[220px] bg-lavender/40 border-2 border-dashed ${videoFile ? 'border-primary' : 'border-border-strong'} rounded-2xl cursor-pointer hover:border-primary/50 transition-all group overflow-hidden relative`}>
                                <div className="z-10 flex flex-col items-center p-6 text-center">
                                    <div className={`p-4 rounded-full ${videoFile ? 'bg-primary-light' : 'bg-white/80'} group-hover:bg-primary-light transition-colors mb-3`}>
                                        <Video className={`${videoFile ? 'text-primary' : 'text-text-subtle'} group-hover:text-primary transition-colors`} size={36} />
                                    </div>
                                    <span className="text-sm font-medium text-text-main">{videoFile ? videoFile.name : 'Select Video'}</span>
                                    <p className="text-xs text-text-subtle mt-1">MP4, WebM formats</p>
                                </div>
                                <input type="file" className="hidden" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} />
                            </label>
                        </div>
                        <div className="space-y-2 flex flex-col">
                            <label className="text-sm font-semibold text-text-main px-1 flex items-center gap-2">
                                <span className="w-1 h-4 bg-primary rounded-full"></span>Thumbnail
                            </label>
                            <label className={`flex-1 flex flex-col items-center justify-center min-h-[220px] bg-pink-soft/40 border-2 border-dashed ${thumbnail ? 'border-primary' : 'border-border-strong'} rounded-2xl cursor-pointer hover:border-primary/50 transition-all group overflow-hidden relative`}>
                                <div className="z-10 flex flex-col items-center p-6 text-center">
                                    <div className={`p-4 rounded-full ${thumbnail ? 'bg-primary-light' : 'bg-white/80'} group-hover:bg-primary-light transition-colors mb-3`}>
                                        <ImageIcon className={`${thumbnail ? 'text-primary' : 'text-text-subtle'} group-hover:text-primary transition-colors`} size={36} />
                                    </div>
                                    <span className="text-sm font-medium text-text-main">{thumbnail ? thumbnail.name : 'Select Thumbnail'}</span>
                                    <p className="text-xs text-text-subtle mt-1">Recommended 1280×720</p>
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => setThumbnail(e.target.files[0])} />
                            </label>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-12 flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-border mt-2">
                    <p className="text-xs text-text-subtle">By uploading, you agree to the UpVi community guidelines</p>
                    <button type="submit" disabled={uploading} className="btn-primary flex items-center gap-3 px-8 md:px-12 h-14 text-base w-full sm:w-auto justify-center">
                        {uploading ? (
                            <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Uploading...</span></>
                        ) : (
                            <><UploadIcon size={20} /><span>Publish Video</span></>
                        )}
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

export default Upload;
