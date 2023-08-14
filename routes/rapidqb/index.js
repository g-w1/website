import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    res.sendFile('index.html', { root: './client/rapidqb' });
});

router.get('/home', (req, res) => {
    res.sendFile('home.html', { root: './client/rapidqb' });
});

router.get('/registration', (req, res) => {
    res.sendFile('registration.html', { root: './client/rapidqb' });
});

export default router;
