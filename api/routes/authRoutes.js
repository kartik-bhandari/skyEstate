import express from 'express'
import { google, signOutUSer, signin, signup } from '../controllers/authControllers.js';

const router = express.Router();

router.post('/signup' , signup)
router.post('/signin' , signin)
router.post('/google' , google)
router.get('/signout' , signOutUSer)


export default router;