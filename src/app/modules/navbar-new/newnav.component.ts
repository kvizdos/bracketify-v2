import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { config } from "../../../assets/config.js"
@Component({
  selector: 'new-navbar',
  templateUrl: './newnav.component.html',
  styleUrls: ['./newnav.component.css']
})
export class NewNavComponent {
  version = config.version;

  verified = false;
  username;
  coins;

  show = false;

  async verifySession() {
    var dat;
    var url = config.urls.current + "/verifysession"
    let ret = await this.http.get(url + "/?sessionid=" + localStorage.getItem("sessionid") + "&user=" + localStorage.getItem("username")).toPromise();
    return ret
  }

  constructor(private http: HttpClient) {
    //if(window.location.pathname == "/home") this.show = true;
    if(localStorage.getItem("sessionid") !== null) {
      this.verified = true;
      this.username = localStorage.getItem('username').toUpperCase();
      this.coins = localStorage.getItem('coins').toUpperCase();
      let verify = this.verifySession().then((response) => {
        if(response['verified'] == "false") {
          localStorage.clear();
          window.location.href = "/login";
          this.verified = false;
        } else if(response['verified'] == "true") {
          this.verified = true;
          this.username = localStorage.getItem('username').toUpperCase();
          this.coins = response['coins'].toString();
          localStorage.setItem('coins', this.coins.toString());
        }
      });
    }

  } 

}
