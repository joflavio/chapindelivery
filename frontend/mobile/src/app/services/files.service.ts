import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FilesService {
	constructor(private http: HttpClient) {}

	uploadUserImage(imageData:any, email:any, fileName:any): Observable<any> {
		let headersToSend = new HttpHeaders();
		headersToSend = headersToSend
			.set('x-access-token', localStorage.getItem('myToken')!)
			.set('Accept','application/json');
      const formData = new FormData();
      formData.append('file', imageData);
      formData.append('email', email);
      formData.append('filetypeid', '1');
	  formData.append('filename', fileName);
      return this.http.post(`${environment.baseUrl}/images/users`, formData, { headers: headersToSend }).pipe(
        map((data: any) => {
          return data;
        })
      );
	}

	uploadImage(imageData:any, filetypeid:any): Observable<any>{
		let headersToSend = new HttpHeaders();
		headersToSend = headersToSend
			.set('x-access-token', localStorage.getItem('myToken')!)
			.set('Accept','application/json');
      const formData = new FormData();
      formData.append('file', imageData);
      formData.append('filetypeid', filetypeid);
      return this.http.post(`${environment.baseUrl}/images/upload`, formData, { headers: headersToSend }).pipe(
        map((data: any) => {
          return data;
        })
      );	
	}

	getImageName(imageId:String): Observable<any>
	{
		let headersToSend = new HttpHeaders();
		headersToSend = headersToSend
			.set('x-access-token', localStorage.getItem('myToken')!)
			.set('Accept','application/json');
		return this.http.get(`${environment.baseUrl}/images/name/${imageId}`, { headers: headersToSend } ).pipe(
			map((data: any) => {
				return data;
			})
		);
	}

  	getImage(imageId:String): Observable<any>
	{
		let headersToSend = new HttpHeaders();
		headersToSend = headersToSend
			.set('x-access-token', localStorage.getItem('myToken')!)
			.set('Accept','application/json');
		return this.http.get(`${environment.baseUrl}/images/download/${imageId}`, { headers: headersToSend, responseType: 'blob' }, /*).pipe(
			map((data: any) => {
				return data;
			})*/
		);
	}
}
