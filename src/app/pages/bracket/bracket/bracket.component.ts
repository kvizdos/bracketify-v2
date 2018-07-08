import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { config } from "../../../../assets/config.js"

import { ModComponent } from "../moderate/moderate.component";
import { Input, HostListener } from '@angular/core';

import { JsonPipe } from '@angular/common';

import { ActivatedRoute, Router } from '@angular/router';

import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'bracket',
  templateUrl: './bracket.component.html',
  styleUrls: ['./bracket.component.css'],
  animations: [
    trigger(
      'slideUp', [
        style({position: 'absolute', bottom: 0}),
        animate('500ms', style({position: 'absolute', top: 0}))
      ]
    )
  ]
})
export class BracketComponent {
  teams = [];

  grid = [];

  async getBracketInfo(value: string) {
    var dat;
    var url = "http://" + config.urls.current + "/bracketinfo"
    let ret = await this.http.get(url + "/?id=" + value).toPromise();
    return ret
  }

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    let id;
    let yote = this.route.params.subscribe(paramsId => {
      id = paramsId.id;
    });

    let gettingTeams = this.getBracketInfo(id).then((response) => {
      this.teams = response['info']['teams'];

      let teamCount = this.teams.length;

      let modifiedCount = teamCount * 2;
      console.log(modifiedCount);
      console.log(modifiedCount % 2)
      while(true) {
        console.log("here");
        if(modifiedCount % 2 === 0) {
          console.log(modifiedCount / 2);
          let tmpRows = Math.ceil(modifiedCount / 2);
          let tmpRow = "";
          for (let i = 0; i < tmpRows; i++) {
            tmpRow += "R"
          }
          this.grid.push(tmpRow.split(""));

          modifiedCount /= 2;
         
        } else if(modifiedCount == 3)  {
          
            modifiedCount += 1;
          
        } else {

          for(let i = 0; i < this.grid.length; i++) {
            console.log(this.grid[i]);
          }

          break;
        }
        
      }
    });
  }

}
