import { Router } from 'express';

import audioRouter from './audio.js';

const router = Router();

router.get('/', (req, res) => {
    res.sendFile('index.html', { root: './client/rapidqb' });
});

router.use('/audio', audioRouter);

router.get('/game/:tournament', (req, res) => {
    res.sendFile('game.html', { root: './client/rapidqb' });
});

router.get('/home', (req, res) => {
    res.sendFile('home.html', { root: './client/rapidqb' });
});

router.get('/registration', (req, res) => {
    res.sendFile('registration.html', { root: './client/rapidqb' });
});

export default router;
