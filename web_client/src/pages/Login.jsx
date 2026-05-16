import { Link, useNavigate } from "react-router-dom";
import { Play, ArrowRight, User, Lock, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

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
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-gradient-to-br from-background via-pink-soft to-lavender flex items-center justify-center p-6"
        >
            <Navbar />
            <motion.div 
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 100 }}
                className="w-full max-w-md space-y-8 relative z-10"
            >
                <div className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl mb-4"
                        style={{ boxShadow: '0 8px 24px rgba(217, 70, 239, 0.3)' }}
                    >
                        <Play className="fill-white text-white ml-0.5" size={28} />
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-text-main">Welcome back</h1>
                    <p className="text-text-muted text-sm">Sign in to continue to UpVi</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-center gap-3 text-red-600 text-sm">
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}

                <div className="bg-white border border-border p-8 rounded-2xl relative overflow-hidden"
                    style={{ boxShadow: '0 8px 40px rgba(217, 70, 239, 0.08)' }}
                >
                    <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary via-accent to-secondary" />

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-text-muted px-1">Username</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Enter your username or email"
                                    className="input-field pl-10"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                                <User className="absolute left-3 top-3 text-text-subtle" size={18} />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between px-1">
                                <label className="text-sm font-medium text-text-muted">Password</label>
                                <button type="button" className="text-sm font-medium text-primary hover:text-primary-hover transition-colors">Forgot?</button>
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
                                <Lock className="absolute left-3 top-3 text-text-subtle" size={18} />
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className="btn-primary w-full h-12 flex items-center justify-center gap-2 text-base"
                        >
                            {loading ? "Signing in..." : (
                                <>
                                    <span>Sign In</span>
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-sm text-text-muted">
                    Don't have an account? <Link to="/signup" className="text-primary hover:text-primary-hover font-semibold transition-colors ml-1">Sign Up</Link>
                </p>
            </motion.div>
        </motion.div>
    );
};

export default Login;
