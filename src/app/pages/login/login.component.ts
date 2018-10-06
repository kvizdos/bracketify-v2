import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { config } from "../../../assets/config.js"
import { JsonPipe } from '@angular/common';

import * as CookieMonster from "../../../assets/cookiemonster";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  title = 'Bracketify Login';

  authRedirect = window.location.href != "bracketify.com" ? "http%3A%2F%2Flocalhost%3A4200%2Flogin%2Fauthenticate" : "https%3A%2F%2Fbracketify.com%2Flogin%2Fauthenticate"
  discordURL = `https://discordapp.com/api/oauth2/authorize?client_id=498158321715380234&redirect_uri=${this.authRedirect}&response_type=code&scope=identify%20email`

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    if(CookieMonster.getCookie('act') !== undefined) {
      window.location.href = "/profile";
    }
  }

}
