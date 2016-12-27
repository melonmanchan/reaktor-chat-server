import express from 'express';
import channels from '../channels';

const router = express.Router();

router.get('/', (req, res, next) => {
    return res.status(200).json({ channels });
});

export default router;
