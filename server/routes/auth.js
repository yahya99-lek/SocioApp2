import express, { Router } from 'express';
import { login } from '../controllers/auth.js';

const router = express.Router();

router.post("/login", login);
router.get("/cc", (req, res) => {

    res.json({msg: 'cc'})
})

export default router;