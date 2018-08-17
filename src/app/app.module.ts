import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { RouterModule, Routes, CanActivate } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';

import { LoginComponent } from './pages/login/login.component';
import { VerifyComponent } from './pages/verifyemail/verify.component';

import { CreateComponent } from './pages/create/create.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ShopComponent } from './pages/shop/shop.component';

import { WatchComponent } from './pages/bracket/watch/watch.component';
import { ModComponent } from './pages/bracket/moderate/moderate.component';
import { BracketComponent } from './pages/bracket/bracket/bracket.component';
import { OverlayComponent } from './pages/bracket/overlay/overlay.component';
import { OverlayBracketComponent } from './pages/bracket/overlay-bracket/bracket.component';

import { BracketService } from './pages/bracket/bracket.service';

import { NavComponent } from './modules/navbar/nav.component';
import { FooterComponent } from './modules/footer/footer.component';
import { ModalComponent } from './modules/modal/modal.component';
import { PreloadComponent } from './modules/preload/preload.component';

import { AuthGuardService } from './auth/auth-guard.service';
import { BracketGuardService } from './auth/bracket-guard.service';
import { OverlayGuardService } from './auth/overlay-guard.service';
import { BracketModGuardService } from './auth/bracket-mod-guard.service';
import { SafeHtmlPipe } from './auth/sanitize';

import { HttpClientModule } from '@angular/common/http';

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
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavComponent,
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
    OverlayBracketComponent,
    ShopComponent,
    SafeHtmlPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    NavComponent, 
    AuthGuardService, 
    BracketGuardService, 
    BracketModGuardService, 
    OverlayGuardService,
    BracketComponent, 
    BracketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
