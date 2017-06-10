import { Injectable } from '@angular/core';

import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';

import { Debug } from '../config/debug';
import { MyApp } from '../app/app.component'
import { ExternalFilesConfig } from '../config/configfile';

import { firebaseConfig } from '../firebase/firebase.config';
import { database,initializeApp } from 'firebase';
import * as firebase from "firebase"; //Don't ask me why, but this works !

@Injectable()

export class ResultServices {

    constructor(
        private file : File,
        private filePath : FilePath
    ) { }


    logResults() {

        var txt = this.writeResultsAsPlainTextToBeFiled();
        var fullPath = this.getPath();
        var fileName = ExternalFilesConfig.resultsFilePrefix + MyApp.studentName + ExternalFilesConfig.resultsFileExtension ; 
        this.storeResultsOnDevice(txt,fullPath,fileName);
        this.uploadResultsOnFirebase(txt,fileName);

    }

    writeResultsAsPlainTextToBeFiled() : string {
        
        var text : string = '';
        var line : string = '';

        if (MyApp.studentResults.length > 0)
        {
            for (var i = 0; i < MyApp.studentResults.length ; i++)
            {
                line = '';
                line = 'Lesson ' + MyApp.studentResults[i].lessonId;
                line = line + ' | question : ' + MyApp.studentResults[i].question;
                line = line + ' | student_answer :' + MyApp.studentResults[i].answer;
                line = line + ' | answer_is :' + MyApp.studentResults[i].result + '|' + '\n';
            
                text = text + line;
                if(Debug){console.log(line)};
             }
        };

        return text;
    }


    storeResultsOnDevice(txt: string, fullPath : string, fileName : string) {

        if(Debug){console.log('Will try to create file :' + fullPath + fileName)};

        this.file.createFile(fullPath, fileName, true)
        .then ( 
            (res) => { 
            
                if(Debug){console.log('create file' + fullPath+fileName + 'res = ' + res)}
                
                this.file.writeExistingFile(fullPath,fileName, txt)
                .then ( (res)=> {if(Debug){console.log('write File ' + res)}},
                    (err)=> {console.log ('write file error = ' + err + JSON.stringify(err))})
                .catch ((err) => {console.log('write file => error = ' + JSON.stringify(err) )});
            },
            (err) => {console.log ('write file error = ' + err + JSON.stringify(err))} 
         )
        .catch ((err) => {console.log('Create File ERROR for  '+ fullPath+fileName + JSON.stringify(err))} );
       

    }


    uploadResultsOnFirebase(txt :string, fileName : string){

        var storageRef = firebase.storage().ref();
        
        if(!MyApp.studentIsLogged){return}

        var fileRef = storageRef.child(ExternalFilesConfig.resultsFirebaseDirectory + MyApp.studentName + '/' + fileName);
        if(Debug){console.log('Will try to send fileRef = ' + fileRef + ' to Firebase')}

        setTimeout( 
          () => {
                  fileRef.putString (txt)
                  .then(
                    (snapshot) => {console.log('File Uploaded successfully on Firebase ! ' + snapshot) } ,
                    (err) => {console.log ('File transfer error = ' + err )}
                  )
                  .catch( e => {if(Debug) {console.log('Error transfering file', e )} } )
                                 
                },1000)
    }


    getPath() : string {

        var platformPath : string = 'unkown';
        var fullPath : string = 'unknown';

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

        if(platformPath === 'not found'){
            if(Debug){console.log('platformPath not found for this system')}
            return fullPath
        }
         
        // Find directory where to store the result log file
        fullPath = this.file.externalRootDirectory + platformPath + ExternalFilesConfig.dir + '/';

        if(Debug){console.log('Results File on Device fullPath = ' + fullPath)};

        return fullPath;
    }


    resetStudentResults(){

        MyApp.studentResults = new Array();
        
    }


}
