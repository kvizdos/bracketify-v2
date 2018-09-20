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

  name = "Lasers! Leaderboard";
  description = "This is a leaderboard for the mobile app 'Lasers!'";

  game = "Lasers!";
  gameLink = "https://lasersgame.com";
  gameWording = "Play"; // Play || Check out 

  allFields = ["Pos", "Name", "Score"];

  allPlayers = [
    {pos: 1, name: 'kento', score: 1204},
    {pos: 2, name: 'Bob', score: 1100},
    {pos: 3, name: 'jake', score: 948},
    {pos: 4, name: 'james', score: 857},
    {pos: 5, name: 'leo', score: 725},
    {pos: 6, name: 'chad', score: 721},
    {pos: 7, name: 'mark', score: 638},
    {pos: 8, name: 'player', score: 581},
    {pos: 9, name: 'Idk what to name this one', score: 345},
    {pos: 10, name: 'last player', score: 121},
    {pos: 10, name: 'last player', score: 121},
    {pos: 10, name: 'last player', score: 121},
    {pos: 10, name: 'last player', score: 121},
    {pos: 10, name: 'last player', score: 121},
    {pos: 10, name: 'last player', score: 121},
    {pos: 10, name: 'last player', score: 121},
    {pos: 10, name: 'last player', score: 121},
    {pos: 10, name: 'last player', score: 121},
    {pos: 10, name: 'last player', score: 121},
    {pos: 10, name: 'last player', score: 121},
    {pos: 10, name: 'last player', score: 121},
    {pos: 10, name: 'last player', score: 121},
    {pos: 10, name: 'last player', score: 121},
    {pos: 10, name: 'last player', score: 121},
    {pos: 10, name: 'last player', score: 121},
    {pos: 10, name: 'last player', score: 121},
    {pos: 10, name: 'last player', score: 121},
    {pos: 10, name: 'last player', score: 121},
    {pos: 10, name: 'last player', score: 121},
    {pos: 10, name: 'last player', score: 121},

  ];

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
  private getUrlParameter(sParam) {
    return decodeURIComponent(window.location.search.substring(1)).split('&')
     .map((v) => { return v.split("=") })
     .filter((v) => { return (v[0] === sParam) ? true : false })[0]
  };

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    /*
    if(this.getUrlParameter('callback') !== undefined && this.getUrlParameter('callback')[0] === 'callback') {
      this.callback = this.getUrlParameter('callback')[1]

      if(this.callback == "logout") {
        localStorage.clear();
        window.location.href = "./home";
      }
    }
    */
  }

}
