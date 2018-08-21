import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { config } from "../../../../assets/config.js"
import { JsonPipe } from '@angular/common';

import { ActivatedRoute, Router } from '@angular/router';

import { trigger, style, animate, transition } from '@angular/animations';
import { BracketService } from '../bracket.service';

@Component({
  selector: 'watch',
  templateUrl: './watch.component.html',
  styleUrls: ['../page.component.css'],
  animations: [
    trigger(
      'slideUp', [
        style({position: 'absolute', bottom: 0}),
        animate('500ms', style({position: 'absolute', top: 0}))
      ]
    )
  ]
})
export class WatchComponent {
  title = 'Bracketify Watch';

  name = "Loading..";
  description = "Loading..";
  game = "Loading..";
  ratings: any = {likes: [], dislikes: []};
  live = "Loading..";
  owner = "Loading..";
  teams: any = [{"loading": "Loading team descriptions.."}];
  tweet = "";
  tweetLink = "";
  loaded = false;
  isLive = false;
  showLive = false;
  rateStatus;
  isPublic = false;
  hasPublicJoins = false;

  registered = false;

  regProcessing = false;

  date;

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


  async getBracketInfo(value: string) {
    var dat;
    var url = config.urls.current + "/bracketinfo"
    let ret = await this.http.get(url + "/?id=" + value).toPromise();
    return ret
  }

  async getAddRating(value: object) {
    let id;
    let yote = this.route.params.subscribe(paramsId => {
      id = paramsId.id;
    });

    var dat;
    var url = config.urls.current + "/addrating"
    let ret = await this.http.get(url + "/?id=" + id + "&rating=" + value['rating'] + "&user=" + localStorage.getItem('username')).toPromise();
    return ret
  }

  async registerTourney(value: object) {
    console.log(value);
    let username    = value['username'];
    let sessionid   = value['sessionid'];
    let id          = value['id'];
    let registering = value['registering'];
    let description = value['description'];

    console.log(`${username} - ${sessionid} - ${id}`);

    var dat;
    var url = config.urls.current + "/rft"
    let ret = await this.http.get(url + "/?id=" + id + "&username=" + username + "&sessionid=" + sessionid + "&registering=" + registering + "&description=" + description).toPromise();
    return ret
  }

  register(registering: boolean) {
    let username  = localStorage.getItem('username');
    let sessionid = localStorage.getItem('sessionid');
    let hasPJ     = this.hasPublicJoins;
    let name      = this.name;
    let bracketid = this.id;
    let description = localStorage.getItem('description');
    this.regProcessing = true;

    if((username && sessionid) !== null) {
      if(hasPJ) {
        let reg = this.registerTourney({
          username: username,
          sessionid: sessionid,
          id: bracketid,
          description: description
        }).then((response) => {
          if(response['status'] == "complete") {
            if(response['type'] == 'register') {
              this.teams.push({name: username, description: description, positions: [{col: 0, pos: this.teams.length + 1}]});
              this.teams = this.teams.slice();

              this.modal("norm", "Congrats!", "You've officially signed up to be in the '" + name + "' tournament! ");
            } else {
              let teamNames = [];
              for(let i = 0; i < this.teams.length; i++) {
                teamNames.push(this.teams[i].name);
              }

              let teamPos = teamNames.indexOf(username);
              this.teams.splice(teamPos, 1);
              this.teams = this.teams.slice();

              this.modal("norm", "All done.", "You've officially left the tournament, '" + name + "'");
            }

            this.registered = !this.registered;
            this.regProcessing = false;
          }
        })
      } else {
        this.modal("error", "Awww, shucks!", "This tournament does not have public registration.");
      }
    } else {
      window.location.href = "/login";
    }
  }

  showLivestream() {
    if(this.isLive) {
      this.modal('norm', this.name + "'s livestream", 'Livestreams are coming soon.');

    } else {
      this.modal('error', 'This bracket does not have a livestream.', 'Sadly, this bracket does not have a live stream!');
    }
  }

  addRating(value: object) {
    let rate = value['rating'];

    if(rate == "like") {
      this.ratings.likes.push(localStorage.getItem("username"));
    } else {
      this.ratings.dislikes.push(localStorage.getItem('username'));
    }

    let rating = this.getAddRating({rating: rate}).then((response) => {
      if(response['rateStatus'] == "complete") {
        this.rateStatus = rate;
        
      } else {
        if(rate == "like") {
          this.ratings.likes.pop();
        } else {
          this.ratings.dislikes.pop();
        }
      }
    });

  }

  constructor(private http: HttpClient, private route: ActivatedRoute, private _bracketService: BracketService) {
    let id;
    let yote = this.route.params.subscribe(paramsId => {
      id = paramsId.id;
    });

    let bracket = this.getBracketInfo(id).then((response) => {
      this.name = response['info']['name'];
      this.description = response['info']['description'];
      this.game = response['info']['game'];
      this.ratings = response['info']['ratings'];
      this.live = response['info']['live'];
      this.isLive = this.live.length > 0 ? true : false;
      this.showLive = false;
      this.tweet = response['info']['tweet'];
      this.tweetLink = "https://twitter.com/intent/tweet?text=" + this.tweet + " " + window.location + " - @bracketify" + "&related=kvizdos";
      this.owner = response['info']['owner'];
      this.teams = response['info']['teams'];
      this.isPublic = response['info']['public'];
      this.hasPublicJoins = response['info']['pubreg'].toString();
      this.date = response['info']['date'];
      let teamnames = [];
      for(let i = 0; i < this.teams.length; i++) {
        teamnames.push(this.teams[i]['name']);
      }
      this.registered = teamnames.indexOf(localStorage.getItem('username')) > 0 ? true : false;
      console.log(this.hasPublicJoins);
      this.loaded = true;

      console.log(this.hasPublicJoins);
    });
  }

  id;

  ngOnInit() {
    let yote = this.route.params.subscribe(paramsId => {
      this.id = paramsId.id;
    });

    this._bracketService.on('syncteams', (data: any) => {
      console.log("Sync request..");
      if(data['id'] == this.id) {
        console.log("Syncing teams..");

        this.teams = data['teams'];
      }
    });

  }

}
