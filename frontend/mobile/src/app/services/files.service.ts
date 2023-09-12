import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FilesService {
	token:any;

	constructor(private http: HttpClient) {
		this.loadToken();
	}

	loadToken(){	
		const token = localStorage.getItem('myToken');
		if (token)
			this.token=token;
	}

	uploadImage(imageData:any, email:any, filetypeid:any): Observable<any> {
		let headersToSend = new HttpHeaders();
		headersToSend = headersToSend
			.set('x-access-token', this.token)
			.set('Accept','application/json');
      const formData = new FormData();
      formData.append('file', imageData);
      formData.append('email', email);
      formData.append('filetypeid', filetypeid);
      return this.http.post(`${environment.baseUrl}/images/users`, formData, { headers: headersToSend }).pipe(
        map((data: any) => {
          return data;
        })
      );
		
	}

  	getImage(imageId:String): Observable<any>
	{
		let headersToSend = new HttpHeaders();
		headersToSend = headersToSend
			.set('x-access-token', this.token)
			.set('Accept','application/json');
		return this.http.get(`${environment.baseUrl}/images/download/${imageId}`, { headers: headersToSend, responseType: 'blob' }, /*).pipe(
			map((data: any) => {
				return data;
			})*/
		);
	}
}
