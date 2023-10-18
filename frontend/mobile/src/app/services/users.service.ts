import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable} from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
	token:any;

  	constructor(private http: HttpClient) { 
		this.loadToken();
	}

  	loadToken(){	
	const token = localStorage.getItem('myToken');
	if (token)
		this.token=token;
}
	get(id:any): Observable<any>
	{
		let headersToSend = new HttpHeaders();
		headersToSend = headersToSend
			.set('x-access-token', this.token)
			.set('Accept','application/json');
		return this.http.get(`${environment.baseUrl}/users/${id}`, { headers: headersToSend }).pipe(
			map((data: any) => {
				return data;
			})
		);
	}

	update(user:any): Observable<any> {
		let headersToSend = new HttpHeaders();
		headersToSend = headersToSend
			.set('x-access-token', localStorage.getItem('myToken')!)
			.set('Accept','application/json');
		//console.log(user);
		return this.http.put(`${environment.baseUrl}/users`, user, { headers: headersToSend }).pipe(
			map((data: any) => {
				return data;
			})
		);
	}
}
