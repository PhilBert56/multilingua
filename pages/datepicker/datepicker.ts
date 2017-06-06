import { Component } from '@angular/core';
import {NavController} from 'ionic-angular';
//import { DatePicker } from 'datepicker-ionic2';
//import { DatePickerModule } from 'datepicker-ionic2';

@Component({
  selector: 'page-datepicker',
  templateUrl: 'datepicker.html',
})
export class DatePickerPage {

    //localDate : any ;

    localDate = new Date();
    myDate = new Date();
    
    /*constructor(public navCtrl: NavController) {
    
    this.datePicker.onDateSelected.subscribe( 
      (date) => {
        console.log(date);
    });
  }*/
    constructor(){
      //this.myDate = new Date();
      //console.log('from constructor - Date choisie = '+this.myDate);
      console.log('constructor done with myDate = ' + this.myDate);

    

    }


    setDate(ev) {
        console.log('from setDate : ' + ev);
    }

    showCalendar(){
    //this.datePicker.showCalendar();
  }
}

