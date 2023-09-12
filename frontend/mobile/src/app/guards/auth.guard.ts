import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

import { AuthenticationService } from './../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor(private authService: AuthenticationService, private router: Router) {}

	canLoad(): boolean {
		if (!this.authService.isLoggedIn()){
			this.router.navigateByUrl('login');
			return false;
		}
		return true;		
	}
}
