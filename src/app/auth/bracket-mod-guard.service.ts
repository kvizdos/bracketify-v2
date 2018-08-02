import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { config } from "../../assets/config.js"
import { ActivatedRoute, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

@Injectable()
export class BracketModGuardService implements CanActivate {
  async verifyBracket(value: string) {
    var dat;
    var url = "http://" + config.urls.current + "/bracketinfo"
    let ret = await this.http.get(url + "/?id=" + value).toPromise();
    return ret
  }

  async verifyToken(value: object) {
    var dat;
    var url = "http://" + config.urls.current + "/gettoken"
    let ret = await this.http.get(url + "/?id=" + value['id'] + "&user=" + value['user'] + "&session=" + localStorage.getItem("sessionid")).toPromise();
    return ret
  }

  constructor(public router: Router, private http: HttpClient, private route: ActivatedRoute) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let self = this;

        let id = state.url.split("/")[2];
        let choice = this.verifyBracket(id).then((response) => {
            if(response['status'] !== "complete") {  
                window.location.href = "/home";
                return false
            } else {
              if(response['info']['owner'] == localStorage.getItem('username')) response['info']['admins'].push(localStorage.getItem('username'));

              if(response['info']['admins'].indexOf(localStorage.getItem('username')) == -1) {
                alert("You aren't an admin! Going to the watch page..");
                window.location.href = "/watch/" + id;
                return false;
              } else {
                let verify = this.verifyToken({id: id, user: localStorage.getItem("username"), sessionid: localStorage.getItem("sessionid")}).then((response) => {
                  if(response['retStatus'] == "complete") {
                    localStorage.setItem("modid", response['token']);
                    return true;
                  } else {
                    switch(response['retStatus']) {
                      case "invalidUser":
                        localStorage.clear();
                        window.location.href = "/watch/" + id;
                        break;
                      case "invalidSession":
                        localStorage.clear();
                        window.location.href = "/watch/" + id;
                        break;
                      case "invalidBracket":
                        window.location.href = "/home"
                        break;
                    }
                    return false;

                  }
                 });
              }
              
            }
        });

    
    return true;
    /*if (!this.auth.isAuthenticated()) {
      this.router.navigate(['login']);
      return false;
    }
    return true;*/

  }
}