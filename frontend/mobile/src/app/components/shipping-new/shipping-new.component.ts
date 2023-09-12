import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShippingsService } from 'src/app/services/shippings.service';
import { LoadingController, AlertController,ModalController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shipping-new',
  templateUrl: './shipping-new.component.html',
  styleUrls: ['./shipping-new.component.scss'],
})
export class ShippingNewComponent  implements OnInit {
  _shipping:any;
  _user:any;

  shipping: FormGroup = this.fb.group({
    requesterAddress: ['', [Validators.required,Validators.minLength(20)]],
    requesterCity: ['1', [Validators.required]],
    destinationAddress: ['', [Validators.required,Validators.minLength(20)]],
    destinationCity: ['1', [Validators.required]],
    totalAmount: ['', [Validators.required]],
	});

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private shippingsService: ShippingsService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authenticationService: AuthenticationService,
    private router: Router,
  ) { }

  ngOnInit() {}

  newShipping(){}

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  async confirm() {
    const loading = await this.loadingController.create();
    var _shipping = {
      requestuserid:'1',
      //requestdate:'',
      requestaddress: this.shipping.value['requesterAddress'],
      requestcityid: this.shipping.value['requesterCity'],
      destinationaddress: this.shipping.value['destinationAddress'],
      destinationcityid: this.shipping.value['destinationCity'],
      totalAmount: this.shipping.value['totalAmount']
      //statusid:''
    }
    //console.log(_shipping);
    this.shippingsService.create({'shipping':_shipping}).subscribe({
      next: (res) => {
        loading.dismiss();
      },
      error: async (err) => {
        loading.dismiss();
				const alert = this.alertController.create({
					header: 'Error',
					message: err.error,
					buttons: ['OK']
				});
				(await alert).present();
        this.authenticationService.logout();
        this.router.navigateByUrl('/', { replaceUrl:true });  
      }
    });
    return this.modalCtrl.dismiss(null, 'confirm');
  }

}
