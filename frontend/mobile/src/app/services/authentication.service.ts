import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
	
	token:any;

	constructor(private http: HttpClient,
		private alertController: AlertController,
		) { 
		this.loadToken();
	}

	loadToken() {
		const token = localStorage.getItem('myToken');
		if (token)
			this.token=token;
	}

	login(credentials: { email:any; password:any }): Observable<any> {
		return this.http.post(`${environment.baseUrl}/login`, credentials).pipe(
			map((data: any) => {
				data.user.password=undefined;
				localStorage.setItem('myToken', data.token);
				localStorage.setItem('myUser', JSON.stringify(data.user));
				this.token=data.token;
				return data;
			})
		);
	}

	signin(credentials:any){
		return this.http.post(`${environment.baseUrl}/signin`, credentials).pipe(
			map((data: any) => {
				data.user.password=undefined;
				localStorage.setItem('myToken', data.token);
				localStorage.setItem('myUser', JSON.stringify(data.user));
				this.token=data.token;
				return data;
			})
		);
	}

	isLoggedIn(){
		return (this.token!=undefined && this.token!="");
	}

  	logout() {
		this.token=undefined;
		 localStorage.removeItem('myToken');
		 localStorage.removeItem('myUser');
	}
}
