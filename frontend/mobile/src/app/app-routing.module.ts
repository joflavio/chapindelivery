import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { IntroGuard } from './guards/intro.guard';
import { AutoLoginGuard } from './guards/auto-login.guard';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
	{
		path: 'login',
		loadChildren: () => import('./pages/login/login.module').then((m) => m.LoginPageModule),
		canLoad: [IntroGuard, AutoLoginGuard] 
		//canLoad: [IntroGuard] 
	},
	{
		path: 'intro',
		loadChildren: () => import('./pages/intro/intro.module').then((m) => m.IntroPageModule)
	},
	{
		path: 'tabs',
		loadChildren: () => import('./tabs/tabs.module').then((m) => m.TabsPageModule),
		canLoad: [AuthGuard] 
	},
	{
		path: '',
		redirectTo: '/login',
		pathMatch: 'full'
	},
	{
		path: 'signin',
		loadChildren: () => import('./pages/signin/signin.module').then( m => m.SigninPageModule)
	}
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
