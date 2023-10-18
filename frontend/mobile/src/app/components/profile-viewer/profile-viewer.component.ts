import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, AnimationController } from '@ionic/angular';
import { FilesService } from 'src/app/services/files.service';
import { ImageViewerComponent } from '../image-viewer/image-viewer.component';

@Component({
  selector: 'app-profile-viewer',
  templateUrl: './profile-viewer.component.html',
  styleUrls: ['./profile-viewer.component.scss'],
})
export class ProfileViewerComponent  implements OnInit {

  _imageAvatar: any;
  _user:any;
  title:any;

  constructor(
    private loadingController:LoadingController,
    private modalCtrl:ModalController,
    private animationCtrl:AnimationController,
    private filesService:FilesService,
  ) { }

  async ngOnInit() {
    const loading = await this.loadingController.create();
		await loading.present();

    if (this._user.userimageid){
      this.filesService.getImage(this._user.userimageid).subscribe({
        next: async (res) => { 
          const base64Data = await this.convertBlobToBase64(res) as string;
          this._imageAvatar=base64Data;
        },
        error: (err) => { console.log(err);},
        complete: async () => { await loading.dismiss(); }
      });  
    }
    else{
      await loading.dismiss();
    }
  }

  loadAvatar(){
    return (this._imageAvatar)?this._imageAvatar:"assets/avatar.svg";
  }

  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

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


  async showImage(title:string,imageid:string){
    const loadingImages = await this.loadingController.create();
    await loadingImages.present();

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

}
