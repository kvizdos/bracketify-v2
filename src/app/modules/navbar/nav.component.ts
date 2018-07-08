import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { config } from "../../../assets/config.js"
@Component({
  selector: 'navbar',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {

  verified;
  username;
  coins;

  async verifySession() {
    var dat;
    var url = "http://" + config.urls.current + "/verifysession"
    let ret = await this.http.get(url + "/?sessionid=" + localStorage.getItem("sessionid") + "&user=" + localStorage.getItem("username")).toPromise();
    return ret
  }

  constructor(private http: HttpClient) {
    if(localStorage.getItem("sessionid") !== null) {
      this.verified = true;
      this.username = localStorage.getItem('username').toUpperCase();
      this.coins = "X";
      let verify = this.verifySession().then((response) => {
        console.log(response['verified']);

        if(response['verified'] == "false") {
          console.log(response['verified']);
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
