import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {Storage} from '@ionic/storage';

import {Lessons} from '../../data/lessons';
import {LessonPage} from '../lesson/lessonPage';
import {Exercises} from '../../data/exercises';

import {ExercisesPage} from '../exercises/exercisesPage';

import { Calendar } from '@ionic-native/calendar';
import { Contacts } from '@ionic-native/contacts';
import { SMS } from '@ionic-native/sms';

import { EmailComposer } from '@ionic-native/email-composer';
import { initializeApp, database} from 'firebase';

import { File } from '@ionic-native/file';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { FileOpener } from '@ionic-native/file-opener';
import { FilePath } from '@ionic-native/file-path';

import { AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';

import { MyApp} from '../../app/app.component';
import { Platform, MenuController, Nav } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { CalendarPage } from '../../pages/calendar/calendar.component';
import { Network } from '@ionic-native/network';
import { AlertController } from 'ionic-angular';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  static networkStatus :any;

  lastLesson : number = 1;
  
  fileTransfer: TransferObject = this.transfer.create();
  items:any;
  
  @ViewChild(Nav) nav: Nav;

  constructor(
    private storage : Storage, 
    private navCtrl : NavController,
    private navParams : NavParams,
    private calendar : Calendar,
    private contacts: Contacts,
    private sms: SMS,
    private emailComposer: EmailComposer,
    private transfer: Transfer,
    private file:File,
    private fileOpener : FileOpener,
    private filePath: FilePath,
    db:AngularFireDatabase,
    afAuth: AngularFireAuth,
    public menu: MenuController,
    private network: Network,
    public alertCtrl: AlertController
    ) {
      this.getLastLesson();

      var netStatus = this.getNetworkStatus();
      console.log ('NETSTATUS = ' + netStatus);

      if (HomePage.networkStatus  === 'none') {
        let alert = this.alertCtrl.create({
          title: 'Network Connection',
          subTitle: 'You are not connected',
          buttons: ['OK']
          });
        alert.present();
      } 
      else { 

        this.items = db.list('/teacher') ;
        console.log ('items = ' + this.items);

        const teach$ = db.object('Teacher');
        teach$.subscribe(console.log);

        const exercisesFile$ = db.object('Teacher/ExercisesFile');
        exercisesFile$.subscribe(console.log);

        console.log('exercisesFile = '+ exercisesFile$ [0] )
      }
    
    }


  getNetworkStatus() {

      let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
        console.log('network was disconnected :-(');
          let alert = this.alertCtrl.create({
          title: 'Network Connection',
          subTitle: 'Network has been disconnected',
          buttons: ['OK']
          });
        alert.present();
      });

      let connectSubscription = this.network.onConnect().subscribe(() => {
        console.log('Network connected!');
        // We just got a connection but we need to wait briefly
        // before we determine the connection type. Might need to wait.
        // prior to doing any api requests as well.
        console.log('Network Connection = ' + this.network.type);
        console.log('Network Perf = ' + this.network.downlinkMax);
        
        setTimeout(() => {
          if (this.network.type === 'wifi') {
              console.log('We got a wifi connection');
            }
          }, 3000);
        });
        HomePage.networkStatus = this.network.type;
        return this.network.type;
  }



  getLastLesson() {
    // Retrouver le numéo de la dernière leçon dans le local storage
    this.storage.get('lastLesson').then((data)=> {
      console.log("last lesson = " + data);
      this.lastLesson =  data ;
    });
  
  }


  displayLesson(lessonNumber) {
    // Ecrire dans le local storage le numéro de la leçon en cours de visualisation
    this.lastLesson = Math.min (Math.max(lessonNumber,1) , Lessons.length);
    this.storage.set('lastLesson',this.lastLesson).then (()=>{});
    // Rechercher les données relatives à la leçon en cours
    console.log ("will display lesson " + this.lastLesson);
    //this.lesson = LessonService.getLesson(this.lastLesson);
    var lesson = Lessons.find(it => it.id === this.lastLesson);
    console.log (lesson);
    this.navCtrl.push(LessonPage, lesson);
  }


  displayExercises(lessonId) {
    
    // Il faut pouvoir intégrer des exercises de la leçon précédente
    var ExercisesTabCurrentLesson = [] ;
    var ExercisesTabPreviousLesson = [] ;
    var ExercisesToDisplay =[];

    // Récupération des exercices de la leçon courrante et de la précédente (si leçon > 1)
    for (let exo of Exercises ) {
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

  createMyCalendar() {
    var options = this.calendar.getCalendarOptions();
    options.calendarName = "MyCalendar1";
    this.calendar.createCalendar(options);
  }
  
/*
  displayCalendar (){


    this.createMyCalendar();

    this.calendar.listCalendars().then( 
      (msg) => { console.log('list Cal = ' + msg); },
      (err) => { console.log('list Cal ERR = ' +err); },
    );


    var title ='new event';
    var location = 'here';
    var notes ='notes';

    var startDate = new Date(new Date().getTime() + 3*24*60*60*1000);
    var endDate =  new Date(new Date().getTime() + 4*24*60*60*1000);

    this.calendar.createEventInteractively(title, location, notes, startDate, endDate);
    console.log ('Event added : '+ title + '  '+ startDate + '  '+ endDate);


    startDate = new Date(new Date().getTime() + 2*24*60*60*1000);
    endDate =  new Date(new Date().getTime() + 6*24*60*60*1000);
    console.log('Calling eventList');

    var eventList = this.calendar.listEventsInRange(startDate, endDate)
    
    .then ( ()=> {
      console.log('INISDE Promise eventList');
      console.log('Catching eventList = '+ eventList + JSON.stringify (eventList))
    
    });

    console.log('events in eventlist =  ' +  eventList + JSON.stringify(eventList) );
    /*
    .then (result => {
      console.log ('HERE in then');
      console.log('events in eventlist =  ' + JSON.stringify(result) + 'eventList' + JSON.stringify(eventList) );
    })
    .catch((ex)=> {
      console.log('HERE in ex');
      console.log('Errror ' + ex)
    });

   console.log('Après : '+ eventList);
   var eventList2 = this.calendar.listEventsInRange(startDate, endDate);
   console.log('Et : '+ JSON.stringify(eventList2) );

  } ;
  */

  displayContact(){

    this.contacts.pickContact()
    .then (contact => {
      console.log('contact : ', contact, 'hoice = '+ JSON.stringify(contact) );
      console.log( contact.displayName);
      console.log('phone number = '+ JSON.stringify(contact.phoneNumbers));
      console.log('phone number = ' + contact.phoneNumbers[0].value);
    });

  }
  
  sendSMS(){
    var root = database().ref('Teacher');
    var self = this;

    root.on('value', function(snap) {
      var phoneNumber = snap.val().PhoneNumber;
      console.log('message envoyé à '+ snap.key + ' ' + JSON.stringify (snap.val()) );
      console.log('Phone Number is ' + phoneNumber);
      self.sms.send (phoneNumber, 'Message envoyé depuis mon application');

      });
    //this.sms.send('0630531825', 'Message envoyé depuis mon application');
    
   }

  sendEmail(){

    let email = {
      to: 'phil-bert@club-internet.fr',
      cc: '',
      bcc: [],
      attachments: [],
      subject: 'Ionic native email',
      body: 'New Email from Ionic App',
      isHtml: true
     };

    // Send a text message using default options
    this.emailComposer.open(email);
    }



    public openCalendar():void{
    this.calendar.openCalendar(new Date());

  }

  loadExercisesFile(){
    var netStatus = this.getNetworkStatus();
    if (netStatus  === 'none') {
        let alert = this.alertCtrl.create({
          title: 'Trying to reach Internet Cloud (Firebase)',
          subTitle: 'But you are not connected',
          buttons: ['OK']
          });
        alert.present();
        return;
      } 
      
    var path = this.file.externalRootDirectory + 'Android/';
    var dir = 'data';

    console.log('Check if exists dir = '+ path + dir);

    this.file.checkDir(path,dir)

    .then ( 
      (res) => {
        
        console.log('res = '+ res) 
        var dir2 = path + dir +'/';
        var f = dir2 +'myFile.json';
        
        console.log ('Va lire le fichier firebase : ' + MyApp.exercisesFile);

        const url = MyApp.exercisesFile;
        this.fileTransfer.download(url, f, true)
        .then(
          (entry) => {
            console.log('download complete: ' + entry.toURL());
          }, 
    );
  
      },
      (err) => {console.log('err in CheckDir = '+ JSON.stringify(err)  + 'dir = '+ path + dir) }
    );

  
 }


checkFile(){

    var fileName = 'myFile.json';
    var fullPath = this.file.externalRootDirectory + 'Android/data/';

    this.filePath.resolveNativePath(fullPath)
      .then(
        (filePath) => {
          console.log('filePath = ' + filePath);
          this.file.readAsText(filePath, fileName).then(
            (res) => {
              console.log ('reading file' + filePath + fileName + 'rep = ' + res);

              /*JSON.parse(res).then( 
                (r) => { console.log (r + JSON.parse(res) )},
                (e) => { console.log (e) } 
              );*/
              console.log (JSON.parse(res));
        
            },
            (err) => {console.log ('reading file = ' + filePath + fileName + ' ; error = ' + JSON.stringify(err))}
          );
        })
      .catch(err => console.log('in resolveNativePath, '+  err));
    }

openCourseCalendar()  {
    this.navCtrl.push(CalendarPage);
  }

}

