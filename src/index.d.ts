import { CATEGORIES, SUBCATEGORIES_FLATTENED } from './constants.js';

import { ObjectId } from 'mongodb';


type Question = {
    _id: ObjectId;

    category: string;
    difficulty: number;
    subcategory: string;

    questionNumber: number;

    packet: {
        _id: ObjectId;
        name: string;
        number: number;
    };

    // These optional parameters are deprecated and should not be used.
    // Use `packet` instead.
    packet_id?: ObjectId;
    packetName?: string;
    packetNumber?: number;

    set: {
        _id: ObjectId;
        name: string;
        year: number;
    };

    // These optional parameters are deprecated and should not be used.
    // Use `set` instead.
    set_id?: ObjectId;
    setName?: string;
    setYear?: number;

    type: "tossup" | "bonus";
    createdAt: Date;
    updatedAt: Date;
};

type Tossup = Question & {
    question: string;
    answer: string;
    formatted_answer?: string;

    type: "tossup";
};

type Bonus = Question & {
    leadin: string;
    parts: string[];
    answers: string[];
    formatted_answers?: string[];

    // If either of these exist, then they should be the same length as `parts`.
    values: number[];
    difficulties: ("e" | "m" | "h")[];

    type: "bonus";
};

type Packet = {
    _id: ObjectId;

    name: string;
    number: number;

    set: {
        _id: ObjectId;
        name: string;
    };
}

type Set = {
    _id: ObjectId;

    name: string;
    year: number;

    difficulty: number;
}

type Category = typeof CATEGORIES[number];
type Subcategory = typeof SUBCATEGORIES_FLATTENED[number];

export type { Tossup, Bonus, Question, Packet, Set, Category, Subcategory };
