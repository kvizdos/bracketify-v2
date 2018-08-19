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

  users: any[];

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

  async getAdminInfo(data: object, type: string) {
    let id;
    let tempid = this.route.params.subscribe(paramsId => {
      id = paramsId.id;
    });

    var url = config.urls.current + "/updatebracket"
    let ret = await this.http.get(url + "/?id=" + id + "&data=" + JSON.stringify(data) + "&type=" + type + "&modid=" + localStorage.getItem("modid") + "&user=" + localStorage.getItem("username")).toPromise();
    return ret
  }

  constructor(private http: HttpClient, private route: ActivatedRoute, private sanitizer: DomSanitizer) {
    
  }

}
