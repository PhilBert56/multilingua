import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { SMS } from '@ionic-native/sms';
import { CallNumber } from '@ionic-native/call-number';
import { Contacts } from '@ionic-native/contacts';
import { initializeApp, database } from 'firebase';
import { AlertController } from 'ionic-angular';
import { Debug } from '../../config/debug';
import { MyApp } from '../../app/app.component';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})

export class ContactPage {

  emailBody : string;
  smsText : string;
  phoneNumber : string = MyApp.teacherPhoneNumber;

    constructor(
      private sms: SMS,
      private callNumber: CallNumber,
      private contacts: Contacts,
      public alertCtrl: AlertController) {
     }

sendSMSToTeacher(){
    
  let confirm = this.alertCtrl.create({
      title: 'Send this SMS to your teacher ?',
      message: this.smsText,
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            if(Debug) {console.log('Disagree clicked')};
          }
        },
        {
          text: 'OK',
          handler: () => {
            this.sms.send (MyApp.teacherPhoneNumber, this.smsText);
          }
        }
      ]
    });
    confirm.present();

 }



/*
 displayContact(){

    this.contacts.pickContact()
    .then (contact => {
      console.log('contact : ', contact, 'choice = '+ JSON.stringify(contact) );
      console.log( contact.displayName);
      console.log('phone number = '+ JSON.stringify(contact.phoneNumbers));
      console.log('phone number = ' + contact.phoneNumbers[0].value);
    });

  }
*/

  
  phoneCallToTeacher() {

    let confirm = this.alertCtrl.create({
      title: 'Call your teacher ?',
      message: 'This will directcly call your teacher',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            if(Debug) {console.log('Disagree clicked')};
          }
        },
        {
          text: 'OK',
          handler: () => {

              this.callNumber.callNumber(this.phoneNumber, true)
                .then(   () => { if(Debug) console.log('Launched dialer!') } )
                .catch(  () => { if(Debug) console.log('Error launching dialer') } );

          }
        }
      ]
    });
    confirm.present();
  }


}