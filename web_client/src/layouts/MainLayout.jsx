import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";

const MainLayout = () => {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <motion.div 
                    animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[100px]" 
                />
                <motion.div 
                    animate={{ x: [0, -100, 0], y: [0, 50, 0] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/15 blur-[120px]" 
                />
            </div>

            <Navbar />
            
            <main className="pt-24 pb-10 px-4 md:px-8 max-w-[1600px] mx-auto relative z-10">
                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Outlet />
                </motion.div>
            </main>
        </div>
    );
};

export default MainLayout;

