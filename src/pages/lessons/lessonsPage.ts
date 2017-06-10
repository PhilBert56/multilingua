
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LessonPage } from '../lesson/lessonPage';
import { ExercisesPage } from '../exercises/exercisesPage';
import { MyApp } from '../../app/app.component';
import { Debug } from '../../config/debug';

import { DataService } from '../../dataservice/data.service';
import { ExternalFilesConfig } from '../../config/configfile';
import { database } from 'firebase';
import { NetworkServices } from '../../network/network'
import { AlertOK } from '../../utils/alert';

@Component({
  selector: 'page-lessons',
  templateUrl: 'lessons.html'
})

export class LessonsPage {

  lastLesson : number = 1; // valeur par défaut
  homework : boolean = false;

  constructor(
    private storage : Storage, 
    private navCtrl : NavController,
    private navParams : NavParams,
    private dataServ: DataService,
    private alertCtrl : AlertOK
    ) 
    {this.getLastLesson();
    this.isThereHomeworkToBeDone()}


  getLastLesson() {
    // Retrouver le numéo de la dernière leçon dans le local storage
    this.storage.get('lastLesson')
    .then((data)=> {
        this.lastLesson =  data ; 
        if(Debug) {console.log('last lesson = ' + data)}
    })
    .catch((err)=> {
      console.log(err);
      this.lastLesson = 1;
    });
  }


  displayLesson(lessonNumber) {
    
    this.lastLesson = Math.min (Math.max(lessonNumber,1) , MyApp.lessonsAll.length);
    // pour gérer les butées sur leçon 1 ou leçon max

    this.storage.set('lastLesson',this.lastLesson).then (()=>{});
    // pour sauver en local storage la leçon en cours d'étude

    var lesson = MyApp.lessonsAll.find(it => it.id === this.lastLesson);
    // une façon "élégante" de retrouver les données de la leçon correspondant à lastLesson !

    this.navCtrl.push(LessonPage, lesson);
  }

  displayExercises(lessonId) {
    
    // Il faut pouvoir intégrer des exercises de la leçon précédente
    var ExercisesTabCurrentLesson = [] ;
    var ExercisesTabPreviousLesson = [] ;
    var ExercisesToDisplay =[];

    // Récupération des exercices de la leçon courrante et de la précédente (si leçon > 1)
    for (let exo of MyApp.exercisesAll ) {
      if (exo.lessonId === lessonId){
        ExercisesTabCurrentLesson.push(exo);
      };
      if (lessonId > 1 && exo.lessonId === (lessonId - 1) ){
        ExercisesTabPreviousLesson.push(exo);
      };
    };
    
    /*  
        constitution de la liste des exercices : 
        nombre d'exercices de la leçon courante = numberOfExercisesPerLesson - numberOfPreviousLessonExercises
        nombre d'exercices de la leçon précédente = numberOfPreviousLessonExercises 
        
        Remarque :
        si la base de donnée des exercices contient moins d'exercices que le nombre d'exercices demandés
        alors il faut se limiter au nombre d'exercices réellement disponibles pour cette leçon
    */

    var imax1 = Math.min (ExercisesTabCurrentLesson.length, (MyApp.numberOfExercisesPerLesson - MyApp.numberOfPreviousLessonExercises));
    // imax1 est le nombre maxi d'exercices de la leçon courante qu'il est possible de proposer
    if(Debug){console.log('Constitution de la liste des exercices =>', [MyApp.numberOfExercisesPerLesson], 'exercices de la leçon courante et  = ', [MyApp.numberOfPreviousLessonExercises] , ' de la leçon précédente')};


    var i = 0;
    var indice = 0;

    if ( lessonId > 1) {
      var imax2 = Math.min (ExercisesTabPreviousLesson.length,MyApp.numberOfPreviousLessonExercises);
      // imax2 est le nombre maxi d'exercices de la leçon précédente qu'il est possible de proposer

      if(Debug){console.log('Constitution de la liste des exercices => imax1 = ' , [imax1] , ' imax2 = ', [imax2])};

      while (i < imax1) {
        indice = Math.floor(Math.random() * ExercisesTabCurrentLesson.length); 
        // (on tire un exercice au hasard dans la liste des exercices)
        ExercisesToDisplay.push (ExercisesTabCurrentLesson [indice]);
        ExercisesTabCurrentLesson.splice(indice, 1);
        i++;
      }
      i = 0;
      while (i < imax2) {
        indice = Math.floor(Math.random() * ExercisesTabPreviousLesson.length); 
        // (on tire un exercice au hasard dans la liste des exercices)
        ExercisesToDisplay.push ( ExercisesTabPreviousLesson [indice]);
        ExercisesTabPreviousLesson.splice(indice, 1);
        i++;
      }
    } else
    {
      // si première leçon alors pas d'exercice antérieur
      while (i <= imax1) {
        indice = Math.floor(Math.random() * ExercisesTabCurrentLesson.length);
        ExercisesToDisplay.push (ExercisesTabCurrentLesson [indice]);
        ExercisesTabCurrentLesson.splice(indice, 1);
        i++;
      }
    };

    this.navCtrl.push(ExercisesPage, ExercisesToDisplay);

  }

  isThereHomeworkToBeDone(){

      if (!MyApp.studentIsLogged) {
        this.homework = false;
        return
      }


      for ( var Std in MyApp.students) {
        if(MyApp.students[Std].Name === MyApp.studentName && MyApp.students[Std].homeWork) {
          this.homework = true;
          return
      }

    }

  }

  manageHomework(){
    var root = database().ref();
    root.on('value', function(snap) {
        var dataFirebase:any = snap.val();
        MyApp.students = dataFirebase['Students'];
        
        for (var Std in MyApp.students){
          if(MyApp.students[Std].Name === MyApp.studentName && MyApp.students[Std].homeWork){
              MyApp.homeworkFileURL = MyApp.students[Std].homeWorkFile
          }
        }
    });
    this.dataServ.loadFileFromCloud(ExternalFilesConfig.homeworkFileName, MyApp.homeworkFileURL);
    setTimeout( 
      () => {
      if(Debug) {console.log('launching importFilesFromCloud for Homework at '+ new Date() )};
      var platformPath : string = this.dataServ.getPlatformPath();
      var fullPath = platformPath + ExternalFilesConfig.dir;
      this.dataServ.buildArrayFromJSONFile(fullPath, ExternalFilesConfig.homeworkFileName, 'homework');
      },
     1000 );

     setTimeout( 
      () => { this.displayHomework() },
     2000 );

    }


    displayHomework( ){

      if(Debug){console.log ('Entering into displayHomework ; network is '+ MyApp.connectionStatus )};

      if(MyApp.connectionStatus === 'ok')
      {
      var ExercisesToDisplay =[];
      for (let exo of MyApp.homework ) { ExercisesToDisplay.push(exo)};
      this.navCtrl.push(ExercisesPage, ExercisesToDisplay);
      } 
      else 
      {

        this.alertCtrl.showAlert('Network Connection is not OK','Homework cannot be loaded');
      }
    }




}
