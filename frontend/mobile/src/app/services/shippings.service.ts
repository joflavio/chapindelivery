import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable} from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ShippingsService {

	constructor(private http: HttpClient) {	}
	 
	getShippingStatuses(): Observable<any>
	{
		let headersToSend = new HttpHeaders();
		headersToSend = headersToSend
			.set('x-access-token',localStorage.getItem('myToken')!)
			.set('Accept','application/json');
		return this.http.get(`${environment.baseUrl}/shippingstatus/all`, { headers: headersToSend }).pipe(
			map((data: any) => {
				return data;
			})
		);
	}

	create(imageData:any,shipping:any): Observable<any> {
		let headersToSend = new HttpHeaders();
		headersToSend = headersToSend
			.set('x-access-token', localStorage.getItem('myToken')!)
			.set('Accept','application/json');
		const formData = new FormData();
		formData.append('file', imageData);
		formData.append('shipping', JSON.stringify(shipping));
		return this.http.post(`${environment.baseUrl}/shippings`, formData, { headers: headersToSend }).pipe(
			map((data: any) => {
				return data;
			})
		);
	}

	update(shipping:any): Observable<any> {
		let headersToSend = new HttpHeaders();
		headersToSend = headersToSend
			.set('x-access-token', localStorage.getItem('myToken')!)
			.set('Accept','application/json');
			
		return this.http.put(`${environment.baseUrl}/shippings`, shipping, { headers: headersToSend }).pipe(
			map((data: any) => {
				return data;
			})
		);
	}
	
	getAll(): Observable<any> {
		let headersToSend = new HttpHeaders();
		headersToSend = headersToSend
			.set('x-access-token', localStorage.getItem('myToken')!)
			.set('Accept','application/json');
		return this.http.get(`${environment.baseUrl}/shippings/all`,{ headers: headersToSend }).pipe(
			map((data: any) => {
				return data;
			})
		);
		
	}

	getByRequestUserId(requestUserId:any): Observable<any> {
		let headersToSend = new HttpHeaders();
		headersToSend = headersToSend
			.set('x-access-token', localStorage.getItem('myToken')!)
			.set('Accept','application/json');
		return this.http.get(`${environment.baseUrl}/shippings/requestuserid/${requestUserId}`,{ headers: headersToSend }).pipe(
			map((data: any) => {
				return data;
			})
		);
		
	}

	getByDeliveryUserId(deliveryUserId:any): Observable<any> {
		let headersToSend = new HttpHeaders();
		headersToSend = headersToSend
			.set('x-access-token', localStorage.getItem('myToken')!)
			.set('Accept','application/json');
		return this.http.get(`${environment.baseUrl}/shippings/deliveryuserid/${deliveryUserId}`,{ headers: headersToSend }).pipe(
			map((data: any) => {
				return data;
			})
		);
		
	}

	getById(Id:any): Observable<any> {
		let headersToSend = new HttpHeaders();
		headersToSend = headersToSend
			.set('x-access-token', localStorage.getItem('myToken')!)
			.set('Accept','application/json');
		return this.http.get(`${environment.baseUrl}/shippings/${Id}`,{ headers: headersToSend }).pipe(
			map((data: any) => {
				return data;
			})
		);
		
	}

	getByStatusId(Id:any): Observable<any> {
		let headersToSend = new HttpHeaders();
		headersToSend = headersToSend
			.set('x-access-token', localStorage.getItem('myToken')!)
			.set('Accept','application/json');
		return this.http.get(`${environment.baseUrl}/shippings/status/${Id}`,{ headers: headersToSend }).pipe(
			map((data: any) => {
				return data;
			})
		);
		
	}

	


}
