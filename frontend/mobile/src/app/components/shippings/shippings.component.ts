import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, LoadingController, AnimationController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ShippingsService } from 'src/app/services/shippings.service';
import { UsersService } from 'src/app/services/users.service';
import { Router } from '@angular/router';
import { ImageViewerComponent } from '../image-viewer/image-viewer.component';
import { FilesService } from 'src/app/services/files.service';


class Input{
  value:any;
  //disable:boolean=true;
  //show:boolean=true;
}

@Component({
  selector: 'app-shippings',
  templateUrl: './shippings.component.html',
  styleUrls: ['./shippings.component.scss'],
})
export class ShippingsComponent  implements OnInit {
  shipping:any;
  type:any;

  _cities:any;
  _user:any;
  _shippingStatuses:any;

  _id:any;
  _requestUser:any;
  _deliveryUser:any;
  _requestDate:any;
  _requesterAddress:any;
  _requestCity:any;
  _destinationAddress:any;
  _destinationCity:any;
  _acceptanceDate:any;
  _receivedDate:any;
  _deliveredDate:any;
  _cancelDate:any;
  _totalAmount:any;
  _cancel:any;
  _cancelcomments2:any;
  _cancelcomments:any;
  _status:any;

  constructor(
    private modalCtrl: ModalController,
    private authenticationService:AuthenticationService,
    private router:Router,
    private alertController: AlertController,
    private shippingsService: ShippingsService,
    private loadingController: LoadingController,
    private usersService:UsersService, 
    private animationCtrl:AnimationController,
    private filesService:FilesService,
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
  }

  dateToString(date:any){
    return (new Date(date)).toLocaleString('en-GB');
  }

  private async getUserName(userId:any): Promise<any>{

  }

  async ngOnInit() {
    this._id=this.shipping.id;
    this._requestDate=this.dateToString(this.shipping.requestdate);
    this._requesterAddress=this.shipping.requestaddress;
    this._requestCity=this._cities.get(parseInt(this.shipping.requestcityid)).name;
    this._destinationAddress=this.shipping.destinationaddress;
    this._destinationCity=this._cities.get(parseInt(this.shipping.destinationcityid)).name;
    this._totalAmount=this.shipping.totalAmount;
    this._status=this._shippingStatuses.get(parseInt(this.shipping.statusid)).name;
    
    if (this.shipping.deliveryuserid) this._deliveryUser=this.shipping.deliveryuserid;
    if (this.shipping.acceptancedate) this._acceptanceDate=this.dateToString(this.shipping.acceptancedate);
    if (this.shipping.receiveddate) this._receivedDate=this.dateToString(this.shipping.receiveddate);
    if (this.shipping.canceldate) this._cancelDate=this.dateToString(this.shipping.canceldate);
    if (this.shipping.cancelcomments) this._cancelcomments=this.shipping.cancelcomments;
    if (this.shipping.acceptancedate) this._acceptanceDate=this.dateToString(this.shipping.acceptancedate);
    if (this.shipping.delivereddate) this._deliveredDate=this.dateToString(this.shipping.delivereddate);

    if (this.shipping.requestuserid){ 
      const loading = await this.loadingController.create();
      await loading.present();
  
      this.usersService.get(this.shipping.requestuserid).subscribe({
        next: (res) => {
          var email: any;
          const users=res;
          if (users){
            email=users[0].email;
          }
          this._requestUser=email;
        },
        complete: async () => {
          await loading.dismiss();
        }
      });
    }
    if (this.shipping.deliveryuserid){
      const loading = await this.loadingController.create();
      await loading.present();
  
      this.usersService.get(this.shipping.deliveryuserid).subscribe({
        next: (res) => {
          var email: any;
          const users=res;
          if (users){
            email=users[0].email;
          }
          this._deliveryUser=email;
        },
        complete: async () => {
          await loading.dismiss();
        }
      });
    }
  }

  status(statusId:any){
    return (this.shipping.statusid==statusId);
  }

  cancelCheckboxChange(){
    this._cancelcomments2.disable=!this._cancel;
  }

  private async logout(){
    this.authenticationService.logout();
    this.router.navigateByUrl('/', { replaceUrl:true });
    const alert = await this.alertController.create({
      header: 'Mis Envios',
      message: 'Algo fue mal!!!',
      buttons: ['OK']
    });
    await alert.present();
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  async openImage(statusid:any){
    if ((this.shipping.statusid==3 && !this.shipping.receivedimageid)
      || (this.shipping.statusid==4 && !this.shipping.deliveredimageid))
      return ;

    const loadingImages = await this.loadingController.create();
    await loadingImages.present();
    
    const title=(this.shipping.statusid==3)?"Recepcion":"Entrega";
    
    var imageid;
    if (statusid==3)
      imageid=this.shipping.receivedimageid;
    else if (statusid==4)
      imageid=this.shipping.deliveredimageid;
    console.log(imageid);
    this.filesService.getImage(imageid).subscribe({
      next: async (res) => {
        const base64Data = await this.convertBlobToBase64(res) as string;
        await loadingImages.dismiss();
        const modal = await this.modalCtrl.create({
          component: ImageViewerComponent,
          componentProps: {
            title: title,
            photo: base64Data
          },
          enterAnimation: this.enterAnimation,
          leaveAnimation: this.leaveAnimation,
        });
        await modal.present();
      },
      error: async () =>{
        await loadingImages.dismiss();
      }
    });

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
