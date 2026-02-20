import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-black">
            <Navbar />
            <main className="pt-20 pb-10 px-4 md:px-8 max-w-[1600px] mx-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
