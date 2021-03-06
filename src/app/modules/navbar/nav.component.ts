import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { config } from "../../../assets/config.js"
@Component({
  selector: 'navbar',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  version = config.version;

  verified = false;
  username;
  normUsername;
  coins;

  show = true;

  async verifySession() {
    var dat;
    var url = config.urls.current + "/verifysession"
    let ret = await this.http.get(url + "/?sessionid=" + localStorage.getItem("sessionid") + "&user=" + localStorage.getItem("username")).toPromise();
    return ret
  }

  logout() {
    localStorage.removeItem('sessionid');
    localStorage.removeItem('username');
    localStorage.removeItem('usercache');
    localStorage.removeItem('coins');
    if(localStorage.getItem('modid') !== null) localStorage.removeItem('modid');
    window.location.href = "/home";
  }

  constructor(private http: HttpClient) {

    //if(window.location.pathname == "/home") this.show = false;

    if(localStorage.getItem("sessionid") !== null) {
      this.verified = true;
      this.username = localStorage.getItem('username').toUpperCase();
      this.normUsername = localStorage.getItem('username');
    

      this.coins = localStorage.getItem('coins').toUpperCase();
      let verify = this.verifySession().then((response) => {
        if(response['verified'] == "false") {
          localStorage.clear();
          window.location.href = "/login";
          this.verified = false;
        } else if(response['verified'] == "true") {
          this.verified = true;
          this.username = localStorage.getItem('username').toUpperCase();
          this.normUsername = localStorage.getItem('username');
          this.coins = response['coins'].toString();
          localStorage.setItem('coins', this.coins.toString());
        }
      });
    }

  } 

}
