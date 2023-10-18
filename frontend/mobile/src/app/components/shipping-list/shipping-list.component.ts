import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, AnimationController   } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ShippingsService } from 'src/app/services/shippings.service';
import { FilesService } from 'src/app/services/files.service';
import { Router } from '@angular/router';
import { ShippingsComponent } from '../shippings/shippings.component';
import { Filesystem } from '@capacitor/filesystem';
import { Directory } from '@capacitor/filesystem/dist/esm/definitions';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'app-shipping-list',
  templateUrl: './shipping-list.component.html',
  styleUrls: ['./shipping-list.component.scss'],
})
export class ShippingListComponent  implements OnInit {

  shippings:any;
  type:any;
  images = new Map();

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
    private shippingsService: ShippingsService,
    private filesService: FilesService,
  ) { 

  }

  async ngOnInit() {
    try{
      this._user=JSON.parse(localStorage.getItem('myUser')!);
      this._cities = new Map(JSON.parse(localStorage.getItem('cities')!).map((element: { id: any; }) => [element.id, element]));
      this._shippingStatuses = new Map(JSON.parse(localStorage.getItem('shippingStatuses')!).map((element: { id: any; }) => [element.id, element]));
       await this.getShippings();
    }
    catch {
      this.logout();
    }
  }
  
  getShippings = () => new Promise(async (resolve, reject) => {
    const loadingShippings = await this.loadingController.create();
    await loadingShippings.present();

    this.shippingsService.getByStatusId(1).subscribe({
    next: async (res) => {
      //console.log(res);
      this.shippings=res;
      
      this.shippings.forEach( async (e:any) => {
        const loadingImages = await this.loadingController.create();
        await loadingImages.present();

        this.filesService.getImageName(e.shippingimageid).subscribe({
          next: async (res) =>{
            try{
              if (!this.images.has(res.id)){
                const file = await Filesystem.readFile({
                  path: `${environment.imageDir}/${res.filename}`,
                  directory: Directory.Data,
                });
                const base64=`data:image/jpeg;base64,${file.data}`;
                this.images.set(res.id, base64);
              }
              await loadingImages.dismiss();

            } catch{
              console.log(`${environment.imageDir}/${res.filename} no existe!`);
              this.filesService.getImage(res.id).subscribe({
                next: async (_res) => {
                  if (_res){
                    const base64Data = await this.convertBlobToBase64(_res) as string;
                    if (!this.images.has(res.id)){
                      this.images.set(res.id, base64Data);
                    }
                    const savedFile = await Filesystem.writeFile({
                      path: `${environment.imageDir}/${res.filename}`,
                      data: base64Data,
                      directory: Directory.Data
                    });
                  }
                }
              });
              await loadingImages.dismiss();
            }
          },
          error: async (err) =>{
            await loadingImages.dismiss();
          }
        });
      });
      
    },
    error: async (err) => {
      if (err.status==404) {
        await loadingShippings.dismiss();
        return;
      }
      else{
        this.logout();
        throw reject;
      }
    },
    complete: async () => {
      resolve(null);
      await loadingShippings.dismiss();
    }
  });     
  });

  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
  const reader = new FileReader;
  reader.onerror = reject;
  reader.onload = () => {
      resolve(reader.result);
  };
  reader.readAsDataURL(blob);
  });

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
    //console.log('shipping: '+role);
    this.getShippings();
   }

  loadImage(shipping:any){
    return this.images.get(shipping.shippingimageid);
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

  confirm(shipping:any) {
    return this.modalCtrl.dismiss(shipping, 'confirm');
  }

}
