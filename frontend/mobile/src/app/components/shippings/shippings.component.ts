import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ShippingsService } from 'src/app/services/shippings.service';
import { Router } from '@angular/router';

class Input{
  value:any;
  disable:boolean=true;
  show:boolean=true;
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
  _requestUser:Input=new Input();
  _deliveryUser:Input=new Input();
  _requestDate:Input=new Input();
  _requesterAddress:Input=new Input();
  _requestCity:Input=new Input();
  _destinationAddress:Input=new Input();
  _destinationCity:Input=new Input();
  _receivedDate:Input=new Input();
  _deliveredDate:Input=new Input();
  _cancelDate:Input=new Input();
  _totalAmount:Input=new Input();
  _cancel:Input=new Input();
  _cancelcomments2:Input=new Input();
  _cancelcomments:Input=new Input();
  _status:Input=new Input();
  //_acceptButtonDisable:boolean=true;

  constructor(
    private modalCtrl: ModalController,
    private authenticationService:AuthenticationService,
    private router:Router,
    private alertController: AlertController,
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
    
  }

  ngOnInit() {
    this._id=this.shipping.id;
    const date = new Date(this.shipping.requestdate);
    this._requestDate.value=date.toLocaleString('en-GB');
    this._requesterAddress.value=this.shipping.requestaddress;
    this._requestCity.value=this._cities.get(this.shipping.requestcityid).name;
    this._destinationAddress.value=this.shipping.destinationaddress;
    this._destinationCity.value=this._cities.get(this.shipping.destinationcityid).name;
    this._totalAmount.value=this.shipping.totalAmount;
    this._status.value=this._shippingStatuses.get(this.shipping.statusid).name;

    if (this.shipping.canceldate){
      const date = new Date(this.shipping.requestdate);
      this._cancelDate.value=date.toLocaleString('en-GB');
    }
    if (this.shipping.cancelcomments){
      this._cancelcomments.value=this.shipping.cancelcomments;
    }

    switch (this._shippingStatuses.get(this.shipping.statusid).name) {
      case 'Creado':
        {
          this._requestUser.show=false;
          this._deliveryUser.show=false;
          this._receivedDate.show=false;
          this._deliveredDate.show=false;
          this._cancelDate.show=false;
          this._cancelcomments.show=false;
          break;
        }
      case 'Cancelada':
        {
          this._requestUser.show=false;
          this._deliveryUser.show=false;
          this._receivedDate.show=false;
          this._deliveredDate.show=false;
          break;
        }
    }
    this._cancel.disable=false;
  }

  cancelCheckboxChange(){
    this._cancelcomments2.disable=!this._cancel.value;
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

  async confirm() {
     if (this.type=="cancelar") {
      const alert = this.alertController.create({
        header: 'Error de Login',
        message: 'Esta seguro de cancelar el envio?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          }, 
          {
            text: 'Ok',
            role: 'confirm',
          }
        ]});
      (await alert).present();
      const result=(await (await alert).onDidDismiss()).role;
      if (result==='confirm'){
        this.shipping.statusid=5;
        if (this._cancelcomments2.value && this._cancelcomments2.value.trim().length>0){
          this.shipping.cancelcomments=this._cancelcomments2.value.trim();
        }
        this.shippingsService.update(this.shipping).subscribe({
          next: (res) => console.log(res),
          error: (err) => console.log(err)
        });
      } else if (result==='cancel') {
        return;
      }
      return this.modalCtrl.dismiss('confirm');
    } else if (this.type=="aceptar"){
      this.shipping.deliveryuserid=this._user.id;
      this.shipping.statusid=2;
      this.shippingsService.update(this.shipping).subscribe({
        next: (res) => console.log('done!'),
        error: (err) => console.log(err)
      });
      
      return this.modalCtrl.dismiss(null,'confirm');
    }
    return;
  }

}
