import { registerTeam, getMyTeamList, getPacketLength, getProgress, getTournamentList, recordBuzz } from '../../database/rapidqb.js';
import { getUserId } from '../../database/users.js';
import { checkToken } from '../../server/authentication.js';

import { Router } from 'express';

const router = Router();

router.get('/my-team-list', async (req, res) => {
    const { username, token } = req.session;
    if (!checkToken(username, token)) {
        delete req.session;
        res.redirect('/geoword/login');
        return;
    }

    const tournamentList = await getMyTeamList(username);
    res.json({ tournamentList });
});

router.get('/packet-length', async (req, res) => {
    const { tournamentName, packetNumber } = req.query;
    const packetLength = await getPacketLength(tournamentName, parseInt(packetNumber));
    res.json({ packetLength });
});

router.get('/progress', async (req, res) => {
    const { username, token } = req.session;
    if (!checkToken(username, token)) {
        delete req.session;
        res.redirect('/geoword/login');
        return;
    }

    const { tournamentName, packetNumber } = req.query;
    const progress = await getProgress(tournamentName, parseInt(packetNumber), username);
    res.json(progress);
});

router.put('/record-buzz', async (req, res) => {
    const { username, token } = req.session;
    if (!checkToken(username, token)) {
        delete req.session;
        res.redirect('/geoword/login');
        return;
    }

    const { celerity, givenAnswer, packetNumber, points, prompts, questionNumber, tournamentName } = req.body;
    const user_id = await getUserId(username);

    await recordBuzz({
        celerity: parseFloat(celerity),
        givenAnswer,
        isCorrect: points > 0,
        packetNumber: parseInt(packetNumber),
        points: parseInt(points),
        prompts,
        questionNumber: parseInt(questionNumber),
        tournamentName,
        user_id,
    });

    res.sendStatus(200);
});

router.put('/register-team', async (req, res) => {
    const { username, token } = req.session;
    if (!checkToken(username, token)) {
        delete req.session;
        res.redirect('/geoword/login');
        return;
    }

    const { teamName, tournamentName } = req.body;
    const captain_id = await getUserId(username);
    await registerTeam(teamName, captain_id, tournamentName);
    res.sendStatus(200);
});

router.get('/tournament-list', async (req, res) => {
    const { username, token } = req.session;
    if (!checkToken(username, token)) {
        delete req.session;
        res.redirect('/geoword/login');
        return;
    }

    const tournamentList = await getTournamentList();
    res.json({ tournamentList });
});

export default router;
