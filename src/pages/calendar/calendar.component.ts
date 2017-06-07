
import { Component } from '@angular/core';
import { NavController} from 'ionic-angular';
import { MyApp} from '../../app/app.component';
import { HomePage } from '../../pages/home/home';
import { AlertController } from 'ionic-angular';
import { Debug } from '../../config/debug';
import { Calendar } from '@ionic-native/calendar';
import { LocalNotifications } from '@ionic-native/local-notifications';

@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html'
})

export class CalendarPage {

    eventSource;
    viewTitle;

    isToday:boolean;
    calendar = {
        mode: 'month',
        currentDate: new Date()
    };

    constructor(
        private personalCalendar: Calendar,
        private navCtrl:NavController,
        public alertCtrl: AlertController,
        private localNotifications: LocalNotifications) 

     {this.eventSource = this.createCalendarEvents()}



    loadEvents() {
        this.eventSource = this.createCalendarEvents();
    }

    onViewTitleChanged(title) {
        this.viewTitle = title;
    }

    onEventSelected(event) {

        if(Debug) {console.log('Event selected:' + event.startTime + '-' + event.endTime + ',' + event.title)};

        var dd = new Date(event.startTime);
        var ttle = 'A course is forecasted on : ' + dd.toUTCString();
        
        var msg = 'Do you want to enter this course in your personal Calendar (You will get a notification 1 hour before course';
        
        let alert = this.alertCtrl.create({
          title: ttle,
          message: msg,
          buttons: [
          {
              text: 'Cancel',
              role: 'cancel',
              handler: () => { if(Debug){console.log('Cancel clicked')}  }
          },
          {
              text: 'Confirm',
              handler: () => { 
                if(Debug) {console.log('Evevt clicked')};

                // Enter the event in local calendar, opening the student calendar for checking and confirmation
                this.personalCalendar.createEventInteractively('Your English Lesson', 'home', 'notes', event.startTime, event.endTime);
                
                // Send local notification one hour before course
                this.localNotifications.schedule({
                    text: 'Your English Course starts in one hour',
                    at: new Date( event.startTime - 3600),
                    led: 'FF0000',
                    sound: (MyApp.platformIs === 'android')? 'file://sound.mp3': 'file://beep.caf',
                });

                this.localNotifications.schedule({
                    id: 1,
                    text: 'You will receive a notification for Your next English Course',
                    sound: (MyApp.platformIs === 'android')? 'file://sound.mp3': 'file://beep.caf',
                    //data: { secret: key }
                });



                //---------------------------------------------------------------------------------------------
                
                if(Debug) {
                    setTimeout( 
                        () => {

                        this.localNotifications.getAll()
                        .then ( (res) => {
                            console.log('localNotifications.getAll returns with ' + res + '  ' + JSON.stringify(res) );

                        })  // end of .then
                        .catch( (err) => {console.log('localNotifications.getAll returns with ' + err  ) }) 

                  },
                  2000 );

                }
                //--------------------------------------------------------------------------------------------

              }
            }
          ]
        });
        alert.present();
        

    }

    changeMode(mode) {
        this.calendar.mode = mode;
    }

    today() {
        this.calendar.currentDate = new Date();
    }

    onTimeSelected(ev) {
        if(Debug) {console.log('Selected time: ' + ev.selectedTime + ', hasEvents: ' +
            (ev.events !== undefined && ev.events.length !== 0) + ', disabled: ' + ev.disabled);}
        
    }

    onCurrentDateChanged(event:Date) {
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        event.setHours(0, 0, 0, 0);
        this.isToday = today.getTime() === event.getTime();
    }

    onRangeChanged(ev) {
        console.log('range changed: startTime: ' + ev.startTime + ', endTime: ' + ev.endTime);
    }

    markDisabled = (date:Date) => {
        var current = new Date();
        current.setHours(0, 0, 0);
        return date < current;
    }


    createCalendarEvents() {
        var events = [];

        var eventType ;
        var startYear ;
        var startMonth ;
        var startDay ;
        var startHour ;
        var endDay ;
        var startTime;
        var endTime;

        if(!MyApp.calendar.length){console.log('NO EVENT IN YOUR CALENDAR')}
        else {

            for (var i = 0; i < MyApp.calendar.length; i++) {

if(Debug){console.log('CALENDAR : testing if ' + MyApp.calendar[i].student + ' = ' + MyApp.studentName)};
if(Debug){console.log('CALENDAR : MyApp.studentIsLogged ' + MyApp.studentIsLogged)};

                if( MyApp.studentIsLogged && MyApp.calendar[i].student === MyApp.studentName ) {

                    eventType = MyApp.calendar[i].eventType;
                    startYear = MyApp.calendar[i].year;
                    startMonth = MyApp.calendar[i].month;
                    startDay = MyApp.calendar[i].day;
                    startHour = MyApp.calendar[i].hour;
                    endDay = startDay;
                    startTime;
                    endTime;
                    startTime = new Date(startYear , (startMonth-1), startDay, startHour );
                    endTime = new Date(startYear , (startMonth-1), startDay, (startHour+1) ) ;

                    if(Debug) {console.log( 'Add an Event that starts at = ' + startTime + ' ends at ' + endTime )}

                    events.push({
                        title: 'English Course',
                        startTime: startTime,
                        endTime: endTime,
                        allDay: false
                    })



                }
                
           }
        }

        if(Debug) {console.log(events)}
        return events;
    }
}