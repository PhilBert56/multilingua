
import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { AlertOK } from '../utils/alert';
import { Debug } from '../config/debug';
import { Exercise } from '../services/exercise';
import { ExerciseResults } from '../services/exercise.results';


@Injectable()

export class ExerciseServices {

    lessonId : number;
    exerciseName: string;
    question: string;
    possibleAnswers: [(string)];
    rightAnswer: string;
    explanation: string;

    constructor (
      private alertCtrl: AlertController,
      private exPattern: Exercise
      )
      {
        this.lessonId = exPattern.lessonId;
        this.exerciseName = exPattern.exerciseName;
        this.question = exPattern.question;
        this.possibleAnswers = exPattern.possibleAnswers;
        this.rightAnswer = exPattern.rightAnswer;
        this.explanation= exPattern.explanation;
       }

   
  manageAnswer(answer){
    if(Debug){console.log('Enter manageAnswer + ' , answer)};
      if(!answer){
        this.displayNoAnswer();
        return;
      }
      var ok : boolean = this.isAnswerCorrect(answer);
      if(Debug){console.log('ok is ' , ok)};
      this.displayAnswer(ok);
      this.logResult(answer,ok);
  }


  isAnswerCorrect(answer)  : boolean 
    {
      var answ : boolean = false;
      if (answer === this.rightAnswer) {
        answ = true;
    } 
    return answ;
  }


  displayAnswer(ok) {

    if(Debug){console.log('in displayAnswer ok is ' , ok)};

      var title : string;
      if (ok) {
        title = 'Good answer !';
      } else {
        title = 'Bad answer !';
      }

      let alert = this.alertCtrl.create({
        title: title,
        subTitle: this.explanation,
        buttons: ['Dismiss']
      });
      alert.present();
  }


  displayNoAnswer() {

    if(Debug){console.log('in displayAnswer ok is ')};
      var title : string = 'No answer !';
      let alert = this.alertCtrl.create({
       title: title,
        subTitle: 'Choose an aswer before Confirmation',
        buttons: ['OK']
      });
      alert.present();
  }


  logResult(answer : string , ok:boolean){
    // This will add result to the App static object holding all exercises results
    var result = new ExerciseResults (this.exPattern, answer, ok);
    result.insertIntoStudentResults();
  }


}



/*
isAnswerCorrectOLD(answer)  : boolean 
{
    var title : string;
    var answ : boolean = false;
    if (answer === this.rightAnswer) {
      title = 'Good answer !';
      answ = true;
    } else {
      title = 'Bad answer !';
    }
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: this.explanation,
      buttons: ['Dismiss']
    });
    alert.present();
    return answ;
 }*/
