import express from 'express';
import { getAllContacts, getMessagesByUserId, sendMessage, getAllChattedPartners } from '../controllers/message.controller.js';

import { arcjetProtection } from '../middleware/arcjet.middleware.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();


//  arcjetProtection run 1st -> protectRoute -> other controller endpoints below.
router.use(arcjetProtection, protectRoute );   // protectRoute has req.user heheh.

router.get('/contacts', getAllContacts );  // get all users except logged in user.
router.get('/chats', getAllChattedPartners);  // get all users with whom loggedIn user has chatted.
router.get('/:id', getMessagesByUserId);  // get all messages between logged in user and user with :id
router.post('/send/:id', sendMessage );   // send message to user with :id







export default router;