import { Injectable } from '@angular/core';

import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { FileOpener } from '@ionic-native/file-opener';
import { Debug } from '../config/debug';
import { MyApp } from '../app/app.component'
import { ExternalFilesConfig } from '../config/configfile';

@Injectable()

export class ResultServices {

    constructor(
        private file : File,
        private filePath : FilePath,
        private transfer: Transfer,
        private fileOpener: FileOpener
    ) { }


    writeResultsAsTextToBeFiled() : any {
        var text = new Array() ;
        var line : string = '';

        if(Debug){console.log('writeResultsAsTextToBeFiled')}
        if (MyApp.studentResults.length > 0)
        {
            for (var i = 0; i < MyApp.studentResults.length ; i++)
            {
                line = '';
                line = MyApp.studentResults[i].lessonId;
                line = line + ' | ' + MyApp.studentResults[i].question;
                line = line + ' | ' + MyApp.studentResults[i].answer;
                line = line + ' | ' + MyApp.studentResults[i].result + '|' + '\n';
                text.push(line);
                if(Debug){console.log(line)}
             }
        };
        return text;
    }



    storeResultsOnDevice() {

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


        if(MyApp.platformIs != 'not found')
        { 
            // Find directory where to store the result log file
            var fullPath = this.file.externalRootDirectory + platformPath + ExternalFilesConfig.dir + '/';

            if(Debug){console.log('Results File on Device fullPath = ' + fullPath)};
/*
            this.file.createFile(fullPath, 'log.txt', true)
            .then ( (res) => { if(Debug){console.log(res)}})
            .catch ((err) => {console.log('error = ' + JSON.stringify(err))} );
*/
            var txt = this.writeResultsAsTextToBeFiled();

            if(Debug){console.log('check file')};
            this.file.checkFile ( fullPath,'log.rtf')
            .then ( (res ) => { if(Debug){console.log( 'check file ' + fullPath,'log.rtf'+ 'res = ' + res)}}) 
            .catch ( (err) => {console.log('check file => error = ' + JSON.stringify(err) )} );



            this.file.writeFile(fullPath,'log.rtf', txt, true)
            .then ( (res)=> {if(Debug){console.log(res)}})
            .catch ( (err) => {console.log('write file => error = ' + JSON.stringify(err) )} );

            setTimeout( 
                  () => {
                    if(Debug)(console.log ('try to open file ' + fullPath +'log.rtf'))
                    this.fileOpener.open(fullPath +'log.rtf','.rtf' ) 
                    .then(() => {if(Debug){console.log('File is opened')} })
                    .catch(e => {if(Debug) {console.log('Error openening file', e)} });
                  }
              ,3000);

/*
              var ff = 'file://storage/emulated/0/Android/data/LngLearnApp/log.rtf' ;

              if(Debug){console.log('TRY with' + ff)};

              setTimeout( 
                  () => {
                    if(Debug)(console.log ('try to open file ' + ff))
                    this.fileOpener.open(ff,'.rtf' ) 
                    .then(() => {if(Debug){console.log('File is opened')} })
                    .catch(e => {if(Debug) {console.log('Error openening file', e)} });
                  }
              ,5000);
*/

              var fileTransfer: TransferObject = this.transfer.create();

              let options: FileUploadOptions = {
                    fileKey: 'file',
                    fileName: 'name.jpg',
                    headers: {}
     
              }



              var ff = fullPath +'log.rtf';
            
              if(Debug) console.log('try to upload file : ' + ff + ' to ' + MyApp.studentFilesDirectory);


              fileTransfer.upload(ff, MyApp.studentFilesDirectory, options)
              .then (
                  (data) => { console.log ('file transfer success ; data = ' + data + JSON.stringify(data))},
                    // success
                  (err) => {console.log ('file transfer error = ' + err + JSON.stringify(err))}
                    // error
                )
              .catch ( e => {if(Debug) {console.log('Error transfering file', e , JSON.stringify(e) )} });
                







        }

    }


}
