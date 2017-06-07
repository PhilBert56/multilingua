import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { Debug } from '../../config/debug'


@Injectable()

export class AlertOK {

constructor(private alertCtrl: AlertController){}

showAlert(title, message) {
 
    var alert = this.alertCtrl.create({
          title: title,
          subTitle: message,
          buttons: ['OK']
          });
          alert.present();
    }
}