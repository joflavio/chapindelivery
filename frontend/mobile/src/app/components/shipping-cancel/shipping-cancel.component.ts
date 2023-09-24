import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Photo } from '@capacitor/camera';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-shipping-cancel',
  templateUrl: './shipping-cancel.component.html',
  styleUrls: ['./shipping-cancel.component.scss'],
})
export class ShippingCancelComponent  implements OnInit {

  image:any;
  shipping:any;

  shippingForm: FormGroup = this.fb.group({
    id: [{value:'', disabled:true}],
    requestDate: [{value:'', disabled:true}],
    requesterAddress: [{value:'', disabled:true}, [Validators.required,Validators.minLength(20)]],
    requesterCity: [{value:'', disabled:true}, [Validators.required]],
    destinationAddress: [{value:'', disabled:true}, [Validators.required,Validators.minLength(20)]],
    destinationCity: [{value:'', disabled:true}, [Validators.required]],
    totalAmount: [{value:'', disabled:true}, [Validators.required]],
    cancel: [false, [Validators.pattern('true')]],
    cancelcomments:  ['', [Validators.required,Validators.minLength(10)]],
	});

  constructor(
    private fb: FormBuilder,
    private modalController:ModalController,
  ) { }

  ngOnInit() {
    
    this.shippingForm.get('id')?.setValue(this.shipping.id);
    this.shippingForm.get('requesterAddress')?.setValue(this.shipping.requestaddress);
    this.shippingForm.get('destinationAddress')?.setValue(this.shipping.destinationaddress);
    this.shippingForm.get('requesterCity')?.setValue(this.shipping.requestcityid.toString());
    this.shippingForm.get('destinationCity')?.setValue(this.shipping.destinationcityid.toString());
    this.shippingForm.get('totalAmount')?.setValue(parseInt(this.shipping.totalAmount));
    const date = new Date(this.shipping.requestdate);
    this.shippingForm.get('requestDate')?.setValue(date.toLocaleString('en-GB'));
  }

  
  loadImage(){
    if (this.image){
      const photo:Photo=this.image;
      return this.image;
    }
    else {
      return 'https://ionicframework.com/docs/img/demos/thumbnail.svg';
    }
  }
  saveShipping(){}

  cancel(){
    return this.modalController.dismiss(null, 'cancel');
  }

  confirm(){
    this.shipping.statusid=5;
    this.shipping.cancelcomments=this.shippingForm.get('cancelcomments')?.value;
    return this.modalController.dismiss(this.shipping, 'confirm');
    
  }
}

