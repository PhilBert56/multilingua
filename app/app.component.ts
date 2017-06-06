import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { initializeApp, database} from 'firebase';
import { firebaseConfig } from '../environments/firebase.config';
import { AlertController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import { Network } from '@ionic-native/network';
import { NetworkStatus } from '../services/network';
/*
import {CalendarPage} from '../pages/calendar/calendar.component';
import {DatePickerPage} from '../pages/datepicker/datepicker';
*/

@Component({
  templateUrl: 'app.html'
})

export class MyApp {

  static exercisesFile : string;
  static calendarFile : string;
  static lessonsFile;
  static calendar : any = [];
  static exercisesAll : any = [];
  static lessonsAll : any =[];
  static teacherPhoneNumber : '';
  static teacherEmailAdress : '';

  rootPage:any = HomePage;
  items:any;

  constructor(
    platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen,
    public alertCtrl: AlertController,
    db:AngularFireDatabase,
    private network: Network,
    public netStat: NetworkStatus) {

      platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
        statusBar.styleDefault();
        splashScreen.hide();
      });

      var netStatus = netStat.getNetworkStatus(false);

      if (NetworkStatus.networkStatus  === 'none') {
        let alert = this.alertCtrl.create({
          title: 'Network Connection',
          subTitle: 'You are not connected',
          buttons: ['OK']
          });
        alert.present();
      } 
      else { 
        
        this.items = db.list('/teacher') ;
        const teach$ = db.object('Teacher');
        teach$.subscribe(console.log);
        const exercisesFile$ = db.object('Teacher/ExercisesFile');
        exercisesFile$.subscribe(console.log);
        const lessonsFile$ = db.object('Teacher/LessonsFile');
        lessonsFile$.subscribe(console.log);
        
      }

      var root = database().ref();
      root.on('value', function(snap) {

      var dataFirebase :any = snap.val();
  
      MyApp.exercisesFile = dataFirebase['Teacher'].ExercisesFile;
      MyApp.lessonsFile = dataFirebase['Teacher'].LessonsFile;
      MyApp.calendarFile = dataFirebase['Teacher'].CalendarFile;
      MyApp.teacherPhoneNumber = dataFirebase['Teacher'].PhoneNumber;
      MyApp.teacherEmailAdress = dataFirebase['Teacher'].Email;

console.log('Ex = '+ MyApp.exercisesFile + 'Lesson = '+ MyApp.lessonsFile )
    });

  }

}

