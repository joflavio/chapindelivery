import { Component, OnInit,  ElementRef, ViewChild   } from '@angular/core';
//import { IonicSlides  } from '@ionic/angular';
import { INTRO_KEY } from 'src/app/guards/intro.guard';
import { Router } from '@angular/router';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {
  @ViewChild('swiper')
  swiperRef: ElementRef | undefined;
  
  constructor(private router: Router) {}

  ngOnInit() {
  }

	next() {
		this.swiperRef?.nativeElement.swiper.slideNext();
	}

	async start() {
		localStorage.setItem(INTRO_KEY, 'true');
		this.router.navigateByUrl('/login', { replaceUrl: true });
	}

}
