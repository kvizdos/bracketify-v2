import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { config } from "../../../../assets/config.js"
import { JsonPipe } from '@angular/common';

import { ActivatedRoute, Router } from '@angular/router';

import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'mod',
  templateUrl: './moderate.component.html',
  styleUrls: ['./moderate.component.css'],
  animations: [
    trigger(
      'slideUp', [
        style({position: 'absolute', bottom: 0}),
        animate('500ms', style({position: 'absolute', top: 0}))
      ]
    )
  ]
})
export class ModComponent {
  title = 'Bracketify Moderate';

  name = "Loading..";
  description = "Loading..";
  game = "Loading..";
  ratings: any = {likes: [], dislikes: []};
  live = "Loading..";
  owner = "Loading..";
  teams: any = [{"loading": "Loading team descriptions.."}];
  loaded = false;

  rateStatus;

  async getBracketInfo(value: string) {
    var dat;
    var url = "http://" + config.urls.current + "/bracketinfo"
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
    var url = "http://" + config.urls.current + "/addrating"
    let ret = await this.http.get(url + "/?id=" + id + "&rating=" + value['rating'] + "&user=" + localStorage.getItem('username')).toPromise();
    return ret
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
        alert("You've already rated!");
        if(rate == "like") {
          this.ratings.likes.pop();
          console.log(this.ratings.likes.length);
        } else {
          this.ratings.dislikes.pop();
        }
      }
    });

  }

  constructor(private http: HttpClient, private route: ActivatedRoute) {
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
      this.owner = response['info']['owner'];
      this.teams = response['info']['teams'];

      this.loaded = true;
    });
  }

}
