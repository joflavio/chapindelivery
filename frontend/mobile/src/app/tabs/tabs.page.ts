import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { CitiesService } from '../services/cities.service';
import { ShippingsService } from '../services/shippings.service';
import { LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(

	private toastCtrl: ToastController,
	private citiesService:CitiesService,
	private shippingsService:ShippingsService,
	private loadingController:LoadingController,
	) {
  	}

	async ngOnInit(){
		this.presentToast();
		//await this.loadLists();	
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







}


