import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, AnimationController   } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ShippingsService } from 'src/app/services/shippings.service';
import { Router } from '@angular/router';
import { ShippingsComponent } from '../shippings/shippings.component';

@Component({
  selector: 'app-shipping-list',
  templateUrl: './shipping-list.component.html',
  styleUrls: ['./shipping-list.component.scss'],
})
export class ShippingListComponent  implements OnInit {

  shippings:any;
  title:any;
  type:any;

  _user:any;
  _cities:any;
  _shippingStatuses:any;

  constructor(
    private authService: AuthenticationService, 
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController,
    private modalCtrl: ModalController,
    private modalController: ModalController,
    private animationCtrl: AnimationController,
    private shippingsService: ShippingsService
  ) { 

    try{
      this._user=JSON.parse(localStorage.getItem('myUser')!);
      this._cities = new Map(JSON.parse(localStorage.getItem('cities')!).map((element: { id: any; }) => [element.id, element]));
      this._shippingStatuses = new Map(JSON.parse(localStorage.getItem('shippingStatuses')!).map((element: { id: any; }) => [element.id, element]));
      this.getServices();
    }
    catch {
      this.logout();
    }
  }

  ngOnInit() {}

  getServices(){
    this.shippingsService.getByStatusId(1).subscribe({
      next: (res) => {
        if (res){
          this.shippings=res;
        }
      },
      error: (err) => {
        console.log('services: error - 404');
        if (err.status==404){
          this.shippings=undefined;
        }
      }
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

  hasEnvios(){
    return this.shippings!=undefined && this.shippings.length>0;
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

  async openShipping(_shipping:any) {
    var type:any;

    switch(_shipping.statusid){
      case 1:{
        type='aceptar';
        break;
      }
    }

    const modal = await this.modalController.create({
      component: ShippingsComponent,
      componentProps: {
        shipping:_shipping,
        type: type
       },
      enterAnimation: this.enterAnimation,
      leaveAnimation: this.leaveAnimation,
    });

    modal.present();
    const { data, role }=await modal.onWillDismiss();
    console.log('shipping: '+role);
    this.getServices();
    /*
    console.log('shipping list: '+role)
    if (role=='confirm'){
      
      return this.modalCtrl.dismiss(null,'confirm');
    } 
    return;*/
   }

   cancel(){
    return this.modalCtrl.dismiss(null,'cancel');
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
}
