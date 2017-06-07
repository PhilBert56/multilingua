import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import {IonicStorageModule} from '@ionic/storage';
import {LessonPage} from '../pages/lesson/lessonPage';
import {LessonsPage} from '../pages/lessons/lessonsPage';
import {ExercisesPage} from '../pages/exercises/exercisesPage';
import {Calendar} from '@ionic-native/calendar';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';
import { SMS } from '@ionic-native/sms';
//import { EmailComposer } from '@ionic-native/email-composer';
import { File } from '@ionic-native/file';
import { Transfer} from '@ionic-native/transfer';
import { FileOpener } from '@ionic-native/file-opener';
import { FilePath } from '@ionic-native/file-path';
import { AngularFireModule } from 'angularfire2';
import { firebaseConfig} from '../firebase/firebase.config';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { NgCalendarModule } from 'ionic2-calendar';
import { CalendarPage} from '../pages/calendar/calendar.component';
import { Network } from '@ionic-native/network';
import { ContactPage} from '../pages/contact/contact';
import { NetworkServices } from '../network/network';
import { FirebaseInterface } from '../firebase/firebase';
import { DataService } from '../dataservice/data.service';
import { ArrayOfObjectsFromJSONFile } from '../dataservice/arrayofObjectsFromJSONFile';
import { CallNumber } from '@ionic-native/call-number';
import { StudentLogin } from '../login/login';
import { Help } from '../pages/help/help';
import { AlertOK } from '../utils/alert'
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Exercise } from '../services/exercise';
import { ExerciseServices} from '../services/exercise.service';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LessonPage,
    LessonsPage,
    ExercisesPage,
    CalendarPage,
    ContactPage,
    Help
  ],
  imports: [
    NgCalendarModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LessonPage,
    LessonsPage,
    ExercisesPage,
    CalendarPage,
    ContactPage,
    Help
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Calendar,
    LocalNotifications,
    Contacts,
    SMS,
    //EmailComposer,
    File,
    Transfer,
    FileOpener,
    FilePath,
    Network,
    NetworkServices,
    FirebaseInterface,
    DataService,
    CallNumber,
    StudentLogin,
    AlertOK,
    Exercise,ExerciseServices
  ]
})
export class AppModule {}
