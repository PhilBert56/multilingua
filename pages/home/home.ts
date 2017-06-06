import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';


import { LessonsPage } from '../lessons/lessonsPage';


import { Calendar } from '@ionic-native/calendar';

import { EmailComposer } from '@ionic-native/email-composer';
import { initializeApp, database} from 'firebase';

import { File } from '@ionic-native/file';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { FileOpener } from '@ionic-native/file-opener';
import { FilePath } from '@ionic-native/file-path';

import { AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { Contacts } from '@ionic-native/contacts';
import { MyApp} from '../../app/app.component';
import { Platform, MenuController, Nav } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { CalendarPage } from '../../pages/calendar/calendar.component';
import { Network } from '@ionic-native/network';
import { AlertController } from 'ionic-angular';
import { ExternalRessources } from '../externalsrc/externalsrc'
import { NetworkStatus } from '../../services/network';
import { ContactPage} from '../contact/contact';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  
  constructor(
    private storage : Storage, 
    private navCtrl : NavController,
    private navParams : NavParams,
    private calendar : Calendar,
    private contacts: Contacts,
    private transfer: Transfer,
    private file:File,
    private fileOpener : FileOpener,
    private filePath: FilePath,
    db:AngularFireDatabase,
    afAuth: AngularFireAuth,
    public menu: MenuController,
    private network: Network,
    public alertCtrl: AlertController,
    public netStat : NetworkStatus,
    ) {}

  showLessons() {this.navCtrl.push(LessonsPage)}
  showCoursesCalendar()  {this.navCtrl.push(CalendarPage)}
  showReloadRessources() {this.navCtrl.push(ExternalRessources)}
  showContactForm(){this.navCtrl.push(ContactPage)}
  public openCalendar():void { this.calendar.openCalendar(new Date());}



 
    
/*

  checkFile(){

    var fileName = 'ExercisesFile.json';
    var fullPath = this.file.externalRootDirectory + 'Android/data/';

    this.filePath.resolveNativePath(fullPath)
      .then(
        (filePath) => {
          console.log('filePath = ' + filePath);
          this.file.readAsText(filePath, fileName).then(
            (res) => {
              console.log ('reading file' + filePath + fileName + 'rep = ' + res)
            
              console.log (JSON.parse(res));
              MyApp.exercisesAll = JSON.parse(res);
        
            },
            (err) => {console.log ('reading file = ' + filePath + fileName + ' ; error = ' + JSON.stringify(err))}
          );
        })
      .catch(err => console.log('in resolveNativePath, '+  err));
    }

*/



}


  

