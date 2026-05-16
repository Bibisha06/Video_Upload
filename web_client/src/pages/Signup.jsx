import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Play, ArrowRight, User, Mail, Camera, ShieldCheck, Plus, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

const Signup = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        setAvatar(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setAvatarPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!avatar) { setError("Please upload a profile picture."); return; }
        setLoading(true);
        setError("");
        const formData = new FormData();
        formData.append("fullName", fullName);
        formData.append("username", username);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("avatar", avatar);
        try {
            await API.post("/users/register", formData, { headers: { "Content-Type": "multipart/form-data" } });
            navigate("/login");
        } catch (err) {
            console.error("Signup error:", err);
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally { setLoading(false); }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-gradient-to-br from-background via-pink-soft to-lavender flex items-center justify-center p-6 py-12"
        >
            <Navbar />
            <motion.div 
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 100 }}
                className="w-full max-w-xl space-y-8 relative z-10"
            >
                <div className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl mb-4" style={{ boxShadow: '0 8px 24px rgba(217,70,239,0.3)' }}>
                        <Play className="fill-white text-white ml-0.5" size={28} />
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-text-main">Create Account</h1>
                    <p className="text-text-muted text-sm">Join UpVi and start sharing your content</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-center gap-3 text-red-600 text-sm">
                        <AlertCircle size={20} /><span>{error}</span>
                    </div>
                )}

                <div className="bg-white border border-border p-6 md:p-8 rounded-2xl relative overflow-hidden" style={{ boxShadow: '0 8px 40px rgba(217,70,239,0.08)' }}>
                    <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary via-accent to-secondary" />
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="flex flex-col items-center mb-4">
                            <label className="relative group cursor-pointer">
                                <div className="w-24 h-24 bg-lavender border-2 border-dashed border-border-strong rounded-full flex items-center justify-center group-hover:border-primary/50 transition-all overflow-hidden">
                                    {avatarPreview ? <img src={avatarPreview} className="w-full h-full object-cover" alt="Preview" /> : <Camera className="text-text-subtle group-hover:text-primary transition-colors" size={32} />}
                                </div>
                                <div className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full" style={{ boxShadow: '0 4px 12px rgba(217,70,239,0.3)' }}><Plus size={14} /></div>
                                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                            </label>
                            <span className="text-sm text-text-muted mt-3 font-medium">Upload Photo</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-text-muted px-1">Full Name</label>
                                <input type="text" placeholder="Your Name" className="input-field" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-text-muted px-1">Username</label>
                                <div className="relative">
                                    <input type="text" placeholder="username" className="input-field pl-10" value={username} onChange={(e) => setUsername(e.target.value)} required />
                                    <User className="absolute left-3 top-3 text-text-subtle" size={18} />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-text-muted px-1">Email</label>
                            <div className="relative">
                                <input type="email" placeholder="you@example.com" className="input-field pl-10" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                <Mail className="absolute left-3 top-3 text-text-subtle" size={18} />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-text-muted px-1">Password</label>
                            <div className="relative">
                                <input type="password" placeholder="••••••••" className="input-field pl-10" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                <ShieldCheck className="absolute left-3 top-3 text-text-subtle" size={18} />
                            </div>
                        </div>
                        <button disabled={loading} className="btn-primary w-full h-12 flex items-center justify-center gap-2 text-base mt-2">
                            {loading ? "Creating account..." : <><span>Create Account</span><ArrowRight size={18} /></>}
                        </button>
                    </form>
                </div>
                <p className="text-center text-sm text-text-muted">
                    Already have an account? <Link to="/login" className="text-primary hover:text-primary-hover font-semibold transition-colors ml-1">Sign In</Link>
                </p>
            </motion.div>
        </motion.div>
    );
};

export default Signup;
