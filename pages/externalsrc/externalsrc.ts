import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { HomePage }from '../home/home';
import { File } from '@ionic-native/file';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { MyApp} from '../../app/app.component';
import { initializeApp, database} from 'firebase';
import { firebaseConfig} from '../../environments/firebase.config';
import { NetworkStatus } from '../../services/network';
import { FilePath } from '@ionic-native/file-path';
import { Injectable } from '@angular/core';
import { Lessons } from '../../data/lessons';
import { Exercises } from '../../data/exercises';

@Injectable()

@Component({
  selector: 'external-ressources',
  templateUrl: 'externalsrc.html'
})

export class ExternalRessources {

    constructor(
        private network: Network,
        public alertCtrl: AlertController,
        private file:File,
        private transfer: Transfer,
        private netStat : NetworkStatus,
        private filePath: FilePath,
        ) {
            this.initializeExternalRessources();
            }
    
    fileTransfer: TransferObject = this.transfer.create();

    initializeExternalRessources(){

            this.loadFileFromCloud('LessonsFile.json', MyApp.lessonsFile);
            this.loadFileFromCloud('ExercisesFile.json', MyApp.exercisesFile);
            
            this.buildAllExercises('ExercisesFile.json');

            this.buildAllLessons('LessonsFile.json');
            
            this.downloadCalendarFile();
            this.dowloadTeacherIds();
    }


    loadLessonsFile(){
        this.loadFileFromCloud('LessonsFile.json', MyApp.lessonsFile);
        MyApp.lessonsAll = this.buildAllLessons('LessonsFile.json');
       }

    loadExercisesFile(){
        this.loadFileFromCloud('ExercisesFile.json', MyApp.exercisesFile);
        MyApp.exercisesAll = this.buildAllExercises('ExercisesFile.json');    
    }


    networkStatusOK(tell:boolean) { 
        var netStatus = this.netStat.getNetworkStatus(tell);
        if (netStatus  === 'none') {
            let alert = this.alertCtrl.create({
            title: 'Trying to reach Internet Cloud (Firebase)',
            subTitle: 'But you are not connected',
             buttons: ['OK']
             });
            alert.present();
            return false;
        } ;
        return true;
    }

    loadFileFromCloud(fileName, url){
        var netWorkOK = this.networkStatusOK(false);
        if (!netWorkOK)  {return}
      
        var path = this.file.externalRootDirectory + 'Android/';
        var dir = 'data';

        this.file.checkDir(path,dir)
        .then ( 
            (res) => {
                var dir2 = path + dir +'/';
                var f = dir2 + fileName;
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

    downloadCalendarFile(){
      var path = this.file.externalRootDirectory + 'Android/';
      var dir = 'data';

      var netWorkOK = this.networkStatusOK(false);

      if (!netWorkOK)  {return}


      this.file.checkDir(path,dir)

        .then ( 
            (res) => {
                var dir2 = path + dir +'/';
                var f = dir2 +'calendar.json';
                const url = MyApp.calendarFile;
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


    dowloadTeacherIds() {
        var netWorkOK = this.networkStatusOK(false);
        if (!netWorkOK) {return} 
        var root = database().ref();
        root.on('value', function(snap) {
        var dataFirebase :any = snap.val();
        MyApp.exercisesFile = dataFirebase['Teacher'].ExercisesFile;
        MyApp.lessonsFile = dataFirebase['Teacher'].LessonsFile;
        MyApp.calendarFile = dataFirebase['Teacher'].CalendarFile;
        MyApp.teacherPhoneNumber = dataFirebase['Teacher'].PhoneNumber;
        MyApp.teacherEmailAdress = dataFirebase['Teacher'].Email;
      });
    }




    buildAll(fileName) {

        //var fileName = 'ExercisesFile.json';
        var fullPath = this.file.externalRootDirectory + 'Android/data/';

        this.filePath.resolveNativePath(fullPath)
        .then(
            (filePath) => {
                console.log('filePath = ' + filePath);
                this.file.readAsText(filePath, fileName).then(
                (res) => {
                console.log ('reading file' + filePath + fileName + 'rep = ' + res);
                //console.log (JSON.parse(res));
                var test: any [];
                test = JSON.parse(res);
                //console.log('TEST length = ' + test.length);
                return JSON.parse(res);
            },
            (err) => {
                console.log ('reading file = ' + filePath + fileName + ' ; error = ' + JSON.stringify(err));
                return []}
          );
        })
      .catch( (err) => {
          console.log('in resolveNativePath, '+  err);
          return []
      });
    }


    buildAllExercises(fileName)  {

        var fullPath = this.file.externalRootDirectory + 'Android/data/';

        this.filePath.resolveNativePath(fullPath)
        .then(
            (filePath) => {
                console.log('filePath = ' + filePath);
                this.file.readAsText(filePath, fileName).then(
                (res) => {
                console.log ('reading file' + filePath + fileName + 'rep = ' + res);
                //console.log (JSON.parse(res));
                var test: any [];
                test = JSON.parse(res);
                //console.log('TEST length = ' + test.length);
                MyApp.exercisesAll = test;
                return JSON.parse(res);
            },
            (err) => {
                console.log ('reading file = ' + filePath + fileName + ' ; error = ' + JSON.stringify(err));
                return []}
          );
        })
      .catch( (err) => {
          console.log('in resolveNativePath, '+  err);
          return []
      });
    }

    buildAllLessons(fileName)  {

        //var fileName = 'ExercisesFile.json';
        var fullPath = this.file.externalRootDirectory + 'Android/data/';

        this.filePath.resolveNativePath(fullPath)
        .then(
            (filePath) => {
                console.log('filePath = ' + filePath);
                this.file.readAsText(filePath, fileName).then(
                (res) => {
                console.log ('reading file' + filePath + fileName + 'rep = ' + res);
                //console.log (JSON.parse(res));
                var test: any [];
                test = JSON.parse(res);
                //console.log('TEST length = ' + test.length);
                MyApp.lessonsAll = test;
                return JSON.parse(res);
            },
            (err) => {
                console.log ('reading file = ' + filePath + fileName + ' ; error = ' + JSON.stringify(err));
                return []}
          );
        })
      .catch( (err) => {
          console.log('in resolveNativePath, '+  err);
          return []
      });
    }

}


