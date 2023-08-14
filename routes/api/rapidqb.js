import { registerTeam, getTournamentList } from '../../database/rapidqb.js';
import { getUserId } from '../../database/users.js';
import { checkToken } from '../../server/authentication.js';

import { Router } from 'express';
import { ObjectId } from 'mongodb';

const router = Router();

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

export default router;
