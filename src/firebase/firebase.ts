
import { firebaseConfig } from '../firebase/firebase.config';
import { AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import { MyApp } from '../app/app.component'
import { database,initializeApp } from 'firebase';
import { Debug } from '../config/debug';
import { Injectable } from '@angular/core';

@Injectable()

export class FirebaseInterface{

/* 

    This class takes care of data loading from Firebase at App start up

*/
    constructor () 
    {
        if(Debug){console.log('INITIALIZING firebase')};
        initializeApp(firebaseConfig);
        if(Debug){console.log('INITIALIZING firebase DONE at ' + new Date() )};
    } 


    getDataFromFirebase() { 
 
      if(Debug){console.log ('ENTERING INTO getDataFromFirebase at ' + new Date() )};

      var root = database().ref();

      if(Debug){console.log ('just after database().ref() inside getDataFromFirebase')}

      root.on('value', function(snap) {
        var dataFirebase :any = snap.val();

        if(Debug){console.log(dataFirebase)};

        MyApp.exercisesFileURL = dataFirebase['Teacher'].ExercisesFile,
        MyApp.lessonsFileURL = dataFirebase['Teacher'].LessonsFile;
        MyApp.calendarFileURL = dataFirebase['Teacher'].CalendarFile;
        MyApp.teacherPhoneNumber = dataFirebase['Teacher'].PhoneNumber;
        MyApp.teacherEmailAdress = dataFirebase['Teacher'].Email;
        MyApp.students = dataFirebase['Students'];
        MyApp.numberOfExercisesPerLesson = dataFirebase['LessonSettings'].numberOfExercises;
        MyApp.numberOfPreviousLessonExercises = dataFirebase['LessonSettings'].numberOfPreviousExercises;
        MyApp.studentFilesDirectory = dataFirebase['Teacher'].StudentsDir;
        

        if(Debug) {console.log( 'DATA read from Firebase : phone = ' + MyApp.teacherPhoneNumber )};
        if(Debug) {console.log( 'DATA read from Firebase : eMail = ' + MyApp.teacherEmailAdress )};
        if(Debug) {console.log( 'DATA read from Firebase : lessons file url = ' + MyApp.lessonsFileURL)};
        if(Debug) {console.log( 'DATA read from Firebase : exercises file url = ' + MyApp.exercisesFileURL)};
        if(Debug) {console.log( 'DATA read from Firebase : calendar file url = ' + MyApp.calendarFileURL)};
        if(Debug) {console.log( 'DATA read from Firebase : students = ' + JSON.stringify(MyApp.students) )}; 
        if(Debug) {console.log ('New Value from database at : ' + new Date() + ' ... should now reload files from cloud !')};
        
        /*  Should we reload Files from firebase to store these files on the device 
            each time somthing has been modified inside database ? To be clarified later */
        
      });
      
    }
}