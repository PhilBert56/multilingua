import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { HomePage } from '../pages/home/home'
import { firebaseConfig } from '../firebase/firebase.config';
import { AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import { Network } from '@ionic-native/network';
import { NetworkStatus } from '../services/network';
import { NetworkServices} from '../network/network';
import { FirebaseInterface } from '../firebase/firebase';
import { DataService } from '../dataservice/data.service';
import { Debug } from '../config/debug';
import { AlertOK } from '../utils/alert';
import * as firebase from "firebase"; //Don't ask me why, but it works !

@Component({
  templateUrl: 'app.html'
})

export class MyApp /*implements OnChanges*/ {

  static platformIs : string;

/* 
  Lessons and exercises are loaded into static variables attribute of MyApp
  so they can be accessed by every class in the App
*/
  static lastLesson : number;

/* data files directory existence (usefull if network disconnected and data already loaded) */
  static dataDirectoryExistsOnDevice = false;

/* file links to allow download from Firebase */
  static exercisesFileURL : string;
  static calendarFileURL : string;
  static lessonsFileURL : string;

/* data arrays for data download from Firebase */
  static calendar : any = new Array;
  static exercisesAll : any = new Array;
  static lessonsAll : any = new Array; 

/* Teacher info */
  static teacherPhoneNumber : '';
  static teacherEmailAdress : '';
  static students : any;
  static studentName :string = '';
  static studentKey : string = '';
  static studentIsLogged : boolean = false;
  static numberOfExercisesPerLesson : number;
  static numberOfPreviousLessonExercises : number;
  static studentResults : any;
  
/* Network Info */
  static connectionStatus : string = 'no';
  static connectionAtStartUp : boolean = false;
  static networkHasBeenDisconnected : boolean = false;


  rootPage:any = HomePage;
  items:any;

  constructor(
    platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen,
    private storage : Storage,
    private network: Network,
    private netServ : NetworkServices,
    public firebaseInterface : FirebaseInterface,
    private dataServ : DataService,
    private alert: AlertOK) 
    
    {
      
      if(Debug){console.log ('Platform is ' + platform._platforms)};
      if(Debug){console.log ('App starts at ' + new Date())};

      if( platform.is('android') ) { MyApp.platformIs = 'android'};
      if( platform.is('ios') ) { MyApp.platformIs = 'ios'};
      if( platform.is('windows') ) { MyApp.platformIs = 'windows'};

      if(Debug){ console.log ('PLATFORM is ' + MyApp.platformIs)};


      platform.ready().then(() => {
        // The platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
          statusBar.styleDefault();
          splashScreen.hide();


          // first of all : is the network available to communicate with the world ?
          this.netServ.checkNetworkStatus();

          if (MyApp.connectionStatus === 'ok')
          /* If Network ok */
          {
              if(Debug) {console.log('NetworkConnection is OK => get new set of data from Firebase')};
              MyApp.connectionAtStartUp = true;

              /* First task : downlod data from Firebase database */
              if(Debug) {console.log('launching getDataFromFirebase at '+ new Date())};
              //this.dataServ.loadDataFromScratch();
              
              this.firebaseInterface.getDataFromFirebase();
      
              /* Second task : downlod data files from Firebase storage to device */

// TEMPORARY SOLUTION : shoud be able to start the import from cloud as soon as firebase data importation done
// it generally takes about 3 seconds to dowload data from Firebase so timeout is set to 5 seconds
              setTimeout( 
                  () => {
                    if(Debug) {console.log('launching importFilesFromCloud at '+ new Date() )};
                    this.dataServ.importFilesFromCloud();
                  },
              5000 );

              /* Then store locally anything you need to be able to work even if Network is not available */
              setTimeout( 
                  () => {
                    if(Debug) {console.log("storing locally teacher's data at "+ new Date() )};
                    this.storage.set('teacherPhoneNumber', MyApp.teacherPhoneNumber).then (()=>{});
                    this.storage.set('teacherEmailAdress', MyApp.teacherEmailAdress).then (()=>{});
                    this.storage.set('students', MyApp.students).then (()=>{});
                    this.storage.set('numberOfExercisesPerLesson', MyApp.numberOfExercisesPerLesson).then (()=>{});
                    this.storage.set('numberOfPreviousLessonExercises', MyApp.numberOfPreviousLessonExercises).then (()=>{});
                  },
              5000 );

               /* Import data from files already stored on device */

// TEMPORARY SOLUTION : shoud be able to start the data import from device files as soon as files have been transfered
// it takes about 2 seconds to dowload data from Firebase so timeout is set to 4 + 3 = 7 secondes
            setTimeout( 
                  () => {
                    this.dataServ.importAllFromDevice();
                    if(Debug) {console.log('launching importAllFromDevice at '+ new Date() )};
                  }
              ,7000);

  
          } // end of if Network 
          
          else {

          /* if no network connection : there is no need to wait before launching data importation from on-device files */
          
              if(Debug){console.log ( 'testing data dir existence at :' + new Date() )}
              this.dataServ.checkIfDataDirectoryExists();

              setTimeout( 
                  () => {
                          if(Debug){console.log ( 'back from testing data dir existence' +' at :' + new Date() )}
                          if (MyApp.dataDirectoryExistsOnDevice) {
                           /* Import data from files already stored on device */
                          this.dataServ.importAllFromDevice();
                          if(Debug) {console.log('launching importAllFromDevice at '+ new Date() )};
                        } else {
                          if(Debug){console.log('NO DATA FOUND ONSTORAGE => WAIT FOR A NETWORK CONNECTION TO USE THIS APP !!!!')};
                          this.alert.showAlert ('No Data on device', 'Wait until you are network connected to load lessons and exercises');
                        }

                      }
              ,2000);

            
              /* Import teacher data from local storage (stored during previous sessions) */
              this.storage.get('teacherPhoneNumber')
              .then((data)=> {MyApp.teacherPhoneNumber = data ; console.log('teacher phone number = ' + data)})
              .catch((err)=> {console.log('ERROR in Local Storage with teacherPhoneNumber ' + err)}
              );

              this.storage.get('teacherEmailAdress')
              .then((data)=> {MyApp.teacherEmailAdress = data ; console.log('teacher eMail = ' + data)})
              .catch((err)=> {console.log('ERROR in Local Storage with teacherEmail ' + err)}
              );

              this.storage.get('students')
              .then((data)=> {MyApp.students = data ; console.log('students = ' + data)})
              .catch((err)=> {console.log('ERROR in Local Storage with students ' +err)}
              );

              this.storage.get('numberOfExercisesPerLesson')
              .then((data)=> {MyApp.numberOfExercisesPerLesson = data ; console.log('numberOfExercisesPerLesson = ' + data)})
              .catch((err)=> {console.log('ERROR in Local Storage with numberOfExercisesPerLesson ' +err)}
              );

              this.storage.get('numberOfPreviousLessonExercises')
              .then((data)=> {MyApp.numberOfPreviousLessonExercises = data ; console.log('numberOfPreviousLessonExercises = ' + data)})
              .catch((err)=> {console.log('ERROR in Local Storage with numberOfPreviousLessonExercises ' +err)}
              );
              
          }

      }); // end of PromisePlatform Ready
   
    } // end of MyApp constructor

 }
