import { Component, OnInit } from '@angular/core';
import { ModalController  } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource,} from '@capacitor/camera';

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
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos // Camera, Photos or Prompt!
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
