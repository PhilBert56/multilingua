
import { Component } from '@angular/core';
import { NavController} from 'ionic-angular';
import { MyApp} from '../../app/app.component';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { HomePage } from '../../pages/home/home';
import { AlertController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { NetworkStatus } from '../../services/network'

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


    fileTransfer: TransferObject = this.transfer.create();


    constructor(
        private navCtrl:NavController,
        private transfer: Transfer,
        private file:File,
        private filePath: FilePath,
        public alertCtrl: AlertController,
        private network: Network) {

            this.loadCalendar();

    }

    loadEvents() {
        this.eventSource = this.createCalendarEvents();
    }

    onViewTitleChanged(title) {
        this.viewTitle = title;
    }

    onEventSelected(event) {
        console.log('Event selected:' + event.startTime + '-' + event.endTime + ',' + event.title);
    }

    changeMode(mode) {
        this.calendar.mode = mode;
    }

    today() {
        this.calendar.currentDate = new Date();
    }

    onTimeSelected(ev) {
        console.log('Selected time: ' + ev.selectedTime + ', hasEvents: ' +
            (ev.events !== undefined && ev.events.length !== 0) + ', disabled: ' + ev.disabled);
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
    };

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


        for (var i = 0; i < MyApp.calendar.length; i++) {
            
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

            events.push({
              title: 'Course - ' + i,
              startTime: startTime,
              endTime: endTime,
              allDay: false
            })
           
        }
        console.log(events);
        return events;
    }


    loadCalendar(){

    var fileName = 'calendar.json';
    var fullPath = this.file.externalRootDirectory + 'Android/data/';

    this.filePath.resolveNativePath(fullPath)
      .then(
        (filePath) => {
          this.file.readAsText(filePath, fileName).then(
            (res) => {
              //console.log (JSON.parse(res));
              MyApp.calendar = JSON.parse(res);
              this.eventSource = this.createCalendarEvents();
            },
            (err) => {console.log ('reading file = ' + filePath + fileName + ' ; error = ' + JSON.stringify(err))}
          );
        })
      .catch(err => console.log('in resolveNativePath, '+  err));
    }


    downloadCalendarFile(){
        var path = this.file.externalRootDirectory + 'Android/';
        var dir = 'data';

        if (NetworkStatus.networkStatus  === 'none') {
            let alert = this.alertCtrl.create({
            title: 'Trying to reach Internet Cloud (Firebase)',
            subTitle: 'But you are not connected',
            buttons: ['OK']
           });
        

        alert.present();
        return;
      } 
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

/*
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
*/
}