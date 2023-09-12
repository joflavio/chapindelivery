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
}
