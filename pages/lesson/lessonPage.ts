import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import {Exercises} from '../../data/exercises';
import {ExercisesPage} from '../exercises/exercisesPage';

@Component({
  selector: 'page-lesson',
  templateUrl: 'lessonPage.html'
})


export class LessonPage {
  
  lesson:any;

  constructor(
    private navCtrl : NavController,
    private navParams: NavParams
    ){
      console.log(navParams);
      this.lesson = navParams.data;
      console.log('leçon numéro ' + navParams.get('id'));
    }
  
  displayThisLessonExercises(lessonId){
    var ExercisesTabCurrentLesson = [] ;
    var ExercisesToDisplay =[];
    // Récupération des exercices de la leçon courrante
    for (let exo of Exercises ) {
      if ( exo.lessonId === lessonId){
        ExercisesTabCurrentLesson.push(exo);
      };
    };
    
    var imax = Math.min (ExercisesTabCurrentLesson.length, 4);
    var i = 0;
    var indice = 0

    while (i < imax) {
        indice = Math.floor(Math.random() * ExercisesTabCurrentLesson.length );
        ExercisesToDisplay.push ( ExercisesTabCurrentLesson [indice]);
        ExercisesTabCurrentLesson.splice(indice, 1);
        i++;
      };
     
    this.navCtrl.push(ExercisesPage, ExercisesToDisplay);

  }

 }


