import { Router } from 'express';
import {
    toggleVideoLike,
    addComment,
    getVideoComments,
    toggleSubscription
} from '../controllers/social.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();



router.route("/like/v/:videoId").post(verifyJWT, toggleVideoLike);
router.route("/comment/:videoId").post(verifyJWT, addComment).get(getVideoComments);
router.route("/subscribe/:channelId").post(verifyJWT, toggleSubscription);

export default router;
