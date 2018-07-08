import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { config } from "../../../assets/config.js"
import { JsonPipe } from '@angular/common';

import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  title = 'Bracketify Profile';

  name = "Loading..";
  brackets: any = [];

  status = "";
  statusMsg = "";

  gravatar: SafeUrl;

  deletingAccount = false;
  loaded = false;

  async getUserInfo(value: string) {
    var url = "http://" + config.urls.current + "/userinfo/" + "?user="+value;

    let ret = await this.http.get(url).toPromise();
    return ret;
  }

  async getBracketInfo(value: string) {
    var dat;
    var url = "http://" + config.urls.current + "/bracketinfo"
    let ret = await this.http.get(url + "/?id=" + value).toPromise();
    return ret
  }

  async fullyDeleteBracket(value: object) {
    var dat;
    var url = "http://" + config.urls.current + "/delete"
    let ret = await this.http.get(url + "/?id=" + value['id'] + "&session=" + value['sessionid'] + "&user=" + value['username']).toPromise();
    return ret
  }

  async fullyDeleteAccount(value: object) {
    var dat;
    var url = "http://" + config.urls.current + "/deleteaccount"
    let ret = await this.http.get(url + "?session=" + value['sessionid'] + "&user=" + value['user'] + "&password=" + value['password']).toPromise();
    return ret
  }

  deleteAccount() {
    this.deletingAccount = true;

    let pw = prompt("Sorry to see you go, please confirm your password:");
    console.log(pw);
    if(pw !== "") {
      let delAcc = this.fullyDeleteAccount({sessionid: localStorage.getItem('sessionid'), user: localStorage.getItem('username'), password: pw}).then((response) => {
        if(response['delStatus'] == "complete") {
          localStorage.clear();
          alert("Successfully deleted account. Sorry to see you go!");
          window.location.href = '/home';
        } else {
          switch (response['code']) {
            case "invalidPass":
              alert("Invalid password, please try again.");
              break;
            case "wrongPass":
              alert("This password is not correct, please try again");
              break;
            case "invalidSession":
              alert("Invalid session ID. Please login.")
              localStorage.clear();
              window.location.href = "/login";
              break;
            case "invalidUser":
              alert("Your username does not match the one we have on file. Please relogin and try again.");
              localStorage.clear();
              window.location.href = "/login";
              break;
            case "somethingWrong":
              alert("Something went wrong. Please relogin and try again.");
              localStorage.clear();
              window.location.href = "/login";
          }
          this.deletingAccount = false;

        }
      });
    } else {
      alert("Invalid password, please try again.");
      this.deletingAccount = false;
    }
  }

  deleteBracket(value: object) {
    for(let i = 0; i < this.brackets.length; i++) {
      if(this.brackets[i]['id'] == value) {
        console.log("Got here!");
        this.brackets.splice(i,1);
        if(this.brackets.length == 0) {
          this.brackets.push({name: "No brackets! Please make one!", description: "Click the '+' to make a bracket!", link: "#", id: "#"})
        }
        
        let del = this.fullyDeleteBracket({id: value, sessionid: localStorage.getItem('sessionid'), username: localStorage.getItem('username')}).then((response) => {
          console.log(response['delStatus'] + " - " + response['code']);
          if(response['delStatus'] !== "complete") {
            this.status = "fail";
            this.statusMsg = "Something went wrong. This tends to happen if your session token is invalid/old. Please reload your page.";
          } else {
            this.status = "success";
            this.statusMsg = "Successfully deleted " + value;
          }
        });
      }
    }
  }
 
  constructor(private http: HttpClient, private route: ActivatedRoute, private sanitizer: DomSanitizer) {
    this.name = localStorage.getItem("username");
    let ids = [];
    let bracketsearch = this.getUserInfo(this.name).then((response) => {
      ids = response['brackets']

      console.log("Hash: " + response["emailhash"]);

      this.gravatar = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.gravatar.com/avatar/" + response['emailhash'] + "?d=identicon");
      console.log(response['emailhash']);
      console.log(ids);  
      let i;
      
        if(ids !== undefined && ids.length !== 0) {
          for (i = 0; i < ids.length; i++) {
            console.log(ids[i]);
            let cId = ids[i];
            let tbrackets = this.getBracketInfo(ids[i]).then((response) => {
              console.log(response);
              this.brackets.push({name: response['info']['name'], description: response['info']['description'], link: "/moderate/" + cId, id: cId});
              console.log(this.brackets);
              this.loaded = true;
            });
          };
        } else {
          this.brackets.push({name: "No brackets! Please make one!", description: "Click the '+' to make a bracket!", link: "#", id: "#"})
          this.loaded = true;
        }
      
    });
  }

}
