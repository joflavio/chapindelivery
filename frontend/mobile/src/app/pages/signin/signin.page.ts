import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthenticationService } from './../../services/authentication.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {

  credentials: FormGroup = this.fb.group({
		email: ['', [Validators.required, Validators.email]],
    firstname: ['', [Validators.required]],
    lastname: ['', [Validators.required]],
		password: ['', [Validators.required, Validators.minLength(6)]],
    password2: ['', [Validators.required, Validators.minLength(6)]]
	});

  //passwordVerification:boolean=false;
  constructor(
    private fb: FormBuilder,
		private authService: AuthenticationService,
		private alertController: AlertController,
		private router: Router,
		private loadingController: LoadingController
) { }

  ngOnInit() {
  }

  passwordVerification(){
    return this.credentials.get('password')?.value===this.credentials.get('password2')?.value;
  }

  async signin(){
    if (!this.passwordVerification()) {
      return;
    }
    const loading = await this.loadingController.create();
		await loading.present();
		this.authService.signin(this.credentials.value).subscribe(
			async (res) => {
				await loading.dismiss();
				this.router.navigateByUrl('/tabs', { replaceUrl: true });
			},
			async (res) => {
				await loading.dismiss();
				const alert = await this.alertController.create({
					header: 'Error de Signin',
					message: res.error.error,
					buttons: ['OK']
				});

				await alert.present();
			},
			async () => console.info('complete')
		);
  }

  gologin(){
    this.router.navigateByUrl('/', { replaceUrl: true });
  }

}

