import { Router } from 'express';
const router = Router();
router.get('/', (req, res) => {
    res.sendFile('bonuses.html', { root: './src/client/singleplayer' });
});
export default router;
