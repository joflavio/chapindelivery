import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { AuthenticationService } from './../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AutoLoginGuard implements CanLoad {
  constructor(
	private authService: AuthenticationService, 
	private router: Router
	) {}

	async canLoad(): Promise<boolean> {
		if (this.authService.isLoggedIn()){

			this.router.navigateByUrl('/tabs');
			return false;
		}
		return true;	
	}

}
