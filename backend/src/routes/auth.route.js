import express from 'express';

import { signup, login, logout, updateProfile } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

import { arcjetProtection } from '../middleware/arcjet.middleware.js';

const router = express.Router();



router.use(arcjetProtection);  // Run Arcjet security middleware before all auth endpoints below.

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

router.post('/updateProfile', protectRoute, updateProfile);


// check if the user is authenticated to access protected routes...usually when page is refreshed.
router.get('/testAuth', protectRoute, (req, res) => {
    res.status(200).json({ message: "You are authorized to access this route.", user: req.user });
});



export default router;