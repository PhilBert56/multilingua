
import { NavController, NavParams } from 'ionic-angular';

//import { ArrayOfObjectsFromJSONFile } from '../dataservice/arrayofObjectsFromJSONFile'
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { ExternalFilesConfig } from '../config/configfile';
import { MyApp } from '../app/app.component';
import { Debug } from '../config/debug';
//import * as firebase from "firebase"; //Don't ask me why, but it works !
/*  This data service populates lessons, exercises and calendar data from on-device files  */
import { Injectable } from '@angular/core';
//import { FirebaseInterface } from '../firebase/firebase'

@Injectable()

export class DataService {

    constructor(
        private file:File,
        private filePath : FilePath,
        private transfer: Transfer,
        private storage : Storage
        )
    {}


    /*
    ===================================================================================
        In the following section we import data from files already stored on-device
    ===================================================================================
    */

    importAllFromDevice (){
        
        if(Debug){
            var date = new Date();
            console.log ('ENTER INSIDE importAllFromDevice at '+ date);
        };

        var platformPath : string = this.getPlatformPath();
/*
        switch ( MyApp.platformIs)  {
            case 'android' :
                platformPath = ExternalFilesConfig.pathToDir.android; 
                break
            case 'ios' :
                platformPath = ExternalFilesConfig.pathToDir.ios; 
                break;
            case 'windows':
                platformPath = ExternalFilesConfig.pathToDir.windows; 
                break;
            default :
                platformPath = 'not found'


        }*/


        if(MyApp.platformIs != 'not found')
        { 
            var fullPath = platformPath + ExternalFilesConfig.dir;

            this.buildArrayFromJSONFile(fullPath, ExternalFilesConfig.lessonsFileName, 'lessons');
        
            this.buildArrayFromJSONFile(fullPath, ExternalFilesConfig.exercisesFileName,'exercises');
        
            this.buildArrayFromJSONFile(fullPath, ExternalFilesConfig.calendarFileName, 'calendar');
        }
        
     }
     getPlatformPath() : string{ 
        var platformPath : string = 'unknown';

        switch ( MyApp.platformIs)  {
            case 'android' :
                return ExternalFilesConfig.pathToDir.android; 
                
            case 'ios' :
                return ExternalFilesConfig.pathToDir.ios; 
                ;
            case 'windows':
                return ExternalFilesConfig.pathToDir.windows; 
                ;
            default :
                return 'not found'
        }
     }

     buildArrayFromJSONFile(onDeviceDirectory,fileName,target) {

     /* -----------------------------------------------------------------------------------------------
        Reads a file stored on-device and extract data in JSON format from that file
        sends the content of the file to the target array of objects via a call to populateMyAppFiles
        target in a string the identifies the destination array
     --------------------------------------------------------------------------------------------------*/

      var fullPath = this.file.externalRootDirectory + onDeviceDirectory;
      
      if(Debug){console.log('ENTER into function-buildArrayFromJSONFile for file ' + fullPath + fileName)};

      this.filePath.resolveNativePath(fullPath)
      .then(
        (filePath) => {
          this.file.readAsText(filePath, fileName)
          .then(
            (res) => {
                this.populateMyAppFiles (target, JSON.parse(res) )  // Will send data into the array of objects designed by target
                if(Debug){console.log ('return from BuildArrayFromJSONFile SUCCESS --- ' + fileName)};
                if(Debug && target === 'calendar') {console.log (JSON.parse(res))};
            },
            (err) => {console.log ('reading file = ' + filePath + '/' + fileName + ' ; error = ' + JSON.stringify(err))}
          );
        })
      .catch( (err) => { console.log('in resolveNativePath, for ' + fullPath + '+  err') ;}
      );


      if(Debug){console.log('LEAVE buildArrayFromJSONFile after dowloading  objects of file ' + fileName)}
      
      
   } 

  
      populateMyAppFiles (target, obj) 

      /*------------------------------------------------------------------------------------
        This function sends date loaded from files stored on the device to MyApp arrays 
        that will be used later to select lessons or exercises or events calendar
        target can be 'exercises', 'lessons' or 'calendar'
      --------------------------------------------------------------------------------------*/
        {
           
            if (target === 'exercises') { 
                MyApp.exercisesAll = obj ;
                if(Debug){console.log ('populate exercises in MyApp : SUCCESS')}
            }


            if (target === 'lessons') { 
                MyApp.lessonsAll = obj;
                if(Debug){console.log ('populate lessons in MyApp : SUCCESS')}
            }


            if (target === 'calendar') { 
                MyApp.calendar = obj;
                if(Debug){console.log ('populate calendar in MyApp : SUCCESS' + obj )}
            }


            if (target === 'homework') { 
                MyApp.homework = obj;
                if(Debug){console.log ('populate homework in MyApp : SUCCESS' + obj )}
            }

         } 

      
  /* 
    ==========================================================================================
      The following section deals with file importation from Firebase Storage to the device
    ==========================================================================================
  */

    importFilesFromCloud(){

     /* Static data for file config are stored in ExternalFilesConfig (path, dir) */
     /* url given by Firebase are stored in MyApp static variables, refreshed at launching if netwsork ok */

      this.loadFileFromCloud(ExternalFilesConfig.lessonsFileName, MyApp.lessonsFileURL);
      this.loadFileFromCloud(ExternalFilesConfig.exercisesFileName, MyApp.exercisesFileURL);
      this.loadFileFromCloud(ExternalFilesConfig.calendarFileName, MyApp.calendarFileURL);

     }


    loadFileFromCloud(fileName, url){
        
    /* 
       the purpose of this method is to retrieve files from Firebase Storage and store a copy on device 
       In this demo we use the directory Android/data of the device (supposed to be Android) 
       the directory is specified in ExternalFilesConfig as 
            pathToDir:"Android/",
            dir:"data",
            fullPath : "Android/data"
        to run on a non Android device, these parameters should be changed according to device file system
    */
        var dirObj = this.getDataDirectory();
        var path = dirObj["path"] ;
        var dir = dirObj["dir"];

        var fileTransfer: TransferObject = this.transfer.create();

        if(Debug){console.log( 'Will try to transfer a data file to ' + path + dir + '/' + fileName )};

        this.file.createDir(path, dir, true).then (
          (res) => {

/* =================================================================================================================================== */
            this.file.checkDir(path,dir)
            .then ( 
                (res) => {
                 var f = path + dir +'/' + fileName;
                    if(Debug){console.log( 'url = ' + url + ' f = ' + f  )};

                    fileTransfer.download(url, f, true)
                    .then(
                        (entry) => {
                            if(Debug){console.log('download complete: ' + entry.toURL() + ' at '+ new Date())};
                        }, 
                        (error) => {console.log('download not OK for : ' + url + f + JSON.stringify(error)  ) }
                );
            },
            (err) => {console.log('ERROR In File Transfer, target directory not existing = ' + path + dir + 'error ='+ JSON.stringify(err)  ) }
            );
/* ================================================================================================================================== */
          },
          (err) => {
                if(Debug){console.log('Directory NOT CREATED for ' + path + dir + ' at '+ new Date)}
          }
      )


    } 
    

   checkIfDataDirectoryExists() {

        var dirObj = this.getDataDirectory();
        var path = dirObj["path"] ;
        var dir = dirObj["dir"];

        if(Debug){console.log('checkIfDataDirectoryExists with ' + path + dir)};

        this.file.checkDir(path,dir)
            .then ( 
            (res) => {
                       if(Debug){console.log( 'CHECKING EXISTENCE OF ' + path + dir + 'ANSWER is true at ' + new Date() )};
                       MyApp.dataDirectoryExistsOnDevice = true;
                     },
            (err) => {
                       if(Debug) {console.log('ERROR target directory not existing = ' + path + dir + 'error ='+ JSON.stringify(err) )};
                       MyApp.dataDirectoryExistsOnDevice = false;
                     }
            )
            .catch
                {
                    console.log('ERROR : ' + path + dir + 'Unable to process dir existence checking'  );
                    MyApp.dataDirectoryExistsOnDevice = false;
                }

    }


    getDataDirectory () : object  {
        var platformPath : string = 'unknown';

        switch ( MyApp.platformIs)  {
            case 'android' :
                platformPath = ExternalFilesConfig.pathToDir.android; 
                break
            case 'ios' :
                platformPath = ExternalFilesConfig.pathToDir.ios; 
                break;
            case 'windows':
                platformPath = ExternalFilesConfig.pathToDir.windows; 
                break;
            default :
                platformPath = 'not found'

        }

        var path = this.file.externalRootDirectory + platformPath;
        var dir = ExternalFilesConfig.dir;

        return { path, dir }
    }






}
