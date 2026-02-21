#  UP-Vi

A comprehensive video-sharing platform featuring a robust **Express** backend and a modern **React** frontend.

---

## �️ Tech Stack

### Backend
- **Core**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Services**: Cloudinary (Media Storage), JWT (Auth), Multer (File Parsing)

### Frontend (`web_client`)
- **Core**: React 19, Vite
- **Styling**: Tailwind CSS, Framer Motion (Animations)
- **State/API**: TanStack Query, Axios, Lucide React (Icons)

---

##  Structure
- `/src`: Backend controllers, models, and routes.
- `/web_client`: React frontend source.
- `/public`: Static assets and temporary file storage.

---

##  Quick Start

### 1. Requirements
- Node.js (v18+)
- MongoDB & Cloudinary accounts

### 2. Setup
```bash
# Clone and install
npm install
cd web_client && npm install
```

### 3. Environment
Add a `.env` in the root with your credentials:
`PORT`, `MONGODB_URI`, `ACCESS_TOKEN_SECRET`, `CLOUDINARY_API_KEY`, etc.

### 4. Run
- **Backend**: `npm run dev` (from root)
- **Frontend**: `npm run dev` (inside `web_client`)

---


