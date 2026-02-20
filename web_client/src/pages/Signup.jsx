import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Play, ArrowRight, User, Mail, Camera, ShieldCheck, Plus, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

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
        if (!avatar) {
            setError("Please upload an avatar identity.");
            return;
        }

        setLoading(true);
        setError("");

        const formData = new FormData();
        formData.append("fullName", fullName);
        formData.append("username", username);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("avatar", avatar);

        try {
            await API.post("/users/register", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });


            navigate("/login");
        } catch (err) {
            console.error("Signup error:", err);
            setError(err.response?.data?.message || "Cloud connection or validation failure.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 py-12">
            <div className="w-full max-w-xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-neon mb-4 rotate-3">
                        <Play className="fill-white text-white ml-1" size={32} />
                    </div>
                    <h1 className="text-4xl font-black italic tracking-tighter uppercase">Neon <span className="text-primary">Signup</span></h1>
                    <p className="text-white/60 uppercase text-[10px] font-black tracking-widest">Establish your position in the universe</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl flex items-center gap-3 text-red-500 text-sm">
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}

                <div className="bg-surface border border-border p-8 rounded-2xl shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex flex-col items-center mb-8">
                            <label className="relative group cursor-pointer">
                                <div className="w-24 h-24 bg-black border-2 border-dashed border-border rounded-full flex items-center justify-center group-hover:border-primary/50 transition-all overflow-hidden">
                                    {avatarPreview ? (
                                        <img src={avatarPreview} className="w-full h-full object-cover" alt="Preview" />
                                    ) : (
                                        <Camera className="text-border group-hover:text-primary transition-colors" size={32} />
                                    )}
                                </div>
                                <div className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-neon">
                                    <Plus size={16} />
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                />
                            </label>
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/60 mt-3">Upload Avatar</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/60 px-1">Full Identity</label>
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    className="input-field"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/60 px-1">Public Handle</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="username"
                                        className="input-field pl-10"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                    <User className="absolute left-3 top-2.5 text-white/40" size={18} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/60 px-1">Grid Mail</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="voyager@neon.net"
                                    className="input-field pl-10"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <Mail className="absolute left-3 top-2.5 text-white/40" size={18} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/60 px-1">Secret Key</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="input-field pl-10"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <ShieldCheck className="absolute left-3 top-2.5 text-white/40" size={18} />
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className="btn-primary w-full h-12 flex items-center justify-center gap-2 mt-4"
                        >
                            {loading ? "Establishing Presence..." : (
                                <>
                                    <span>Join Neon</span>
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-xs text-white/60 font-black uppercase tracking-widest">
                    Already authorized? <Link to="/login" className="text-primary hover:underline italic ml-1">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
