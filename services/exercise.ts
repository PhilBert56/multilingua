
import { Injectable } from '@angular/core';

@Injectable()


export class Exercise {

    lessonId : number;
    exerciseName: string;
    question: string;
    possibleAnswers: [(string)];
    rightAnswer: string;
    explanation: string

}