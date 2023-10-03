import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './../services/authentication.service';
import { AlertController, LoadingController, ModalController, AnimationController   } from '@ionic/angular';
import { ShippingCancelComponent } from '../components/shipping-cancel/shipping-cancel.component';
import { ShippingNewComponent } from '../components/shipping-new/shipping-new.component';
import { ShippingsComponent } from '../components/shippings/shippings.component';
import { ShippingsService } from '../services/shippings.service';
import { UsersService } from '../services/users.service';
import { FilesService } from '../services/files.service';
import { Filesystem } from '@capacitor/filesystem';
import { environment } from 'src/environments/environment';
import { Directory } from '@capacitor/filesystem';


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
  images = new Map();

  constructor(
    private authService: AuthenticationService, 
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController,
    private modalCtrl: ModalController,
    private animationCtrl: AnimationController,
    private shippingsService: ShippingsService,
    private filesService:FilesService,
    private usersService: UsersService,
    ) {
    }

    async ngOnInit() {

      try{
        this._user=JSON.parse(localStorage.getItem('myUser')!);
        this._cities = new Map(JSON.parse(localStorage.getItem('cities')!).map((element: { id: any; }) => [element.id, element]));
        this._shippingStatuses = new Map(JSON.parse(localStorage.getItem('shippingStatuses')!).map((element: { id: any; }) => [element.id, element]));
      }
      catch (err){
        this.logout(err);
      }
      this.shippingsService.getByRequestUserId(this._user.id).subscribe({
        next: async (res) => {
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

                    await loadingImages.dismiss();
                  }
                } catch{
                  //console.log(`${environment.imageDir}/${res.filename} no existe!`);
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
                  
                }
              },
              complete: async () => {
                await loadingImages.dismiss();
              }
            });
          });
        },
        error: async (err) => {
          if (err.status==404) {
            return;
          }
          else{
            console.log(err);
            this.logout(err);
          }
        },
        complete: async () => {
        }
      });      
    }

    private async logout(err:any){
      this.authService.logout();
      this.router.navigateByUrl('/', { replaceUrl:true });
      const alert = await this.alertController.create({
        header: 'Mis Envios',
        message: 'Algo fue mal: '+err,
        buttons: ['OK']
      });
      await alert.present();
    }

    async handleRefresh(event:any) {
      await this.ngOnInit();
      event.target.complete();
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
      const id=parseInt(statusid);
      return this._shippingStatuses.get(id).name;;
    }

    displayCity(cityId:any){
      const id=parseInt(cityId);
      return this._cities.get(id).name;;
    }


    convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
      const reader = new FileReader;
      reader.onerror = reject;
      reader.onload = () => {
          resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });

    loadImage(shipping:any){
      return this.images.get(shipping.shippingimageid);
    }

    hasEnvios(){
      return this.shippings!=undefined && this.shippings.length>0;
    }

    hasNoShippings(){
      var show=true;
      if (this.shippings){
        if (this.shippings.length>0){
          show=false;
        }
      }
      else{
        show=false;
      }
      return show;
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
    //Cancel
    if (_shipping.statusid==1){
      const modal = await this.modalCtrl.create({
        component: ShippingCancelComponent,
        componentProps: {
          shipping:_shipping,
          image: this.images.get(_shipping.shippingimageid)
        },
        enterAnimation: this.enterAnimation,
        leaveAnimation: this.leaveAnimation,
      });
      modal.present();

      const {data, role} = await modal.onWillDismiss();
      if (role=='confirm'){
        const loadingUsers = await this.loadingController.create();
        await loadingUsers.present();
        console.log(data);
        const shipping=data;
        this.shippingsService.update(shipping).subscribe({
          next: (res) => {
            console.log('done!')
          },
          error: (err) => console.log(err),
          complete: async () =>{
            await loadingUsers.dismiss();
          }
        });
      }
    }

    if (_shipping.statusid>=2 ){
      const modal = await this.modalCtrl.create({
        component: ShippingsComponent,
        componentProps: {
          shipping: _shipping,
          //image: this.images.get(_shipping.shippingimageid)
        },
        enterAnimation: this.enterAnimation,
        leaveAnimation: this.leaveAnimation,
      });
      modal.present();
      const {data, role} = await modal.onWillDismiss();
    }
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
      console.log(data);
      const {shipping, image, loading} = data;
      if (!this.shippings){
        this.shippings = new Array();
      }
      if (!this.images.has(shipping.shippingimageid)){

        this.images.set(shipping.shippingimageid, image.webPath);
      }
      this.shippings.push(shipping);
      //loading.dismiss();
    }
  }  
}
