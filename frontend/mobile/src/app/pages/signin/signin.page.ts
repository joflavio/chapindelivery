import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthenticationService } from './../../services/authentication.service';
import { CitiesService } from 'src/app/services/cities.service';
import { ShippingsService } from 'src/app/services/shippings.service';

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

  
  constructor(
    private fb: FormBuilder,
	private authService: AuthenticationService,
	private alertController: AlertController,
	private router: Router,
	private loadingController: LoadingController,
	private citiesService:CitiesService,
    private shippingsService:ShippingsService,
) { }

  ngOnInit() {
  }

  passwordVerification(){
    return this.credentials.get('password')?.value===this.credentials.get('password2')?.value;
  }
 
	async loadCatalogs():Promise<void>{

	}

  async signin(){
    if (!this.passwordVerification()) {
      return;
    }

    const loading = await this.loadingController.create();
	await loading.present();
	
	this.authService.signin(this.credentials.value).subscribe({
		next: async (res) => {
			this.citiesService.getAll().subscribe({
				next: async (cities:any) => {
					const json=JSON.stringify(cities);
					//console.log(json);
					localStorage.setItem('cities', json);

					this.shippingsService.getShippingStatuses().subscribe({
						next: async (status:any) => {
							const json=JSON.stringify(status);
							//console.log(json);
							localStorage.setItem('shippingStatuses', json);
							await loading.dismiss();
							this.router.navigateByUrl('/tabs', { replaceUrl: true });
						},
						error: async (err:any) => {
							console.log('shippingstatuses error'+err);
							await loading.dismiss();
							throw err;
						}
					});
				},
				error: async (err:any) => {
					await loading.dismiss();
					console.log('cities error'+err);
					throw err;
				}
			});
		},
		error: async (res) => {
			await loading.dismiss();
			const alert = await this.alertController.create({
				header: 'Error de Signin',
				message: res.error.error,
				buttons: ['OK']
			});
			await alert.present();
		}
	});
	this.router.navigateByUrl('/tabs', { replaceUrl: true });
  }

  gologin(){
    this.router.navigateByUrl('/', { replaceUrl: true });
  }

}

