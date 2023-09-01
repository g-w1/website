import adminRouter from './admin.js';
import checkAnswerRouter from './check-answer.js';
import geowordRouter from './geoword.js';
import multiplayerRouter from './multiplayer.js';
import numPacketsRouter from './num-packets.js';
import packetBonusesRouter from './packet-bonuses.js';
import packetTossupsRouter from './packet-tossups.js';
import packetRouter from './packet.js';
import queryRouter from './query.js';
import randomBonusRouter from './random-bonus.js';
import randomNameRouter from './random-name.js';
import randomTossupRouter from './random-tossup.js';
import reportQuestionRouter from './report-question.js';
import setListRouter from './set-list.js';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
const router = Router();
// Apply the rate limiting middleware to API calls only
router.use(rateLimit({
    windowMs: 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
}));
// express encodes same parameter passed multiple times as an array
// this middleware converts it to a single value
router.use((req, _res, next) => {
    for (const key in req.query) {
        if (Array.isArray(req.query[key])) {
            req.query[key] = req.query[key].reduce((a, b) => a + ',' + b);
        }
    }
    next();
});
router.use('/admin', adminRouter);
router.use('/check-answer', checkAnswerRouter);
router.use('/geoword', geowordRouter);
router.use('/multiplayer', multiplayerRouter);
router.use('/num-packets', numPacketsRouter);
router.use('/packet-bonuses', packetBonusesRouter);
router.use('/packet-tossups', packetTossupsRouter);
router.use('/packet', packetRouter);
router.use('/query', queryRouter);
router.use('/random-bonus', randomBonusRouter);
router.use('/random-name', randomNameRouter);
router.use('/random-tossup', randomTossupRouter);
router.use('/report-question', reportQuestionRouter);
router.use('/set-list', setListRouter);
export default router;
