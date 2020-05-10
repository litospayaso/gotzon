import { ExerciseInterface } from '@interfaces/databaseInterface';

export interface CorrectionInterface {
    exercise: ExerciseInterface;
    response: string;
}

export interface TranslatedInterface {
    word: string;
    trans: string[];
    examples: string[];
    language: string;
    url: string;
}
