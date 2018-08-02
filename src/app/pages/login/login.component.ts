import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { config } from "../../../assets/config.js"
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  title = 'Bracketify Login';

  status;
  statusMsg;

  registerClicked;
  registered;
  hideRegistering;

  loginClicked;
  loggedIn;
  hideLoggingIn;

  mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  async registerNewUser(value: object) {
    var dat;
    var url = "http://" + config.urls.current + "/register"
    let ret = await this.http.get(url + "/?username=" + value['username'] + "&password=" + value['password'] + "&email=" + value['email']).toPromise();
    return ret
  }

  async loginNewUser(value: object) {
    var url = "http://" + config.urls.current + "/login/" + "?username="+value['username']+"&password="+value['password'];

    let ret = await this.http.get(url).toPromise();
    return ret;
  }

  loginUser(value: object) {
    //value = JSON.parse(value);
    this.loginClicked = true;
    let ret = this.loginNewUser(value).then((response) => {
      console.log(response);
      if(response['loginStatus'] == "complete") {
        this.status = "done";
        this.statusMsg = "Logged in successfully.. redirecting";
        this.loggedIn = true;
        this.hideLoggingIn = true;
        localStorage.setItem("username", value['username']);

        localStorage.setItem("sessionid", response['sessionid']);
        window.location.href = "/profile";
      } else {
        this.status = "fail";
        this.loginClicked = false;
        switch(response['code']) {
          case "invalidUsername":
            this.statusMsg = "Invalid username / email";
            break;
          case "invalidPass":
            this.statusMsg = "Invalid password";
            break;
          case "invalidInputs":
            this.statusMsg = "Invalid inputs";
            break;
        }
      }
    });

  }

  registerUser(value: object) {
    this.registerClicked = true;
    let ret = this.registerNewUser(value).then((response) => {
        console.log(response['registerStatus']);
        if(response['registerStatus'] == "complete") {
          this.status = "done";
          this.statusMsg = "Successfully Registered! Please log in."
          this.registered = true;
          this.hideRegistering = true;
          localStorage.setItem('coins', "10");
        } else {
          switch(response['code']) {
            case "emailTaken":
              this.status = "fail";
              this.statusMsg = "That email is already being used."
              break;
            case "usernameTaken":
              this.status = "fail";
              this.statusMsg = "That username is taken";
              break;
            case "invalidEmail":
              this.status = "fail";
              this.statusMsg = "That email is not valid"
              break;
          }
          this.registerClicked = false;
        }
      }
      
    );




  }

  constructor(private http: HttpClient) {
    if((localStorage.getItem('username') && localStorage.getItem('password')) !== null) {
      this.loginUser({username:localStorage.getItem("username"),password:localStorage.getItem("password"),remember:true})
    }
  }

}
