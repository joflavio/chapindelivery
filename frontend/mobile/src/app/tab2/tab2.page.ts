import { Component } from '@angular/core';
import { ShippingsComponent } from '../components/shippings/shippings.component';
import { ShippingsService } from '../services/shippings.service';
import { AuthenticationService } from './../services/authentication.service';
import { AlertController, LoadingController, ModalController, AnimationController   } from '@ionic/angular';
import { Router } from '@angular/router';
import { ShippingListComponent } from '../components/shipping-list/shipping-list.component';
import { FilesService } from '../services/files.service';
import { UsersService } from '../services/users.service';
import { Filesystem } from '@capacitor/filesystem';
import { Directory } from '@capacitor/filesystem/dist/esm/definitions';
import { environment } from 'src/environments/environment';


const convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
  const reader = new FileReader;
  reader.onerror = reject;
  reader.onload = () => {
      resolve(reader.result);
  };
  reader.readAsDataURL(blob);
});

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
    private usersService:UsersService,
    ) {

    }

    async ngOnInit() {
      /*
      const loadingUsers = await this.loadingController.create();
      await loadingUsers.present();
*/
      try{
        this._user=JSON.parse(localStorage.getItem('myUser')!);
        this._cities = new Map(JSON.parse(localStorage.getItem('cities')!).map((element: { id: any; }) => [element.id, element]));
        this._shippingStatuses = new Map(JSON.parse(localStorage.getItem('shippingStatuses')!).map((element: { id: any; }) => [element.id, element]));
      }
      catch {
        this.logout();
      }
      try{
        console.log('1');
        await this.getShippings();
      } catch(err){}
        
      //await loadingUsers.dismiss();
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

    getShippings = () => new Promise((resolve, reject) => {
        this.shippingsService.getByDeliveryUserId(this._user.id).subscribe({
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

            return;
          }
          else{
            this.logout();
            throw reject;
          }
        },
        complete: async () => {
          resolve(null);
        }
      });     
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
        },
        enterAnimation: this.enterAnimation,
        leaveAnimation: this.leaveAnimation,
      });
      modal.present();
      const { data, role } = await modal.onWillDismiss();
      //console.log('tabs2: '+role);
      if (role=='confirm'){
        const shipping=data;
        //console.log(shipping);
        shipping.deliveryuserid=this._user.id;
        shipping.statusid=2;
        await this.updateShipping(shipping);

        await this.getShippings();
      }
      
    }

    private async updateShipping(shipping:any){
      const loading = await this.loadingController.create();
      await loading.present();

      this.shippingsService.update(shipping).subscribe({
        next: (res) => {
          console.log(res);
          shipping=res;
        },
        error: (err)=> { console.log(err)},
        complete: async () => {
          await loading.dismiss();
        }

      });
    }

    async receiveShipping(shipping:any){
      console.log(shipping);
      if (shipping.statusid==2)
        shipping.statusid=3;
      else if (shipping.statusid==3)
        shipping.statusid=4;  
      else return;

      this.updateShipping(shipping);

    }

    buttonText(shipping:any){
      var text=""
      if (shipping.statusid==2) text="Recibir envio";
      else if (shipping.statusid==3) text="Entregar envio";
      return text;
    }
}
