import { AlertController } from 'ionic-angular';
import { Debug } from '../config/debug';
import { MyApp } from '../app/app.component';
import { Injectable } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../pages/home/home';
import { ResultServices } from '../services/results.services';

@Injectable()

export class StudentLogin {
  constructor(
    private alertCtrl: AlertController , 
    private resultServ : ResultServices ) {
  }

studentLogin(navCtrl:NavController){

  if(MyApp.studentIsLogged){
      let alert = this.alertCtrl.create({
      title: 'Your present login is correct',
      message: 'Do you want to change user ?',
      buttons: [
        {
          text: 'No',
          role: 'Cancel',
          handler: () => {
        }
       },
        {
          text: 'Yes',
          handler: () => {
           console.log('Yes');
           MyApp.studentIsLogged = false;
           navCtrl.push(HomePage);
           this.studentLogin(navCtrl);
         }
        }
      ]
    });
  alert.present();
  }

 if(MyApp.studentIsLogged){return};

    let prompt = this.alertCtrl.create({
      title: 'Login',
      message: "Login is required to see your course calendar and homework",
      inputs: [
        {
          name: 'Name',
          placeholder: 'Your name'
        },
        {
          name: 'Key',
          placeholder: 'Key given by your teacher'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            //just in case something should be donne after Cancel...
          }
        },
        {
          text: 'Confirm',
          handler: data => {
            if(Debug) {console.log('Saved clicked' + JSON.stringify(data) )};
          /* check if these login parameters exist in student list */
          
         
          MyApp.studentIsLogged = false;

          for ( var Std in MyApp.students) {
            if(MyApp.students[Std].Name === data.Name && MyApp.students[Std].Key === data.Key){
               MyApp.studentName = data.Name;
               MyApp.studentIsLogged = true;

               // To do : insérer un reset du tableau des résultats d'un élève si nécessaire
               this.resultServ.resetStudentResults();
               break
            }
          }

          navCtrl.push(HomePage);

          if (MyApp.studentIsLogged) {
             if(Debug){console.log( 'LOGIN OK')};
             //navCtrl.push(HomePage); // A way to refresh the login icon so that it reflects the login status
          } 
           
          else { 
             if(Debug) {console.log( 'LOGIN is NOT OK') } ; 
             //navCtrl.push(HomePage); // A way to refresh the login icon so that it reflects the login status
          }
          
        }
       }
      ]
    });
    prompt.present();
  }
}