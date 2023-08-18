import { getUserId, getUsername, isAdmin } from './users.js';

import { MongoClient, ObjectId } from 'mongodb';

const uri = `mongodb+srv://${process.env.MONGODB_USERNAME || 'geoffreywu42'}:${process.env.MONGODB_PASSWORD || 'password'}@qbreader.0i7oej9.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);
client.connect().then(async () => {
    console.log('connected to mongodb');
});

const rapidqb = client.db('rapidqb');
const audio = rapidqb.collection('audio');
const buzzes = rapidqb.collection('buzzes');
const packets = rapidqb.collection('packets');
const payments = rapidqb.collection('payments');
const teams = rapidqb.collection('teams');
const tossups = rapidqb.collection('tossups');
const tournaments = rapidqb.collection('tournaments');


function generateCode(length = 7) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
}

async function getAudio(tournamentName, packetNumber, questionNumber) {
    const tossup = await tossups.findOne({ 'tournament.name': tournamentName, 'packet.number': packetNumber, number: questionNumber });
    if (!tossup) {
        return null;
    }

    const audioFile = await audio.findOne({ _id: tossup.audio_id });
    return audioFile?.audio?.buffer;
}

async function getAnswer(tournamentName, packetNumber, questionNumber) {
    const tossup = await tossups.findOne({ 'tournament.name': tournamentName, 'packet.number': packetNumber, number: questionNumber });
    return tossup?.formatted_answer ?? tossup?.answer;
}

async function getMyTeamList(username) {
    const user_id = await getUserId(username);
    return await teams.aggregate([
        { $match: { 'players': user_id } },
        { $lookup: {
            from: 'tournaments',
            localField: 'tournament_id',
            foreignField: '_id',
            as: 'tournament',
        } },
        { $unwind: '$tournament' },
    ]).toArray();
}


async function getPacketLength(tournamentName, packetNumber) {
    return tossups.countDocuments({ 'tournament.name': tournamentName, 'packet.number': packetNumber });
}

/**
 *
 * @param {string} tournamentName
 * @param {number} packetNumber
 * @param {string} username
 * @returns
 */
async function getProgress(tournamentName, packetNumber, username) {
    const user_id = await getUserId(username);
    const result = await buzzes.aggregate([
        { $match: { 'tournament.name': tournamentName, 'packet.number': packetNumber, user_id } },
        { $group: {
            _id: null,
            numberCorrect: { $sum: { $cond: [ { $gt: ['$points', 0] }, 1, 0 ] } },
            points: { $sum: '$points' },
            totalCorrectCelerity: { $sum: { $cond: [ { $gt: ['$points', 0] }, '$celerity', 0 ] } },
            tossupsHeard: { $sum: 1 },
        } },
    ]).toArray();

    result[0] = result[0] || {};
    return result[0];
}

async function getPrompt(tournamentName, packetNumber, questionNumber) {
    const tossup = await tossups.findOne({ 'tournament.name': tournamentName, 'packet.number': packetNumber, number: questionNumber });
    return tossup?.prompt;
}

async function getTournamentList() {
    const tournamentList = await tournaments.find({}).toArray();
    return tournamentList;
}

/**
 *
 * @param {string} tournamentName
 * @returns
 */
async function getTournamentId(tournamentName) {
    const tournament = await tournaments.findOne({ name: tournamentName });
    return tournament._id;
}

/**
 *
 * @param {ObjectId} tournament_id
 * @returns
 */
async function getTournamentName(tournament_id) {
    const tournament = await tournaments.findOne({ _id: tournament_id });
    return tournament.name;
}


/**
 * @param {Object} params
 * @param {Decimal} params.celerity
 * @param {String} params.givenAnswer
 * @param {Boolean} params.isCorrect
 * @param {Number} params.packetNumber
 * @param {String[]} params.prompts - whether or not the buzz is a prompt
 * @param {Number} params.questionNumber
 * @param {ObjectId} params.tournament_id
 * @param {ObjectId} params.user_id
 */
async function recordBuzz({ celerity, givenAnswer, isCorrect, packetNumber, points, prompts, questionNumber, tournamentName, user_id }) {
    const username = await getUsername(user_id);
    const admin = await isAdmin(username);
    const tournament_id = await getTournamentId(tournamentName);
    const packet = await packets.findOne({ 'tournament._id': tournament_id, number: packetNumber });
    const tossup = await tossups.findOne({ 'tournament._id': tournament_id, 'packet.number': packetNumber, number: questionNumber });

    const insertDocument = {
        celerity,
        givenAnswer,
        isCorrect,
        isAdmin: admin,
        packet: {
            _id: packet._id,
            number: packetNumber,
        },
        points,
        tournament: {
            _id: tournament_id,
            name: tournamentName,
        },
        tossup: {
            _id: tossup._id,
            number: tossup.number,
        },
        user_id,
    };

    if (prompts && typeof prompts === 'object' && prompts.length > 0) {
        insertDocument.prompts = prompts;
    }

    return await buzzes.insertOne(insertDocument);
}

async function recordProtest(tournamentName, packetNumber, questionNumber, username) {
    const user_id = await getUserId(username);
    return await buzzes.updateOne(
        { user_id, 'tournament.name': tournamentName, 'packet.number': packetNumber, 'tossup.number': questionNumber },
        { $set: { pendingProtest: true } },
    );
}

/**
 *
 * @param {string} teamName
 * @param {ObjectId} captain_id - the user id of the captain (founding member) of the team
 * @param {string} tournamentName - the name of the tournament the team is registering for
 */
async function registerTeam(teamName, captain_id, tournamentName) {
    const _id = new ObjectId();
    let code = generateCode();

    const tournament_id = await tournaments.findOne({ name: tournamentName })._id;

    while (await teams.countDocuments({ code: code }) > 0) {
        code = generateCode();
    }

    teams.insertOne({
        _id: _id,
        name: teamName,
        code: code,
        captain_id: captain_id,
        tournament: {
            _id: tournament_id,
            name: tournamentName,
        },
        players: [captain_id],
    });

    return { _id, code };
}

export {
    getAnswer,
    getAudio,
    getMyTeamList,
    getPacketLength,
    getProgress,
    getPrompt,
    getTournamentList,
    getTournamentName,
    recordBuzz,
    recordProtest,
    registerTeam,
};
