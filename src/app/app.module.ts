import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { RouterModule, Routes, CanActivate } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';

import { LoginComponent } from './pages/login/login.component';

import { AuthenticateComponent } from './pages/login/authenticate/authenticate.component';

import { VerifyComponent } from './pages/verifyemail/verify.component';

import { CreateComponent } from './pages/create/create.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AdminComponent } from './pages/admin/admin.component';

import { ShopComponent } from './pages/shop/shop.component';

import { WatchComponent } from './pages/bracket/watch/watch.component';
import { ModComponent } from './pages/bracket/moderate/moderate.component';
import { BracketComponent } from './pages/bracket/bracket/bracket.component';
import { OverlayComponent } from './pages/bracket/overlay/overlay.component';
import { OverlayBracketComponent } from './pages/bracket/overlay-bracket/bracket.component';

import { LbWatchComponent } from './pages/leaderboard/watch/lbwatch.component';

import { BracketService } from './pages/bracket/bracket.service';

import { NavComponent } from './modules/navbar/nav.component';
import { NewNavComponent } from './modules/navbar-new/newnav.component';

import { FooterComponent } from './modules/footer/footer.component';
import { ModalComponent } from './modules/modal/modal.component';
import { PreloadComponent } from './modules/preload/preload.component';

import { AuthGuardService } from './auth/auth-guard.service';
import { AdminGuardService } from './auth/admin-guard.service';

import { ProfileService } from './auth/profile-guard.service';
import { BracketGuardService } from './auth/bracket-guard.service';
import { OverlayGuardService } from './auth/overlay-guard.service';
import { BracketModGuardService } from './auth/bracket-mod-guard.service';
import { SafeHtmlPipe } from './auth/sanitize';

import { HttpClientModule } from '@angular/common/http';

import { AdsenseModule } from 'ng2-adsense';

const routes: Routes = [
  
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'login/authenticate',
    component: AuthenticateComponent
  },
  {
    path: 'verifyemail',
    component: VerifyComponent
  },
  {
    path: 'create',
    component: CreateComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'shop',
    component: ShopComponent
  },
  {
    path: 'overlay/:id',
    component: OverlayComponent,
    canActivate: [OverlayGuardService]
  },
  {
    path: 'watch/:id',
    component: WatchComponent,
    canActivate: [BracketGuardService]
  },
  {
    path: 'moderate/:id',
    component: ModComponent,
    canActivate: [BracketModGuardService, AuthGuardService]
  },
  {
    path: 'leaderboard/:id',
    component: LbWatchComponent
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [ProfileService]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminGuardService]
  }
];

RouterModule.forRoot(routes, {useHash: false});


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavComponent,
    NewNavComponent,
    FooterComponent,
    LoginComponent,
    VerifyComponent,
    CreateComponent,
    WatchComponent,
    OverlayComponent,
    ModComponent,
    ProfileComponent,
    ModalComponent,
    PreloadComponent,
    BracketComponent,
    AdminComponent,
    OverlayBracketComponent,
    ShopComponent,
    SafeHtmlPipe,
    LbWatchComponent,
    AuthenticateComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    AdsenseModule.forRoot({
      adClient: 'ca-pub-4499070912220787',
      adSlot: 5110340545,
      adtest: "true",
    }),
  ],
  exports: [
    RouterModule
  ],
  providers: [
    NavComponent, 
    AuthGuardService, 
    AdminGuardService,
    ProfileService,
    BracketGuardService, 
    BracketModGuardService, 
    OverlayGuardService,
    BracketComponent, 
    BracketService],    
  bootstrap: [AppComponent]
})
export class AppModule { }
