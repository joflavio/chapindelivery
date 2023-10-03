import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './../services/authentication.service';
import { AlertController, LoadingController, AnimationController, ModalController } from '@ionic/angular';
import { FilesService } from '../services/files.service';
import { UsersService } from '../services/users.service';
import { CameraComponent } from '../components/camera/camera.component';
import { Photo } from '@capacitor/camera';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  _user:any;
  _email:any;
  _imageAvatar: any;

  constructor(
		private authService: AuthenticationService,
    private filesService: FilesService,
		private alertController: AlertController,
		private router: Router,
		private loadingController: LoadingController,
    private animationCtrl: AnimationController,
    private modalCtrl: ModalController,
    private usersService: UsersService,
  ) {
    try{
      this._user=JSON.parse(localStorage.getItem('myUser')!);
      this._email=this._user.email;
    }
    catch {
      this.logout();
    }
  }

  async ngOnInit(){

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
      //this._imageAvatar='https://ionicframework.com/docs/img/demos/avatar.svg';
      await loading.dismiss();
    }
    
  }

  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  loadAvatar(){
    return (this._imageAvatar)?this._imageAvatar:"assets/avatar.svg";
  }

	async logout() {
    const loading = await this.loadingController.create();
		await loading.present();
		this.authService.logout();
    await loading.dismiss();
    console.log('logout');
		this.router.navigateByUrl('/', { replaceUrl: true });
	}

  async launchCamera(){
    const modal = await this.modalCtrl.create({
      component: CameraComponent,
      componentProps:{
      },
      enterAnimation: this.enterAnimation,
      leaveAnimation: this.leaveAnimation,
    });
    modal.present();

    const {data, role} = await modal.onWillDismiss();
    if (role==='confirm'){
      const photo:Photo = data.image;
      const response = await fetch(photo.webPath!);
      const blob = await response.blob();
      const fileName=`img-${ Date.now()}-${Math.round(Math.random() * 1E9)}.jpg`;
      this.filesService.uploadUserImage(blob, this._user.email,fileName).subscribe({
        next: (res) => { 
          if (res){
            this.usersService.get(this._user.id).subscribe({
              next: (res) => {
                if (res.length>0){
                  this._user = res[0];
                  localStorage.setItem('myUser',JSON.stringify(this._user));
                }
              },
              error: (err) => {}
            });
            this._imageAvatar=photo.webPath;
          }
        },
        error: (err) => { console.log(err);}
      })
    }
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
