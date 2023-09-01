import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
    res.sendFile('index.html', { root: './src/client/admin/geoword' });
});

router.get('/compare', async (req, res) => {
    res.sendFile('compare.html', { root: './src/client/admin/geoword' });
});

router.get('/leaderboard/:packetName', async (req, res) => {
    res.sendFile('leaderboard.html', { root: './src/client/admin/geoword' });
});

router.get('/protests/:packetName/:division', async (req, res) => {
    res.sendFile('protests.html', { root: './src/client/admin/geoword' });
});

router.get('/stats/:packetName/:division', async (req, res) => {
    res.sendFile('stats.html', { root: './src/client/admin/geoword' });
});

export default router;
