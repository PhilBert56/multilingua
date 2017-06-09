import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ExerciseServices } from '../../services/exercise.services';
import { Exercise } from '../../services/exercise';
import { Debug } from '../../config/debug';

@Component({
  selector: 'page-exercises',
  templateUrl: 'exercisesPage.html'
})

export class ExercisesPage  {

 exercises:any;

 constructor(
   params: NavParams, 
   private alertCtrl : AlertController)
   {
      this.exercises = params.data;
   }


  respondToAnswer(exercise : object, answer : string ){
      if(Debug){console.log('Enter respondToAnswer + ' , answer)};
      if(Debug){console.log('exercise is  ' + JSON.stringify(exercise))};

      var exService = new ExerciseServices(this.alertCtrl,<Exercise> exercise);
  
      exService.manageAnswer(answer);


/*

      var ex : Exercise = new Exercise(this.alertCtrl);
      ex = <Exercise> exercise ;

      if(Debug){console.log('AFTER  => exercise ex is  ' + ex + JSON.stringify(ex))};

      if(Debug){console.log(ex.lessonId + '  ' + ex.exerciseName + ' ' + ex.question)};
      
      

      ex.sayHello();
*/
      //ex.manageAnswer(answer);
  }

/*

  isAnswerCorrect(exercise : Exercise, answer : string) {
    
    var title : string;
    if (answer === exercise.rightAnswer) {
      title = 'Good answer !';
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

*/


 





}
