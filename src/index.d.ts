import { ObjectId } from 'mongodb';

type question = {
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

type tossup = question & {
    question: string;
    answer: string;
    formatted_answer?: string;

    type: "tossup";
};

type bonus = question & {
    leadin: string;
    parts: string[];
    answers: string[];
    formatted_answers?: string[];

    // If either of these exist, then they should be the same length as `parts`.
    values: number[];
    difficulties: ("e" | "m" | "h")[];

    type: "bonus";
};

type packet = {
    _id: ObjectId;

    name: string;
    number: number;

    set: {
        _id: ObjectId;
        name: string;
    };
}

type set = {
    _id: ObjectId;

    name: string;
    year: number;

    difficulty: number;
}

export type { tossup, bonus, packet, set };
