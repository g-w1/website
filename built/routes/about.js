import { Router } from 'express';
const router = Router();
router.get('/', (req, res) => {
    res.sendFile('about.html', { root: './src/client' });
});
export default router;
