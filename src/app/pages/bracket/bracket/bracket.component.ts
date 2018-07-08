import { Component, OnChanges, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { config } from "../../../../assets/config.js"
import { ModComponent } from "../moderate/moderate.component";
import { Input, HostListener, SimpleChanges } from '@angular/core';

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
export class BracketComponent implements OnChanges, OnInit {
  @Input("teams") teams: any[];
  teamPositions = [];
  grid = [];
  updateBracket = false;
  showBrack = false;
  
  async getBracketInfo(value: string) {
    var dat;
    var url = "http://" + config.urls.current + "/bracketinfo"
    let ret = await this.http.get(url + "/?id=" + value).toPromise();
    return ret
  }

  concat(v1: string, v2: string) {
    return v1 + "-" + v2;
  }

  addTeam(team: string) {
    console.log(this.teamPositions);
    this.teamPositions.push(team);

  }

  setBracket(teams: any[]) {
    this.teamPositions = [];
    this.showBrack = false;
    console.log(teams);
    this.teams = teams;
    let teamCount = teams.length;

      let modifiedCount = teamCount * 2;
    
      while(true) {

      
          console.log("here");
          console.log("Is it divisible? " + teams.length % 2)
          if(teams.length % 2 !== 0) {
            console.log("Errors!");

            break;
          } else {
            console.log("No errors!");
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
//              this.teamPositions = [];
              this.teamPositions = [];
              console.log(teams);
              for(let i = 0; i < teams.length; i++) {
                console.log("WORKING ON... " + teams[i]['name']);
                for(let x = 0; x < teams[i]['pos']; x++) {
                  console.log("Pos: " + x);
                  console.log(this.teams[x]);
                  this.teamPositions.push([]);
                  this.teamPositions[x].push(teams[i]['name'])
                }
              }
              this.showBrack = true;  
              console.log(this.teamPositions);
              break;
            }
          
          
        }
      }
  }

  constructor(private http: HttpClient, private route: ActivatedRoute) {}
  ngOnChanges(changes: SimpleChanges) {
    console.log("Detected")
    for (let propName in changes) {  
      let change = changes[propName];
      console.log(change.currentValue[change.currentValue.length - 1]);
      this.teams = change.currentValue;
      this.updateBracket = true;
      console.log(this.teams);
      console.log(this.updateBracket);
      this.setBracket(this.teams);

    }
  }

  ngOnInit() {
    let id;
    let yote = this.route.params.subscribe(paramsId => {
      id = paramsId.id;
    });

    //let gettingTeams = this.getBracketInfo(id).then((response) => {
      //this.teams = response['info']['teams'];
    console.log(this.teams);
    //this.setBracket(this.teams);
    //});
  }

}
