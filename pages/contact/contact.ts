import { Component } from '@angular/core';

import { Storage } from '@ionic/storage';
import { SMS } from '@ionic-native/sms';

import { Contacts } from '@ionic-native/contacts';
import { initializeApp, database } from 'firebase';
import { EmailComposer } from '@ionic-native/email-composer';


@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})

export class ContactPage {

emailText : String;
phoneNumber : string;

    constructor(
    private sms: SMS,
    private emailComposer: EmailComposer,
    private contacts: Contacts) {}

    sendSMSToTeacher(textSMS){
    var root = database().ref('Teacher');
    var self = this;

    root.on('value', function(snap) {
      var phoneNumber = snap.val().PhoneNumber;
      console.log('message envoyé à '+ snap.key + ' ' + JSON.stringify (snap.val()) );
      console.log('Phone Number is ' + phoneNumber);
      self.sms.send (phoneNumber, textSMS);

      });
   }

  sendEmailToTeacher(eMailBody){
    var root = database().ref('Teacher');
    var self = this;
    root.on('value', function(snap) {
      var eMail = snap.val().Email;

        let email = {
            to: eMail,
            cc: '',
            bcc: [],
            attachments: [],
            subject: 'English lessons',
            body: eMailBody,
            isHtml: true
        };

        this.emailComposer.open(email);
      });

    }

 displayContact(){

    this.contacts.pickContact()
    .then (contact => {
      console.log('contact : ', contact, 'choice = '+ JSON.stringify(contact) );
      console.log( contact.displayName);
      console.log('phone number = '+ JSON.stringify(contact.phoneNumbers));
      console.log('phone number = ' + contact.phoneNumbers[0].value);
    });

  }
  

}