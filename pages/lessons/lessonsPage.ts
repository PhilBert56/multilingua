
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
//import {Lessons} from '../../data/lessons';
import { LessonPage } from '../lesson/lessonPage';
//import {Exercises} from '../../data/exercises';
import { ExercisesPage } from '../exercises/exercisesPage';
import { MyApp } from '../../app/app.component';
import { ExternalRessources } from '../../pages/externalsrc/externalsrc';

@Component({
  selector: 'page-lessons',
  templateUrl: 'lessons.html'
})

export class LessonsPage {

  lastLesson : number = 1;

  constructor(
    private storage : Storage, 
    private navCtrl : NavController,
    private navParams : NavParams,
    private externalRessources : ExternalRessources
  ) {
      this.getLastLesson();
      console.log ('appel initializeExternalRessources');
      this.externalRessources.initializeExternalRessources()
  }

  getLastLesson() {
    console.log('je viens d entrer dans getLastLesson');
    // Retrouver le numéo de la dernière leçon dans le local storage
    this.storage.get('lastLesson')
    .then((data)=> {this.lastLesson =  data ; console.log('last lesson = ' + data)})
    .catch((err)=> {
      console.log(err);
      this.lastLesson = 1;
    });
    console.log('je sors de getLastLesson');
  }

  displayLesson(lessonNumber) {
    console.log('here in displayLesson with lessonNumber = '+ lessonNumber );
    console.log('here in displayLesson  = '+ MyApp.lessonsAll.length );

    this.lastLesson = Math.min (Math.max(lessonNumber,1) , MyApp.lessonsAll.length);
    this.storage.set('lastLesson',this.lastLesson).then (()=>{});
    //console.log('looking for lesson = '+ this.lastLesson + 'in ' + MyApp.lessonsAll );


    console.log('va rechercher MyApp.lessonsAll pour lesson = '+this.lastLesson );

    var lesson = MyApp.lessonsAll.find(it => it.id === this.lastLesson);

    console.log ('ICI LESSON = ' + lesson);
    this.navCtrl.push(LessonPage, lesson);
  }

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
    console.log(ExercisesTabCurrentLesson);
    console.log(ExercisesTabPreviousLesson);

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

  }

}




