import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { Debug } from '../config/debug';
import { Exercise } from '../services/exercise';
import { MyApp } from '../app/app.component';

@Injectable()

export class ExerciseResults {
    lessonId : number;
    question : string;
    answer : string;
    result : boolean;

    constructor(ex: Exercise, answ : string, result : boolean) {
        this.lessonId = ex.lessonId;
        this.question = ex.question;
        this.answer = answ;
        this.result = result;
    }


    insertIntoStudentResults() {
        
        MyApp.studentResults.push(this);
        if(Debug){console.log ('insertIntoStudentResults => ' + this + JSON.stringify(this))}

    }

}