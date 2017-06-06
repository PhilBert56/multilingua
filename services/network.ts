

import { AlertController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { HomePage } from '../pages/home/home';
import { Injectable } from '@angular/core';

@Injectable()

export class NetworkStatus {

    static networkStatus;

    constructor(
        public alertCtrl: AlertController,
        private network: Network
    ){}

    getNetworkStatus(tell:boolean) {

console.log('inside getNetworkStatus');
      let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
        console.log('network was disconnected :-(');

        if (tell) 
        {
          let alert = this.alertCtrl.create({
          title: 'Network Connection',
          subTitle: 'Network has been disconnected',
          buttons: ['OK']
          });
        alert.present();
        }
      });

      let connectSubscription = this.network.onConnect().subscribe(() => {
        console.log('Network connected!');
        // We just got a connection but we need to wait briefly
        // before we determine the connection type. Might need to wait.
        // prior to doing any api requests as well.
        console.log('Network Connection = ' + this.network.type);
        console.log('Network Perf = ' + this.network.downlinkMax);

        if(tell){
        let alert = this.alertCtrl.create({
          title: 'Network Connection',
          subTitle: 'is : ' + this.network.type,
          buttons: ['OK']
          });
        alert.present();
    }
    
        setTimeout(() => {
          if (this.network.type === 'wifi') {
              console.log('We got a wifi connection');
            }
          }, 3000);
        });
        NetworkStatus.networkStatus = this.network.type;
console.log('leaving netstatus with value = ' + this.network.type);

        if(tell){
            let alert = this.alertCtrl.create({
            title: 'Network Connection',
            subTitle: this.network.type,
            buttons: ['OK']
            });
            alert.present();
        }
        return this.network.type;
  }

}

