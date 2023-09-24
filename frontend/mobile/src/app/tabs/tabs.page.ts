import { Component } from '@angular/core';
import { CitiesService } from '../services/cities.service';
import { ShippingsService } from '../services/shippings.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(
	private citiesService:CitiesService,
	private shippingsService:ShippingsService,
	private toastCtrl: ToastController
	) {
    this.loadLists();
  	}

	ngOnInit(){
	this.presentToast();	
	}

	async presentToast() {
		var _user=localStorage.getItem('myUser');
		if (_user){
			var user=JSON.parse(_user);
			const toast = await this.toastCtrl.create({
				message: `Bienvenido ${user.firstname}!!!`,
				duration: 750,
				position: 'middle',
			});
			toast.present();
		}
	}


  	loadLists(){
		this.citiesService.getAll().subscribe({
			next: (res) => {
				localStorage.setItem('cities', JSON.stringify(res));
			},
			error:  async (err) => {
				console.log('cities error'+err);
			}
		});
		this.shippingsService.getShippingStatuses().subscribe({
			next: (res) => {
				localStorage.setItem('shippingStatuses', JSON.stringify(res));
			},
			error:  async (err) => {
				console.log('shippingstatuses error'+err);
			}
		});
	}


}


