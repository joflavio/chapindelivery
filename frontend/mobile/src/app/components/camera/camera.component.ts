import { Component, OnInit } from '@angular/core';
import { ModalController  } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource,} from '@capacitor/camera';
import { environment } from 'src/environments/environment';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss'],
})
export class CameraComponent  implements OnInit {
  _image:any;
  title:string="";

  constructor(
    private modalCtrl: ModalController,
    private alertController: AlertController,
    ) { }

  ngOnInit() {
    this.takePhoto();
  }

	async takePhoto(){
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

  loadImage(){
    return (this._image)?this._image.webPath:undefined;
  }

  cancel(){
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  async confirm(){
    if (!this._image){
      const alert = await this.alertController.create({
        header: 'Mis Envios',
        message: 'Debe tomar la foto!',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }
    return this.modalCtrl.dismiss({'image': this._image}, 'confirm');
  }

}
