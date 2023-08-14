import { registerTeam, getMyTeamList, getPacketLength, getProgress, getTournamentList, getTournamentName, recordBuzz } from '../../database/rapidqb.js';
import { getUserId } from '../../database/users.js';
import { checkToken } from '../../server/authentication.js';

import { Router } from 'express';
import { ObjectId } from 'mongodb';

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
    const { tournament_id, packetNumber } = req.query;
    try {
        const packetLength = await getPacketLength(new ObjectId(tournament_id), parseInt(packetNumber));
        res.json({ packetLength });
    } catch (error) {
        res.sendStatus(400);
    }
});

router.get('/progress', async (req, res) => {
    const { username, token } = req.session;
    if (!checkToken(username, token)) {
        delete req.session;
        res.redirect('/geoword/login');
        return;
    }

    const { tournament_id, packetNumber } = req.query;
    try {
        const progress = await getProgress(new ObjectId(tournament_id), parseInt(packetNumber), username);
        res.json(progress);
    } catch (error) {
        res.sendStatus(400);
    }
});

router.put('/record-buzz', async (req, res) => {
    const { username, token } = req.session;
    if (!checkToken(username, token)) {
        delete req.session;
        res.redirect('/geoword/login');
        return;
    }

    let { celerity, givenAnswer, packetNumber, points, prompts, questionNumber, tournament_id } = req.body;
    try {
        celerity = parseFloat(celerity);
        packetNumber = parseInt(packetNumber);
        points = parseInt(points);
        questionNumber = parseInt(questionNumber);
        tournament_id = new ObjectId(tournament_id);
    } catch (error) {
        res.sendStatus(400);
        return;
    }

    const user_id = await getUserId(username);
    await recordBuzz({
        celerity,
        givenAnswer,
        isCorrect: points > 0,
        packetNumber,
        points,
        prompts,
        questionNumber,
        tournament_id: new ObjectId(tournament_id),
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

    const { teamName, tournament_id } = req.body;
    const captain_id = await getUserId(username);
    await registerTeam(teamName, captain_id, new ObjectId(tournament_id));
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

router.get('/tournament-name', async (req, res) => {
    const { tournament_id } = req.query;
    try {
        const tournamentName = await getTournamentName(new ObjectId(tournament_id));
        res.json({ tournamentName });
    } catch (error) {
        res.sendStatus(400);
    }
});

export default router;
