import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShippingsService } from 'src/app/services/shippings.service';
import { LoadingController, AlertController,ModalController,AnimationController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
//import { CameraComponent } from '../camera/camera.component';
import { Camera, CameraResultType, CameraSource,} from '@capacitor/camera';
import { Photo } from '@capacitor/camera';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-shipping-new',
  templateUrl: './shipping-new.component.html',
  styleUrls: ['./shipping-new.component.scss'],
})
export class ShippingNewComponent  implements OnInit {
  _shipping:any;
  _user:any;
  _image:any;

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
    private animationController: AnimationController,
    private authenticationService: AuthenticationService,
    private router: Router,
  ) { 
    try{
      this._user=JSON.parse(localStorage.getItem('myUser')!);
    }
    catch {
      this.logout();
    }
  }
  
  loadImage(){
    if (this._image){
      const photo:Photo=this._image;
      return photo.webPath;
    }
    else {
      return 'assets/thumbnail.svg';
    }
  }

	async logout() {
    const loading = await this.loadingController.create();
		await loading.present();
		this.authenticationService.logout();
    await loading.dismiss();
    console.log('logout');
		this.router.navigateByUrl('/', { replaceUrl: true });
	}

  ngOnInit() {}

  newShipping(){}

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  async confirm() {
    if (!this._image){
      const alert = this.alertController.create({
        header: 'Error',
        message: 'Tomar la foto!!',
        buttons: ['OK']
      });
     (await alert).present();
      return;
    }
    
    const loading = await this.loadingController.create();
		await loading.present();

    var _shipping = {
      requestuserid:this._user.id,
      requestaddress: this.shipping.value['requesterAddress'],
      requestcityid: this.shipping.value['requesterCity'],
      destinationaddress: this.shipping.value['destinationAddress'],
      destinationcityid: this.shipping.value['destinationCity'],
      totalAmount: this.shipping.value['totalAmount']
    }
    const photo:Photo=this._image;
    const response = await fetch(photo.webPath!);
      const blob = await response.blob();
    this.shippingsService.create(blob, _shipping).subscribe({
      next: async (res) => {
        await loading.dismiss();
        return this.modalCtrl.dismiss(
          {
            shipping: res,
            image: photo
          }, 'confirm');
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
        return this.modalCtrl.dismiss(null, 'cancel');
      }
    });
    
  }

  enterAnimation = (baseEl: HTMLElement) => {
    const root = baseEl.shadowRoot;

    const backdropAnimation = this.animationController
      .create()
      .addElement(root?.querySelector('ion-backdrop')!)
      .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

    const wrapperAnimation = this.animationController
      .create()
      .addElement(root?.querySelector('.modal-wrapper')!)
      .keyframes([
        { offset: 0, opacity: '0', transform: 'scale(0)' },
        { offset: 1, opacity: '0.99', transform: 'scale(1)' },
      ]);

    return this.animationController
      .create()
      .addElement(baseEl)
      .easing('ease-out')
      .duration(500)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  leaveAnimation = (baseEl: HTMLElement) => {
    return this.enterAnimation(baseEl).direction('reverse');
  };

  async launchCamera(){
    const image = await Camera.getPhoto({
      quality: 50,
      correctOrientation: true,
      height: 1280,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: (environment.camera)?CameraSource.Camera:CameraSource.Photos // Camera, Photos or Prompt!
    });

    this._image=image;

  }

}
