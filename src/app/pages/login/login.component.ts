import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

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

  callback;

  registerClicked;
  registered;
  hideRegistering;

  loginClicked;
  loggedIn;
  hideLoggingIn;

  emailError = false;
  usernameError = false;
  passwordError = false;
  passwordConfirmError = false;

  mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  modalType = "";
  modalHeader = "";
  modalContent = "";
  showModal = false;
  showPaymentModal = false;
  modal(type: any, header: any, content: any) {
    this.modalType = type;
    this.modalHeader = header;
    this.modalContent = content;
    this.showModal = true;  
  }

  async registerNewUser(value: object) {
    var dat;
    var url = config.urls.current + "/register"
    let ret = await this.http.get(url + "/?username=" + value['username'] + "&password=" + value['password'] + "&email=" + value['email']).toPromise();
    return ret
  }

  async loginNewUser(value: object) {
    var url = config.urls.current + "/login/" + "?username="+value['username']+"&password="+value['password'];

    let ret = await this.http.get(url).toPromise();
    return ret;
  }

  loginUser(value: object) {
    //value = JSON.parse(value);
    this.loginClicked = true;
    let ret = this.loginNewUser(value).then((response) => {
      if(response['loginStatus'] == "complete") {
        if(value['nosuccess'] == undefined || value['nosuccess'] == false) {
          this.modal('norm', "Successfully logged in!", "You will be redirected to your profile momentarily..");

          this.loggedIn = true;
        }
        this.hideLoggingIn = true;
        localStorage.setItem("username", value['username']);

        localStorage.setItem("sessionid", response['sessionid']);
        localStorage.setItem("coins", response['coins']);

        if(this.callback !== undefined) {
          window.location.href = "/" + this.callback;
        } else {
          window.location.href = "/profile";

        }
      } else {
        //this.status = "fail";
        this.loginClicked = false;
        switch(response['code']) {
          case "invalidUsername":
            this.modal('error', "Invalid username", "We couldn't find that username/email in our database.");
            break;
          case "invalidPass":
            this.modal('error', "Invalid password", "That password does not match the password in our database");
            break;
          case "invalidInputs":
            this.modal('error', "Invalid inputs", "Please fill in all inputs");
            break;
        }
      }
    });

  }

  registerUser(value: object) {
    this.registerClicked = true;
    console.log(value['username'] + " - " + value['password']);
    if(value['confPassword'] == value['password']) {
      let ret = this.registerNewUser(value).then((response) => {
          console.log(response['registerStatus']);
          if(response['registerStatus'] == "complete") {
            this.modal('norm', "Successfully registered!", "You will be redirected to your profile momentarily..");
            this.loginUser({username:value['username'],password:value['password'], nosuccess: true});
            this.hideRegistering = true;
            localStorage.setItem('coins', "10");
          } else {
            switch(response['code']) {
              case "emailTaken":
                this.modal('error', "Email taken!", "That email is taken, please try again.");
                break;
              case "usernameTaken":
                this.modal('error', "Username taken!", "That username is taken, please try again.");
                break;
              case "invalidEmail":
                this.modal('error', "Invalid email!", "That email is invalid. Please try again. (Currently does not work with emails that look like: <email>+<something>@<site>.<extension>, please only use <email>@<site>.<extension>)");
                break;
            }
            this.registerClicked = false;
          }
        }
        
      );
    } else {
      console.log("Passwords dont match");
      this.modal('error', "Password error!", "The passwords do not match. Please try again.");
      this.registerClicked = false;
    }



  }

  private getUrlParameter(sParam) {
    return decodeURIComponent(window.location.search.substring(1)).split('&')
     .map((v) => { return v.split("=") })
     .filter((v) => { return (v[0] === sParam) ? true : false })[0]
  };

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    if(this.getUrlParameter('callback') !== undefined && this.getUrlParameter('callback')[0] === 'callback') {
      this.callback = this.getUrlParameter('callback')[1]
      console.log(this.callback);
    }

    if((localStorage.getItem('username') && localStorage.getItem('password')) !== null) {
      this.loginUser({username:localStorage.getItem("username"),password:localStorage.getItem("password"),remember:true})
    }
  }

}
