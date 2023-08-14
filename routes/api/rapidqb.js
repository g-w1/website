import { registerTeam, getTournamentList } from '../../database/rapidqb.js';
import { getUserId } from '../../database/users.js';
import { checkToken } from '../../server/authentication.js';

import { Router } from 'express';
import { ObjectId } from 'mongodb';

const router = Router();

export default router;
