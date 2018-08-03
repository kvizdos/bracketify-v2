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

    console.log("Here: " + id);
    console.log(value['rating']);
    var dat;
    var url = config.urls.current + "/addrating"
    let ret = await this.http.get(url + "/?id=" + id + "&rating=" + value['rating'] + "&user=" + localStorage.getItem('username')).toPromise();
    return ret
  }

  showLivestream() {
    if(this.isLive) {
      this.modal('norm', this.name + "'s livestream", 'Livestreams are coming soon.');

    } else {
      this.modal('error', 'This bracket does not have a livestream.', 'Sadly, this bracket does not have a live stream!');
    }
  }

  addRating(value: object) {
    console.log("Clicked!");
    console.log(value);
    
    let rate = value['rating'];

    console.log(rate + " - ");

    if(rate == "like") {
      this.ratings.likes.push(localStorage.getItem("username"));
      console.log(this.ratings.likes.length);
    } else {
      this.ratings.dislikes.push(localStorage.getItem('username'));
    }

    let rating = this.getAddRating({rating: rate}).then((response) => {
      console.log(response);
      if(response['rateStatus'] == "complete") {
        this.rateStatus = rate;
        
      } else {
        if(rate == "like") {
          this.ratings.likes.pop();
          console.log(this.ratings.likes.length);
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
      this.hasPublicJoins = response['info']['pubreg'];
      this.date = response['info']['date'];
      this.loaded = true;
    });
  }

  ngOnInit() {
    let id;
    let yote = this.route.params.subscribe(paramsId => {
      id = paramsId.id;
    });

    this._bracketService.on('syncteams', (data: any) => {
      console.log("Sync request..");
      if(data['id'] == id) {
        console.log("Syncing teams..");

        this.teams = data['teams'];
      }
    });

  }

}
