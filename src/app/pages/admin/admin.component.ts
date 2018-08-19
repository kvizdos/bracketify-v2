import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { config } from "../../../assets/config.js"
import { JsonPipe } from '@angular/common';

import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  title = 'Bracketify Admin';

  users: {};
  userTotal: any;
  foundTotal: any;

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

  async getAdminInfo(data: object) {
    let id;
    let tempid = this.route.params.subscribe(paramsId => {
      id = paramsId.id;
    });

    var url = config.urls.current + "/admin"
    let ret = await this.http.get(`${url}?user=${localStorage.getItem('username')}&session=${localStorage.getItem('sessionid')}&action=${data['action']}&max=${data['max']}`).toPromise();
    return ret
  }

  constructor(private http: HttpClient, private route: ActivatedRoute, private sanitizer: DomSanitizer) {
    let getInfo = this.getAdminInfo({action: "users", max: 100}).then((response) => {
      this.userTotal = "100";
      this.foundTotal = Object.keys(response).length;
      for(let key in response) {
        if(response[key]['verified'] == null) response[key]['verified'] = "false";
        if(response[key]['lastlogin'] == null) response[key]['lastlogin'] = "Never";
        if(response[key]['brackets'] == undefined) response[key]['brackets'] = [];

        if(response[key]['membership'] == undefined) {
        } else {
          switch (response[key]['membership']) {
            case 0:
              response[key]['membership'] = "Free";
              break;
            case 1:
              response[key]['membership'] = "Supporter";
              break;
            case 2:
              response[key]['membership'] = "Exclusive Partner";
              break;
            case 4:
              response[key]['membership'] = "Admin";
              break;
          }
        }
      }

      this.users = response;

      
    });
  }

}
