import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CitiesService {

	token:any;

	constructor(private http: HttpClient) {
	}

	getAll(): Observable<any> {
		let headersToSend = new HttpHeaders();
		headersToSend = headersToSend
			.set('x-access-token', localStorage.getItem('myToken')!)
			.set('Accept','application/json');
		
		return this.http.get(`${environment.baseUrl}/cities/all`,{ headers: headersToSend }).pipe(
			map((data: any) => {
				return data;
			})
		);
		
	}
}
