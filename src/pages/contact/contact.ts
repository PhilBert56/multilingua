import { Component } from '@angular/core';

import { Storage } from '@ionic/storage';
import { SMS } from '@ionic-native/sms';
import { CallNumber } from '@ionic-native/call-number';
import { Contacts } from '@ionic-native/contacts';
import { initializeApp, database } from 'firebase';
import { EmailComposer } from '@ionic-native/email-composer';
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
      private emailComposer: EmailComposer,
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

  sendEmailToTeacher(){

    if(Debug){console.log('trying to send message = ' + this.emailBody)};

    this.emailComposer.isAvailable()
    .then( (available: boolean) =>{
    
      if(available) {

/*  If emailComposer available  */
    if(Debug){console.log('GOOD NEWS : email composer is available on this device')};
    let confirm = this.alertCtrl.create({
      title: 'Send message ?',
      message: this.emailBody,
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

            let email = {
              to: MyApp.teacherEmailAdress,
              cc: '',
              bcc: [],
              attachments: [],
              subject: 'English lessons',
              body: this.emailBody,
              isHtml: true
            };
            if(Debug){console.log('Send message : ' + this.emailBody + ' to ' + MyApp.teacherEmailAdress )}
            this.emailComposer.open(MyApp.teacherEmailAdress);
            if(Debug){console.log('email composer  has been called' )};
          }
        }
      ]
    });
    confirm.present(); 
    }
    else {
      if(Debug){console.log('EMAIL COMPOSER IS NOT AVAILABLE ON THIS DEVICE')};
      let confirm = this.alertCtrl.create({
      title: 'Email composer',
      message: 'not available on this device',
      buttons: [
        {
          text: 'OK',
          handler: () => {}
        }
      ]
    });
    confirm.present();}

  }) // end of .then( 

.catch ( () => {console.log('ERROR trying to call email composer')})
 
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