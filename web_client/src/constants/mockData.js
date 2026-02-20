export const MOCK_VIDEOS = [
    {
        _id: "1",
        title: "NEON NIGHTS: Future of Architecture",
        description: "Explore the neon-lit streets of 2077 in this cinematic journey.",
        thumbnail: "https://images.unsplash.com/photo-1627384113743-6bd5a479fffd?q=80&w=2070&auto=format&fit=crop",
        videoFile: "https://www.w3schools.com/html/mov_bbb.mp4",
        duration: 180,
        views: 12400,
        createdAt: new Date().toISOString(),
        owner: {
            fullName: "CyberBibisha",
            username: "bibisha06",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bibisha"
        }
    },
    {
        _id: "2",
        title: "The Red Code: Mastery in JavaScript",
        description: "Advanced patterns for the modern developer.",
        thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
        videoFile: "https://www.w3schools.com/html/movie.mp4",
        duration: 450,
        views: 89000,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        owner: {
            fullName: "Tech Guru",
            username: "techguru",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Guru"
        }
    },
    {
        _id: "3",
        title: "Abstract Motion Design 101",
        description: "Learn how to create flowing neon shapes in After Effects.",
        thumbnail: "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=2070&auto=format&fit=crop",
        videoFile: "https://www.w3schools.com/html/mov_bbb.mp4",
        duration: 1200,
        views: 5600,
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        owner: {
            fullName: "Bibisha Design",
            username: "bdesign",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Design"
        }
    }
];
