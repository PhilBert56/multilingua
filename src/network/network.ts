
import { Network } from '@ionic-native/network';
//import { NetworkStatus } from '../services/network';
//import { AlertController } from 'ionic-angular';
import { MyApp } from '../app/app.component';
import { Injectable } from '@angular/core';
import { Debug } from '../config/debug';
import { AlertOK } from '../utils/alert';
import { DataService } from '../dataservice/data.service';

@Injectable()
export class NetworkServices{

    //static networkStatus;

    constructor(
        private alertOK: AlertOK,
        private network: Network,
        private dataServ : DataService
    ){}

    checkNetworkStatus(){
      
      if(Debug){console.log('ENTERING inside checkNetworkStatus at ' + new Date())};
      if(Debug){console.log('Entering into checkNetworkStatus with connectionStatus = ' + MyApp.connectionStatus)};
      if(Debug){console.log('ENTERING inside checkNetworkStatus with network type = ' + this.network.type )};
      
      var alert : any;

      let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
        if(Debug){console.log('Network was disconnected :-(')};

        if (!(MyApp.connectionStatus === 'disconnected') ) { 
          this.alertOK.showAlert('Network Connection','Network has been disconnected');
          MyApp.networkHasBeenDisconnected = true;
          MyApp.connectionStatus = 'disconnected';
        }

        });

       let connectSubscription = this.network.onConnect().subscribe(() => {
         if(Debug){console.log('Network connected!')};
         // We just got a connection but we need to wait briefly
         // before we determine the connection type. Might need to wait.
         // prior to doing any api requests as well.
         if(Debug) {console.log('Network Connection = ' + this.network.type)};
         
         if (MyApp.networkHasBeenDisconnected) {
            var msg = 'is : ' + this.network.type ;
            this.alertOK.showAlert('Network Connection is now OK', msg);
         }
 
         MyApp.connectionStatus = 'ok';
         if(!MyApp.connectionAtStartUp){
            if(Debug){console.log('NEED TO RELOAD DATA AS NETWORK is now OK but was not at start up')};
            var msg = 'is : ' + this.network.type + '  (As Network was disconnected at start up, you should restart the App)';
            this.alertOK.showAlert('Network Connection is OK',msg);
            //this.dataServ.loadDataFromScratch();
         }
       });

       if (Debug) {console.log('Leaving checkNetworkStatus with value = ' + this.network.type)};
       if (!(this.network.type === 'none') ){MyApp.connectionStatus ='ok'};
       if (Debug) {console.log('Leaving checkNetworkStatus with connectionStatus = ' + MyApp.connectionStatus)};
    }
}