import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Play, ArrowRight, User, Lock, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await API.post("/users/login", {
                username,
                password
            });

            const { accessToken, user } = response.data.data;
            localStorage.setItem("accessToken", accessToken);
            await login(user);
            navigate("/");
        } catch (err) {
            console.error("Login error:", err);
            setError(err.response?.data?.message || "Invalid credentials or network error.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6">
            <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-neon mb-4 rotate-3">
                        <Play className="fill-white text-white ml-1" size={32} />
                    </div>
                    <h1 className="text-4xl font-black italic tracking-tighter uppercase">Neon <span className="text-primary">Login</span></h1>
                    <p className="text-white/60 uppercase text-[10px] font-black tracking-widest">Access your neon universe</p>
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
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/60 px-1">Identity</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Username or Email"
                                    className="input-field pl-10"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                                <User className="absolute left-3 top-2.5 text-white/40" size={18} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between px-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/60">Secret Key</label>
                                <button type="button" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Forgot?</button>
                            </div>
                            <div className="relative">
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="input-field pl-10"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <Lock className="absolute left-3 top-2.5 text-white/40" size={18} />
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className="btn-primary w-full h-12 flex items-center justify-center gap-2"
                        >
                            {loading ? "Authenticating..." : (
                                <>
                                    <span>Login Now</span>
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-xs text-white/60 font-black uppercase tracking-widest">
                    New to the network? <Link to="/signup" className="text-primary hover:underline italic ml-1">Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
