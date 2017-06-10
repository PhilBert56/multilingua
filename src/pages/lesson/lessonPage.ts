import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

//import {Exercises} from '../../data/exercises';
import {ExercisesPage} from '../exercises/exercisesPage';
import {MyApp} from '../../app/app.component';
import {HomePage} from '../home/home';

@Component({
  selector: 'page-lesson',
  templateUrl: 'lessonPage.html'
})


export class LessonPage {
  
  lesson:any;
  

  constructor(
    private navCtrl : NavController,
    private navParams: NavParams
    )
    { this.lesson = navParams.data }
  




  displayThisLessonExercises(lessonId){
    var ExercisesTabCurrentLesson = [] ;
    var ExercisesToDisplay =[];
    // Récupération des exercices de la leçon courrante
      for (let exo of MyApp.exercisesAll ) {
        if ( exo.lessonId === lessonId){ExercisesTabCurrentLesson.push(exo);};
      };
    // _________________________________________________
    var imax = Math.min (ExercisesTabCurrentLesson.length, MyApp.numberOfExercisesPerLesson);
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

  showHome(){this.navCtrl.push(HomePage)}




  

 }


