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
import { EmailComposer } from '@ionic-native/email-composer';
import { File } from '@ionic-native/file';
import { Transfer} from '@ionic-native/transfer';
import { FileOpener } from '@ionic-native/file-opener';
import { FilePath } from '@ionic-native/file-path';
import { AngularFireModule } from 'angularfire2';
import {firebaseConfig} from '../environments/firebase.config';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { NgCalendarModule } from 'ionic2-calendar';
import {CalendarPage} from '../pages/calendar/calendar.component';
//import { DatePickerModule } from 'datepicker-ionic2';
import {DatePickerPage} from '../pages/datepicker/datepicker'
import { Network } from '@ionic-native/network';
import { ExternalRessources } from '../pages/externalsrc/externalsrc';
import { NetworkStatus } from '../services/network';
import { ContactPage} from '../pages/contact/contact';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LessonPage,
    LessonsPage,
    ExercisesPage,
    ExternalRessources,
    CalendarPage,
    DatePickerPage,
    ContactPage
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
    ExternalRessources,
    DatePickerPage,
    ContactPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Calendar,
    Contacts,
    SMS,
    EmailComposer,
    File,
    Transfer,
    FileOpener,
    FilePath,
    Network,
    NetworkStatus,
    ExternalRessources
  ]
})
export class AppModule {}
