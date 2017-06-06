import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import {Exercise} from '../../services/exercise';

@Component({
  selector: 'page-exercises',
  templateUrl: 'exercisesPage.html'
})

export class ExercisesPage  {

 exercises:any;

 constructor(params: NavParams, private alertCtrl : AlertController){
    this.exercises = params.data;
  }

  isAnswerCorrect(exercise : Exercise, answer : string) {
    console.log ('Checking the answer ' + answer + 'compared to '+ exercise.rightAnswer );

    var title : string;
    if (answer === exercise.rightAnswer) {
      title = 'Good answer !'
    } else {
      title = 'Bad answer !'
    }
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: exercise.explanation,
      buttons: ['Dismiss']
    });
    alert.present();
  }
}
