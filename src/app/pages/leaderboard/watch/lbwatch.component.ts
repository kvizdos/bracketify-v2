import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { config } from "../../../../assets/config.js"
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'lbwatch',
  templateUrl: './lbwatch.component.html',
  styleUrls: ['./lbwatch.component.css']
})
export class LbWatchComponent {
  title = 'Bracketify Leaderboard';

  id;

  name = "Lasers! Leaderboard";
  description = "This is a leaderboard for the mobile app 'Lasers!'";

  game = "Loading..";
  gameLink = "Loading..";
  gameWording = "Loading.."; // Play || Check out 

  allFields = [];

  allPlayers = [];

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

  async makePost(value: object, params: String) {
    var dat;
    var url = config.urls.current + "/v1/lb/"
    let ret = await this.http.post(url + params, 
      {
        lbid: this.id
      }
      ).toPromise();
    return ret
  }

  async makeGet(params: String) {
    var dat;
    var url = config.urls.current + "/v1/lb/"
    let ret = await this.http.get(url + params).toPromise();
    return ret
  }



  private getUrlParameter(sParam) {
    return decodeURIComponent(window.location.search.substring(1)).split('&')
     .map((v) => { return v.split("=") })
     .filter((v) => { return (v[0] === sParam) ? true : false })[0]
  };

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    let yote = this.route.params.subscribe(paramsId => {
      this.id = paramsId.id;
    });

    this.makeGet("get/" + this.id).then((response) => {
      if(response['code'] !== undefined) {
        
      } else {
        console.log("NOT FOUND!");
        //window.location.href = "/home";
      }
    });
  }

}
