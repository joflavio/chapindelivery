import { AuthenticationService } from './../../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CitiesService } from 'src/app/services/cities.service';
import { ShippingsService } from 'src/app/services/shippings.service';

const TOKEN_KEY = 'my-token';

@Component({
	selector: 'app-login',
	templateUrl: './login.page.html',
	styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
	credentials: FormGroup = this.fb.group({
		email: ['', [Validators.required, Validators.email]],
		password: ['', [Validators.required, Validators.minLength(6)]]
	});

	constructor(
		private fb: FormBuilder,
		private authService: AuthenticationService,
		private alertController: AlertController,
		private router: Router,
		private loadingController: LoadingController,
		private citiesService:CitiesService,
		private shippingsService:ShippingsService,
	) {}

	ngOnInit() {
	}

	async login() {
		const loading = await this.loadingController.create();
		await loading.present();

		this.authService.login(this.credentials.value).subscribe({
			next: async (res) => {
				this.citiesService.getAll().subscribe({
					next: (res:any) => {
						localStorage.setItem('cities', JSON.stringify(res));

						this.shippingsService.getShippingStatuses().subscribe({
							next: (res:any) => {
								localStorage.setItem('shippingStatuses', JSON.stringify(res));

								loading.dismiss();
								this.router.navigateByUrl('/tabs', { replaceUrl: true });
							},
							error:  (err:any) => {
								console.log('shippingstatuses error'+err);
							}
						});
					},
					error: (err:any) => {
						loading.dismiss();
						console.log('cities error'+err);
					}
				});		
			},
			error:  async (err) => {
				loading.dismiss();
				const alert3 = this.alertController.create({
					header: 'Error de Login',
					message: err.error.error,
					buttons: ['OK']
				});
				(await alert3).present();
				return;
			},
			complete: async () => {
				console.log('complete');
			}
		});




		
	}

	loadLists(){
		this.citiesService.getAll().subscribe({
			next: (res:any) => {
				localStorage.setItem('cities', JSON.stringify(res));
			},
			error: (err:any) => {
				console.log('cities error'+err);
			}
		});
		this.shippingsService.getShippingStatuses().subscribe({
			next: (res:any) => {
				localStorage.setItem('shippingStatuses', JSON.stringify(res));
			},
			error:  (err:any) => {
				console.log('shippingstatuses error'+err);
			}
		});
	}

	goTabs(){
		this.router.navigateByUrl('/tabs', { replaceUrl: true });
	}

	goSignin(){
		this.router.navigateByUrl('/signin', { replaceUrl: true });
	}

	// Easy access for form fields
	get email() {
		return this.credentials.get('email');
	}

	get password() {
		return this.credentials.get('password');
	}

}