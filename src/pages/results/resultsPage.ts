import { Component } from '@angular/core';
//import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LessonPage } from '../lesson/lessonPage';
import { ExercisesPage } from '../exercises/exercisesPage';
import { MyApp } from '../../app/app.component';
import { Debug } from '../../config/debug';
import { ResultServices } from '../../services/results.services';


@Component({
  selector: 'page-results',
  templateUrl: 'results.html'
})

export class ResultsPage {
  nGood : number = 0;
  nExercises : number = MyApp.studentResults.length;

  constructor(
    private resServ : ResultServices
    ) {
        if(Debug){console.log('inside ResultsPage')}
        if (MyApp.studentResults.length > 0)
        {
            for(var i = 0 ; i< this.nExercises ; i++){
                if (MyApp.studentResults[i].result) {this.nGood = this.nGood + 1};
            };

            this.resServ.logResults();
         }

      }

}


