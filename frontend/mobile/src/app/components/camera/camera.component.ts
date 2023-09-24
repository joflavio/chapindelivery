import { Component, OnInit } from '@angular/core';
import { ModalController  } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource,} from '@capacitor/camera';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss'],
})
export class CameraComponent  implements OnInit {
  _image:any;

  constructor(
    private modalCtrl: ModalController,
    ) { }

  ngOnInit() {
    this.selectImage();
  }

	async selectImage(){
    const image = await Camera.getPhoto({
      quality: 90,
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

  confirm(){
    return this.modalCtrl.dismiss({'image': this._image}, 'confirm');
  }

}
