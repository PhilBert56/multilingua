import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

//import {Exercises} from '../../data/exercises';
import {ExercisesPage} from '../exercises/exercisesPage';
import {MyApp} from '../../app/app.component';


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


/*
 displayExercises(lessonId) {
    
    // Il faut pouvoir intégrer des exercises de la leçon précédente
    var ExercisesTabCurrentLesson = [] ;
    var ExercisesTabPreviousLesson = [] ;
    var ExercisesToDisplay =[];

    // Récupération des exercices de la leçon courrante et de la précédente (si leçon > 1)
    for (let exo of MyApp.exercisesAll ) {
      if ( exo.lessonId === lessonId){
        ExercisesTabCurrentLesson.push(exo);
      };
      if (lessonId > 1 && exo.lessonId === (lessonId - 1) ){
        ExercisesTabPreviousLesson.push(exo);
      };
    };
    

    // constitution de la liste des exercices : 7 de la leçon courrante et 3 de la leçon précédente
    
    var imax = Math.min (ExercisesTabCurrentLesson.length, 4);
    var imax1 = Math.min (ExercisesTabCurrentLesson.length, 2);
    var i = 0;
    var indice = 0

    if ( lessonId > 1) {
      var imax2 = Math.min (ExercisesTabPreviousLesson.length, 2);
      
      while (i < imax1) {
        indice = Math.floor(Math.random() * ExercisesTabCurrentLesson.length );
        ExercisesToDisplay.push ( ExercisesTabCurrentLesson [indice]);
        ExercisesTabCurrentLesson.splice(indice, 1);
        i++;
      }
      i = 0;
      while (i < imax2) {
        indice = Math.floor(Math.random() * ExercisesTabPreviousLesson.length );
        ExercisesToDisplay.push ( ExercisesTabPreviousLesson [indice]);
        ExercisesTabPreviousLesson.splice(indice, 1);
        i++;
      }
    } else
    {
      while (i <= imax1) {
        indice = Math.floor(Math.random() * ExercisesTabCurrentLesson.length );
        ExercisesToDisplay.push ( ExercisesTabCurrentLesson [indice]);
        ExercisesTabCurrentLesson.splice(indice, 1);
        i++;
      }
    };
    this.navCtrl.push(ExercisesPage, ExercisesToDisplay);
  }*/
 }


