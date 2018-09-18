import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { config } from "../../../assets/config.js"
import { JsonPipe } from '@angular/common';

import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  title = 'Bracketify Profile';

  name = "Loading..";
  isPersonal = false;
  brackets: any = [];

  status = "";
  statusMsg = "";

  changingDescription = false;

  gravatar: SafeUrl;
  lazyGrav: any;

  deletingAccount = false;
  loaded = false;

  description: string = localStorage.getItem('description') !== null ? localStorage.getItem('description') : "Click to change me!";
  descChange = false;

  

  modalType = "";
  modalHeader = "";
  modalContent = "";
  showModal = false;
  modal(type: any, header: any, content: any) {
    this.modalType = type;
    this.modalHeader = header;
    this.modalContent = content;
    this.showModal = true;  
  }

  // DEVELOPER STUFF
  developerKeys;
  hasKeys = false;
  devRemoveThinking = false;

  async getKeys() {
    var url = config.urls.current + "/v1/auth/keys/" + localStorage.getItem("username");

    let ret = await this.http.get(url, { headers: { Authorization: JSON.stringify({origin: window.location.origin, session: localStorage.getItem('sessionid')}) }}).toPromise();
    return ret;
  }

  async removeClaimedKey() {
    var url = config.urls.current + "/v1/auth/unclaim/" + localStorage.getItem("username");

    let ret = await this.http.get(url, { headers: { Authorization: JSON.stringify({origin: window.location.origin, session: localStorage.getItem('sessionid')}) }}).toPromise();
    return ret;
  }

  async getClaimKey(value: Object) {
    var url = config.urls.current + "/v1/auth/claim/" + value['username'] + "?name="+value['name']+"&origin=" + value['origin'];

    let ret = await this.http.get(url, { headers: { Authorization: JSON.stringify({domain: window.location.origin}) }}).toPromise();
    return ret;
  }

  claimKey(origins: string, name: string) {
    this.devRemoveThinking = true;
    this.hasKeys = true;

    let claim = this.getClaimKey({username: localStorage.getItem("username"), name: name, origin: origins}).then((resp) => {
      if(resp['code'] == undefined) {
        localStorage.setItem("developercache", JSON.stringify({name: name, key: resp['key'], origins: origins.split(', ')}));

        this.developerKeys = {name: name, key: resp['key'], origins: origins.split(', ')};
        this.devRemoveThinking = false;

      } else {
        this.hasKeys = false;
        this.devRemoveThinking = false;
        localStorage.removeItem('developercache');
        this.modal('error', "Uh oh!", "Something went wrong. Please try again.");
      }
    })
  }

  removeKey() {
    let name = prompt("Please confirm this IRREVERSIBLE action by typing the name of the token (THIS ACTION CANNOT BE UNDONE): ");
    this.devRemoveThinking = true;
    let cur = JSON.parse(localStorage.getItem('developercache'));
    if(name == cur['name']) {
      let remove = this.removeClaimedKey().then((response) => {
        console.log(response);
        if(response['code'] == undefined) {
          localStorage.removeItem('developercache');
          this.hasKeys = false;
          this.modal("norm", "Successfully deleted.", "Your key is no longer activated, you can make a new random key at any time.");
          this.devRemoveThinking = false;

        } else {
          this.modal("error", "uh oh", "Something went wrong. Please try again");
          this.devRemoveThinking = false;
        }
      })
    } else {
      this.modal("error", "Not gonna happen!", "You've incorrectly typed the name. Please try again.");
      this.devRemoveThinking = false;

    }
  }

  showKeyInfo() {
    let keyInfo = JSON.parse(localStorage.getItem("developercache"));
    this.modal("norm", keyInfo['name'], "Key: " + keyInfo['key'] + "\n\n\nOrigins: " + keyInfo['origins'])
  }

  // END DEVELOPER STUFF


  async getUserInfo(value: string) {
    var url = config.urls.current + "/userinfo/" + "?user="+value;

    let ret = await this.http.get(url).toPromise();
    return ret;
  }

  async getBracketInfo(value: string) {
    var dat;
    var url = config.urls.current + "/bracketinfo"
    let ret = await this.http.get(url + "/?id=" + value).toPromise();
    return ret
  }

  async fullyDeleteBracket(value: object) {
    var dat;
    var url = config.urls.current + "/delete"
    let ret = await this.http.get(url + "/?id=" + value['id'] + "&session=" + value['sessionid'] + "&user=" + value['username']).toPromise();
    return ret
  }

  async fullyDeleteAccount(value: object) {
    var dat;
    var url = config.urls.current + "/deleteaccount"
    let ret = await this.http.get(url + "?session=" + value['sessionid'] + "&user=" + value['user'] + "&password=" + value['password']).toPromise();
    return ret
  }

  async fullyResetPassword(value: object) {
    var dat;
    var url = config.urls.current + "/resetpassword"
    let ret = await this.http.get(url + "?session=" + value['sessionid'] + "&user=" + value['user'] + "&newpass=" + value['newpass'] + "&oldpass=" + value['oldpass']).toPromise();
    return ret
  }

  async setInfo(desc: String, type: String) {
    var dat;
    var url = config.urls.current + "/setinfo"
    let ret = await this.http.get(url + "?session=" + localStorage.getItem('sessionid') + "&user=" + localStorage.getItem('username') + "&new=" + desc + "&type=" + type).toPromise();
    return ret
  }

  changeDescription(desc: string) {
    let currDesc = this.description;
    this.descChange = true;
    let newDesc = desc;

    if(newDesc !== null) {
      if(currDesc !== newDesc) {
        let desc = this.setInfo(newDesc, "description").then((response) => {
          if(response['status'] == "complete") {
            this.modal("norm", "Success!", "You've officially changed your description.");
            localStorage.setItem('description', newDesc);
            this.description = newDesc;
            this.descChange = false;
            this.changingDescription = false;
          }
        })
      } else {
        this.modal("error", "Theres a problem!", "That is already your description");
        this.descChange = false;
      }
    }

  }

  resetPassword() {
    let confPassword = prompt("Please enter your current password:");
    if(confPassword !== undefined) {
      let newPassword = prompt("What would you like your new password to be?");
      if(newPassword !== undefined) {
        
        let reset = this.fullyResetPassword({
            sessionid: localStorage.getItem('sessionid'), 
            user: localStorage.getItem('username'), 
            oldpass: confPassword, 
            newpass: newPassword
            }).then((response) => {
              console.log(response);
              if(response['status'] == "complete") {
                this.modal("norm", "Password changed!", "Your password has been changed.");
              } else {
                switch(response['code']) {
                  case "wrongPass":
                    this.modal("error", "Incorrect password!", "The initial password you entered is incorrect. Please try again.");
                    break;
                }
              }
            });

      }
    }
  }

  deleteAccount() {
    this.deletingAccount = true;

    let pw = prompt("Sorry to see you go, please confirm your password:");
    if(pw !== "") {
      let delAcc = this.fullyDeleteAccount({sessionid: localStorage.getItem('sessionid'), user: localStorage.getItem('username'), password: pw}).then((response) => {
        if(response['delStatus'] == "complete") {
          localStorage.clear();
          alert("Successfully deleted account. Sorry to see you go!");
          window.location.href = '/home';
        } else {
          switch (response['code']) {
            case "invalidPass":
              this.modal('error', 'Hmmm,', 'You\'ve typed an incorrect password. Please try again.')
              break;
            case "wrongPass":
              this.modal('error', 'Hmmm,', 'Password is incorrect. Please try again.')
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
      this.modal('error', 'Hmmm,','Invalid password, please try again.')
      this.deletingAccount = false;
    }
  }

  deleteBracket(value: object) {
    for(let i = 0; i < this.brackets.length; i++) {
      if(this.brackets[i]['id'] == value) {
        this.brackets.splice(i,1);
        if(this.brackets.length == 0) {
          this.brackets.push({name: "No brackets!", description: "Click to create an amazing bracket!", link: "/create", id: "#"})
        }
        
        let del = this.fullyDeleteBracket({id: value, sessionid: localStorage.getItem('sessionid'), username: localStorage.getItem('username')}).then((response) => {
          if(response['delStatus'] !== "complete") {
            this.status = "fail";
            this.statusMsg = "Something went wrong. This tends to happen if your session token is invalid/old. Please reload your page.";
          } else {
            this.status = "success";
            this.statusMsg = "Successfully deleted " + value;
            
            localStorage.setItem('usercache', JSON.stringify({
              gravatar: this.gravatar,
              brackets: this.brackets,
              lazy: this.lazyGrav
            }));
          }
        });
      }
    }
  }

  cacheUserData(cache: Boolean) {
    this.loaded = true;
    let bracketsearch = this.getUserInfo(this.name).then((response) => {
      let ids = [];

      if(response['status'] !== "fail") {
        this.description = response['description'];
        localStorage.setItem('description', this.description);
        ids = response['brackets']
        this.lazyGrav = response['lazy'];

        this.gravatar = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.gravatar.com/avatar/" + response['emailhash'] + "?d=identicon");
        let i;
          let cont = false;
          if(ids !== undefined && ids.length !== 0) {
            if(this.brackets.length !== ids.length) {
              cont = true;
            } 
            if(cont) {
              let remove = false;
              let nb = [];

              for (i = 0; i < ids.length; i++) {
                console.log(i)
                let x = i;
                let cId = ids[i];
                let tbrackets = this.getBracketInfo(ids[i]).then((response) => {
                  console.log(this.brackets[x]);
                  if(this.brackets[x] !== undefined) {
                    console.log("Overriding " + x);
                    this.brackets[x] = {name: response['info']['name'], description: response['info']['description'], link: "/moderate/" + cId, id: cId};
                  } else {
                    console.log("Pushing new " + x)
                    this.brackets.push({name: response['info']['name'], description: response['info']['description'], link: "/moderate/" + cId, id: cId})
                  }
                  this.loaded = true;
                  if(cache) {
                    console.log(this.brackets);
                    localStorage.setItem('usercache', JSON.stringify({
                      gravatar: this.gravatar,
                      brackets: this.brackets,
                      lazy: this.lazyGrav
                    }));
                    
                  }
                });
              }; 
              
            }
            
            

          } else {
            this.brackets = [];

            this.brackets.push({name: "No brackets!", description: "Click to create an amazing bracket!", link: "/create", id: "#"})
            
            this.loaded = true;
            if(cache) {
              localStorage.setItem('usercache', JSON.stringify({
                gravatar: this.gravatar,
                brackets: [{name: "No brackets!", description: "Click to create an amazing bracket!", link: "/create", id: "#"}],
                lazy: this.lazyGrav
              }));

            }
          }

        } else {
          window.location.href = "./home?error=unf";
        }
    });
  }
  
  private getUrlParameter(sParam) {
    return decodeURIComponent(window.location.search.substring(1)).split('&')
     .map((v) => { return v.split("=") })
     .filter((v) => { return (v[0] === sParam) ? true : false })[0]
  };


  constructor(private http: HttpClient, private route: ActivatedRoute, private sanitizer: DomSanitizer) {
    this.name = this.getUrlParameter('user')[1].toLowerCase();
    if(this.name == localStorage.getItem('username')) this.isPersonal = true;

    if(localStorage.getItem('usercache') !== null) {
      let cache = JSON.parse(localStorage.getItem('usercache'));
      this.gravatar = cache.lazy
      this.brackets = cache.brackets;
      this.loaded = true;
      if(this.isPersonal) {
        this.cacheUserData(true);
      } else {
        this.cacheUserData(false);
      }
    } else {
      if(this.isPersonal) {
        this.cacheUserData(true);
      } else {
        this.cacheUserData(false);
      }
    }

    if(localStorage.getItem("developercache") !== null) {
      let cache = JSON.parse(localStorage.getItem('developercache'));
      this.developerKeys = cache;
      this.hasKeys = true;
      console.log(this.hasKeys);
    } else {
      let waiting = this.getKeys().then((response) => {
        if(response['code'] == undefined) {
          localStorage.setItem('developercache', JSON.stringify(response));
          this.developerKeys = response;
          this.hasKeys = true;
        } else {
          if(response['code'] == "noKeys") {
            localStorage.removeItem('developercache');
            this.hasKeys = false;
          }
        }
      });
    }
    
  }

}
