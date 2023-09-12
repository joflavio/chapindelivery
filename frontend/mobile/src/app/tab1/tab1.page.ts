import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './../services/authentication.service';
import { AlertController, LoadingController, ModalController, AnimationController   } from '@ionic/angular';
import { ShippingsComponent } from '../components/shippings/shippings.component';
import { ShippingNewComponent } from '../components/shipping-new/shipping-new.component';
import { ShippingsService } from '../services/shippings.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
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
    private shippingsService: ShippingsService,
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

    private getShippings(){
      this.shippingsService.getByRequestUserId(this._user.id).subscribe(
        async (res) => {
          this.shippings=res;
        },
        async (err) => {
          if (err.status==404) return;
          this.logout();
        },
        async () => console.info('complete')
      );
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
        type: 'cancelar'
       },
      enterAnimation: this.enterAnimation,
      leaveAnimation: this.leaveAnimation,
    });
    modal.present();

    await modal.onWillDismiss();

  }

  async openNew() {
    const modal = await this.modalCtrl.create({
      component: ShippingNewComponent,
      componentProps:{
        user: this._user,
      },
      enterAnimation: this.enterAnimation,
      leaveAnimation: this.leaveAnimation,
    });
    modal.present();

    const {data, role} = await modal.onWillDismiss();
    if (role==='confirm'){
      this.getShippings();
    }
  }
}
