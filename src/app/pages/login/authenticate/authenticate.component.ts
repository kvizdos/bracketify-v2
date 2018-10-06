import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Router, ActivatedRoute, Params} from '@angular/router';

import { config } from "../../../../assets/config.js"
import { JsonPipe } from '@angular/common';
import * as CookieMonster from '../../../../assets/cookiemonster';

@Component({
  selector: 'authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.css']
})
export class AuthenticateComponent {
  title = 'Bracketify Authentication';
  authCode = "";

  testing = window.location.port == "4200" ? "true" : "false";

  async getAccessToken(code: String) {
    var dat;
    var url = config.urls.aws + "auth"
    let ret = await this.http.get(url + "?code=" + code + "&testing=" + this.testing).toPromise();
    return ret
  }

  constructor(private activatedRoute: ActivatedRoute, private http: HttpClient) {
    if(CookieMonster.getCookie("act") == undefined) {
      this.activatedRoute.queryParams.subscribe((params: Params) => {
        this.authCode = params['code'];
        if(this.authCode !== undefined) {
          let accessToken = this.getAccessToken(this.authCode).then((response) => {
            if(response['auth_token'] !== undefined) {
              
              CookieMonster.setCookie("act", response['auth_token'], "never", "/");
              CookieMonster.setCookie("id", response['id'], "never", "/");
              CookieMonster.setCookie("discriminator", response['discriminator'], "never", "/");
              CookieMonster.setCookie("username", response['username'], "never", "/");
              CookieMonster.setCookie("avatar", response['avatar'], "never", "/");

              window.location.href = "/profile"
            } else {
              window.location.href = "/login"
            }
          })
        } else {
          window.location.href = "/home";
        }
      });
    } else {
      window.location.href = "/profile"
    }
  
  }
}
