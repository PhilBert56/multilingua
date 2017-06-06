import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { initializeApp, database} from 'firebase';
import {firebaseConfig} from '../environments/firebase.config';
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

  rootPage:any = HomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      

      });

      initializeApp(firebaseConfig);


      var root = database().ref();
      root.on('value', function(snap) {
      console.log(snap.val());

      var dataFirebase :any = snap.val();
      console.log('OBJET = ', dataFirebase);
      console.log (dataFirebase['Teacher']);
      MyApp.exercisesFile = dataFirebase['Teacher'].ExercisesFile;
      MyApp.lessonsFile = dataFirebase['Teacher'].LessonsFile;
      MyApp.calendarFile = dataFirebase['Teacher'].CalendarFile;

    });

  }
}

