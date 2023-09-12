import { Component } from '@angular/core';
import { ShippingsComponent } from '../components/shippings/shippings.component';
import { ShippingsService } from '../services/shippings.service';
import { AuthenticationService } from './../services/authentication.service';
import { AlertController, LoadingController, ModalController, AnimationController   } from '@ionic/angular';
import { Router } from '@angular/router';
import { ShippingListComponent } from '../components/shipping-list/shipping-list.component';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  _user:any;
  _cities:any;
  _shippingStatuses:any;
  shippings:any;
  _shipping:any;

  constructor(    
    private authService: AuthenticationService, 
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController,
    private modalCtrl: ModalController,
    private animationCtrl: AnimationController,
    private shippingsService: ShippingsService
    ) {

      var _user:string|null = localStorage.getItem('myUser');
      var _cities:string|null = localStorage.getItem('cities');
      var _shippingStatuses:string|null = localStorage.getItem('shippingStatuses');
  
      try{
        this._user=JSON.parse(_user?_user:'');
        this._cities = new Map(JSON.parse(_cities?_cities:'').map((element: { id: any; }) => [element.id, element]));
        this._shippingStatuses = new Map(JSON.parse(_shippingStatuses?_shippingStatuses:'').map((element: { id: any; }) => [element.id, element]));
      }
      catch {
        this.logout();
      }
      this.getShippings();
    }

    private getShippings(){
      this.shippingsService.getByDeliveryUserId(this._user.id).subscribe({
        next: (res) => {
          this.shippings=res;
        },
        error: (err) => {
          if (err.status==404) return;
          this.logout();
        },
        complete: () => console.log('complete')
      });
    }

    private async logout(){
      this.authService.logout();
      this.router.navigateByUrl('/', { replaceUrl:true });
      const alert = await this.alertController.create({
        header: 'Mis Envios',
        message: 'Algo fue mal!!!',
        buttons: ['OK']
      });
      await alert.present();
    }

    statusCancel(statusid:any){
      return statusid==5;
    }

    statusDelivered(statusid:any){
      return statusid==4;
    }

    statusOnDelivery(statusid:any){
      return statusid==3;
    }

    statusAccepted(statusid:any){
      return statusid==2;
    }

    statusCreated(statusid:any){
      return statusid==1;
    }

    displayStatus(statusid:any){
      return this._shippingStatuses.get(statusid).name;
    }

    displayCity(cityId:any){
      return this._cities.get(cityId).name;;
    }

    hasEnvios(){
      return this.shippings!=undefined && this.shippings.length>0;
    }

    enterAnimation = (baseEl: HTMLElement) => {
      const root = baseEl.shadowRoot;
  
      const backdropAnimation = this.animationCtrl
        .create()
        .addElement(root?.querySelector('ion-backdrop')!)
        .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');
  
      const wrapperAnimation = this.animationCtrl
        .create()
        .addElement(root?.querySelector('.modal-wrapper')!)
        .keyframes([
          { offset: 0, opacity: '0', transform: 'scale(0)' },
          { offset: 1, opacity: '0.99', transform: 'scale(1)' },
        ]);
  
      return this.animationCtrl
        .create()
        .addElement(baseEl)
        .easing('ease-out')
        .duration(500)
        .addAnimation([backdropAnimation, wrapperAnimation]);
    };
  
    leaveAnimation = (baseEl: HTMLElement) => {
      return this.enterAnimation(baseEl).direction('reverse');
    };

    async openShipping(_shipping:any) {
      const modal = await this.modalCtrl.create({
        component: ShippingsComponent,
        componentProps: {
          shipping:_shipping,
         },
        enterAnimation: this.enterAnimation,
        leaveAnimation: this.leaveAnimation,
      });
      modal.present();
  
      await modal.onWillDismiss();
  
    }

    async searchNew() {
      const modal = await this.modalCtrl.create({
        component: ShippingListComponent,
        componentProps:{
          title:'Envios disponibles',
        },
        enterAnimation: this.enterAnimation,
        leaveAnimation: this.leaveAnimation,
      });
      modal.present();
      const { data, role } = await modal.onWillDismiss();
      console.log('tabs2: '+role);
      this.getShippings();
      /*
      const { data, role } = await modal.onWillDismiss();
      if (role=='cancel' || role=='backdrop'){
        console.log('repartidor: ' + role)
      }
      else {
        console.log('repartidor: '+role);
      }
      */
    }
}
