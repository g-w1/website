import { Router } from 'express';
const router = Router();
router.get('/', (req, res) => {
    res.sendFile('index.html', { root: './src/client/multiplayer' });
});
router.get('/*', (req, res) => {
    res.sendFile('room.html', { root: './src/client/multiplayer' });
});
export default router;
