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
