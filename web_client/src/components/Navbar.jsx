import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Upload, User, LogOut, Search, Play } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            navigate(`/?query=${searchQuery}`);
            setSearchQuery("");
        }
    };

    return (
        <motion.nav 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="fixed top-0 w-full h-16 bg-white/70 backdrop-blur-2xl border-b border-border z-50 px-4 md:px-8 flex items-center justify-between"
            style={{ boxShadow: '0 4px 30px rgba(217, 70, 239, 0.05)' }}
        >
            <Link
                to="/"
                onClick={() => setSearchQuery("")}
                className="flex items-center gap-2.5 group"
            >
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent flex items-center justify-center rounded-xl group-hover:scale-105 transition-transform"
                    style={{ boxShadow: '0 4px 12px rgba(217, 70, 239, 0.25)' }}
                >
                    <Play className="fill-white text-white" size={18} />
                </div>
                <span className="text-xl font-extrabold tracking-tight group-hover:text-primary transition-colors text-text-main">
                    Up<span className="text-primary">Vi</span>
                </span>
            </Link>

            <div className="hidden md:flex flex-1 max-w-xl mx-8">
                <div className="relative w-full">
                    <input
                        type="text"
                        placeholder="Search videos..."
                        className="input-field pl-10 h-10 bg-background/80"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                    />
                    <Search className="absolute left-3 top-2.5 text-text-subtle" size={18} />
                </div>
            </div>

            <div className="flex items-center gap-3">
                {user ? (
                    <>
                        <Link to="/upload" className="btn-primary flex items-center gap-2 py-2 h-10">
                            <Upload size={16} />
                            <span className="text-sm font-semibold hidden sm:inline">Upload</span>
                        </Link>
                        <div className="flex items-center gap-3 pl-3 border-l border-border-strong">
                            <Link to="/dashboard">
                                <img
                                    src={user.avatar}
                                    alt={user.username}
                                    className="w-8 h-8 rounded-full border-2 border-primary-light hover:border-primary transition-colors cursor-pointer"
                                />
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-1.5 text-text-muted hover:text-primary transition-colors text-sm font-medium"
                            >
                                <LogOut size={16} />
                                <span className="hidden sm:inline text-sm">Sign Out</span>
                            </button>
                        </div>
                    </>
                ) : (
                    <Link to="/login" className="btn-primary py-2 h-10 flex items-center gap-2">
                        <User size={16} />
                        <span>Sign In</span>
                    </Link>
                )}
            </div>
        </motion.nav>
    );
};

export default Navbar;
