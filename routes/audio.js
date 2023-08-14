import { Router } from 'express';
const router = Router();

router.get('/*.mp3', (req, res) => {
    res.sendFile(req.url, { root: './audio' });
});

export default router;
