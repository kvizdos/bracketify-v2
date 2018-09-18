import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { config } from "../../assets/config.js"

@Injectable()
export class ProfileService implements CanActivate {
    async verifySession() {
        var dat;
        var url = config.urls.current + "/verifysession"
        let ret = await this.http.get(url + "/?sessionid=" + localStorage.getItem("sessionid") + "&user=" + localStorage.getItem("username")).toPromise();
        return ret
      }
    
  private getUrlParameter(sParam) {
    return decodeURIComponent(window.location.search.substring(1)).split('&')
     .map((v) => { return v.split("=") })
     .filter((v) => { return (v[0] === sParam) ? true : false })[0]
  };

  isPersonal = false;

  constructor(public router: Router, private http: HttpClient) {}
  canActivate(route: ActivatedRouteSnapshot): boolean {
      if(this.getUrlParameter('user') !== undefined && this.getUrlParameter('user')[0] === 'user') {
        let user = this.getUrlParameter('user')[1].toLowerCase();
        if(user == localStorage.getItem('username')) {
          this.isPersonal = true;
        } else {
          this.isPersonal = false;
        }
      } else {
        if(localStorage.getItem("username") !== undefined) {
          window.location.href = "/profile?user=" + localStorage.getItem("username");
        } else {
          window.location.href = "/home";
        }
      }

        if((localStorage.getItem("username") && localStorage.getItem("sessionid")) !== null) {
          let choice = this.verifySession().then((response) => {
              if(response['verified'] == "false") {
                  window.location.href = "/login?callback=" + window.location.pathname.substring(1);
                return false
              } else if(response['email'] == "false") {
                window.location.href = "/verifyemail";
                return false;
              };
          });
        } else {
              window.location.href = "/login?callback=" + window.location.pathname.substring(1);
            return false;
        }
      
    
    return true;
    /*if (!this.auth.isAuthenticated()) {
      this.router.navigate(['login']);
      return false;
    }
    return true;*/

  }
}