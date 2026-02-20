import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Upload, User, LogOut, Search, Play } from "lucide-react";
import { useAuth } from "../context/AuthContext";

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
        <nav className="fixed top-0 w-full h-16 bg-black border-b border-border z-50 px-4 md:px-8 flex items-center justify-between">
            <Link
                to="/"
                onClick={() => setSearchQuery("")}
                className="flex items-center gap-2 group"
            >
                <div className="w-10 h-10 bg-primary flex items-center justify-center rounded shadow-neon group-hover:scale-105 transition-transform">
                    <Play className="fill-white text-white" size={20} />
                </div>
                <span className="text-xl font-black tracking-tighter uppercase italic group-hover:text-primary transition-colors">
                    Up-<span className="text-primary">Vi</span>
                </span>
            </Link>

            <div className="hidden md:flex flex-1 max-w-xl mx-8">
                <div className="relative w-full">
                    <input
                        type="text"
                        placeholder="Search neon videos..."
                        className="input-field pl-10 h-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                    />
                    <Search className="absolute left-3 top-2.5 text-border" size={18} />
                </div>
            </div>

            <div className="flex items-center gap-4">
                {user ? (
                    <>
                        <Link to="/upload" className="btn-primary flex items-center gap-2 py-1.5 h-10">
                            <Upload size={18} />
                            <span className="text-xs font-black uppercase tracking-wider">Upload</span>
                        </Link>
                        <div className="flex items-center gap-3 pl-4 border-l border-border">
                            <img
                                src={user.avatar}
                                alt={user.username}
                                className="w-8 h-8 rounded-full border border-primary/50"
                            />
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 text-border hover:text-primary transition-colors text-xs font-black uppercase tracking-widest"
                            >
                                <LogOut size={18} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Sign Out</span>
                            </button>
                        </div>
                    </>
                ) : (
                    <Link to="/login" className="btn-primary py-1.5 h-10 flex items-center gap-2">
                        <User size={18} />
                        <span>Sign In</span>
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
