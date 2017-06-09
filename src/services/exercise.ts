
import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { Debug } from '../config/debug';

@Injectable()

export class Exercise {

    lessonId : number;
    exerciseName: string;
    question: string;
    possibleAnswers: [(string)];
    rightAnswer: string;
    explanation: string;

    constructor (
      private alertCtrl : AlertController
   ){ }

sayHello(){
  if(Debug){console.log('HELLO from ex = ' + this.lessonId + '  ' + this.exerciseName + ' ' + this.question)}
}

manageAnswer(answer){
  if(Debug){console.log('Enter manageAnswer + ' , answer)};
    var ok : boolean = this.isAnswerCorrect(answer);
  if(Debug){console.log('ok is ' , ok)};
    this.displayAnswer(ok);
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
 }

}