import { Injectable } from '@angular/core';
import { CanLoad, Router  } from '@angular/router';


export const INTRO_KEY = 'intro-seen';

@Injectable({
  providedIn: 'root'
})
export class IntroGuard implements CanLoad {
  constructor(private router: Router) { }
  async canLoad(): Promise<boolean> {
    const hasSeenIntro = localStorage.getItem(INTRO_KEY);
    if (hasSeenIntro && (hasSeenIntro === 'true')) {
      return true;
    } else {
      this.router.navigateByUrl('/intro', { replaceUrl:true });
      return false;
    }
  }
}
