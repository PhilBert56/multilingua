import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
//import { Storage } from '@ionic/storage';
import { LessonsPage } from '../lessons/lessonsPage';
//import { Calendar } from '@ionic-native/calendar';
import { CalendarPage } from '../../pages/calendar/calendar.component';
//import { Network } from '@ionic-native/network';
//import { AlertController } from 'ionic-angular';
import { ContactPage} from '../contact/contact';
import { Help } from '../help/help';
import { StudentLogin } from '../../login/login';
import { MyApp } from '../../app/app.component';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})

export class HomePage {
  
  loginOk : boolean = MyApp.studentIsLogged;
  studentName : string ='';

  constructor(
    private navCtrl : NavController,
    private navParams : NavParams,
    private login : StudentLogin
    ) {

     this.loginOk = MyApp.studentIsLogged;
     this.studentName = MyApp.studentName;
    }

  

  showLessons() {this.navCtrl.push(LessonsPage)}
  showCoursesCalendar()  {this.navCtrl.push(CalendarPage)}
  showContactForm(){this.navCtrl.push(ContactPage)}
  showHelp(){this.navCtrl.push(Help)}

  studentLogin(){this.login.studentLogin(this.navCtrl) }
 
}



