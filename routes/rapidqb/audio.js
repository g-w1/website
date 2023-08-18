import { getAudio } from '../../database/rapidqb.js';

import { Router } from 'express';

const router = Router();

router.get('/game/:tournamentName/:packetNumber/:questionNumber.mp3', async (req, res) => {
    const { tournamentName, packetNumber, questionNumber } = req.params;
    const audio = await getAudio(tournamentName, parseInt(packetNumber), parseInt(questionNumber));
    res.send(audio);
});

router.get('*.mp3', (req, res) => {
    res.sendFile(req.url, { root: './audio/rapidqb' });
});

export default router;
