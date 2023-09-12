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
      
      var _user:string|null = localStorage.getItem('myUser');
      
      try{
        this._user=JSON.parse(_user?_user:'');
        this._email=this._user.email;

      }
      catch {
        this.logout();
      }
      this.getImage();
    }

  ngOnInit() {}

  loadUser(){
    this.usersService.get(this._user.id).subscribe({
      next: (res) => {
        if (res.length>0){
          this._user = res[0];
          console.log(this._user);
          localStorage.setItem('myUser',JSON.stringify(this._user));
        }
      },
      error: (err) => {}
    });
  }

	async logout() {
    const loading = await this.loadingController.create();
		await loading.present();
		this.authService.logout();
    await loading.dismiss();
    console.log('logout');
		this.router.navigateByUrl('/', { replaceUrl: true });
	}

  getImage(){
    console.log('get image: '+this._user.userimageid);
    this.filesService.getImage(this._user.userimageid).subscribe({
      next: (res) => { 
        console.log(this._imageAvatar);
        this._imageAvatar=URL.createObjectURL(res);
        console.log(this._imageAvatar);
      },
      error: (err) => { console.log(err);}
    });
  }

  loadAvatar(){
    return this._imageAvatar?this._imageAvatar:undefined;
  }
  gologin(){
    this.router.navigateByUrl('/', { replaceUrl: true });
  }
  
  async launchCamera(){
    const modal = await this.modalCtrl.create({
      component: CameraComponent,
      componentProps:{
        //user: this._user,
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
      this.filesService.uploadImage(blob, this._user.email, 1).subscribe({
        next: (res) => { 
          if (res){
            this.loadUser();
            this.getImage();
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
