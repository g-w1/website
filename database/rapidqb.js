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


/**
 *
 * @param {string} tournamentName
 * @param {number} packetNumber
 * @param {string} username
 * @returns
 */
async function getProgress(tournamentName, packetNumber, username) {
    const user_id = await getUserId(username);
    const tournament_id = await getTournamentId(tournamentName);
    const result = await buzzes.aggregate([
        { $match: { 'tournament._id': tournament_id, 'packet.number': packetNumber, user_id } },
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


async function getTournamentList() {
    const tournamentList = await tournaments.find({}).toArray();
    return tournamentList;
}


/**
 *
 * @param {string} teamName
 * @param {ObjectId} captain_id - the user id of the captain (founding member) of the team
 * @param {ObjectId} tournament_id - the tournament id of the tournament the team is registering for
 */
async function registerTeam(teamName, captain_id, tournament_id) {
    const _id = new ObjectId();
    let code = generateCode();

    while (await teams.countDocuments({ code: code }) > 0) {
        code = generateCode();
    }

    teams.insertOne({ _id: _id, name: teamName, code: code, captain_id: captain_id, tournament_id: tournament_id, players: [captain_id] });
    return { _id, code };
}

export { getProgress, getTournamentList, registerTeam };
