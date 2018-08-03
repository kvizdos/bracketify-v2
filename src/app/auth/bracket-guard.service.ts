import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { config } from "../../assets/config.js"
import { ActivatedRoute, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

@Injectable()
export class BracketGuardService implements CanActivate {
  async verifyBracket(value: string) {
    var dat;
    var url = config.urls.current + "/bracketinfo"
    let ret = await this.http.get(url + "/?id=" + value).toPromise();
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

              console.log(response['info']['admins'].indexOf(localStorage.getItem('username')));

              console.log(response);

              if(response['info']['admins'].indexOf(localStorage.getItem('username')) == -1 && response['info']['public'] == false) {
                window.location.href = "/home";
                return false;
              }
              if(response['info']['admins'].indexOf(localStorage.getItem('username')) == 0) {
                window.location.href = "/moderate/" + id;
                return false;
              }
              return true;
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