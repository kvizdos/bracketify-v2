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
  isAdmin = false;

  isBeingEdited = false;

  Math = Math;
  
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

  async getUpdateBracket(data: object, type: string) {
    let id;
    let tempid = this.route.params.subscribe(paramsId => {
      id = paramsId.id;
    });

    var url = "http://" + config.urls.current + "/updatebracket"
    let ret = await this.http.get(url + "/?id=" + id + "&data=" + JSON.stringify(data) + "&type=" + type + "&modid=" + localStorage.getItem("modid") + "&user=" + localStorage.getItem("username")).toPromise();
    return ret
  }

  setWinner(column: any, pos: any, team: string) {
    this.isBeingEdited = true;

    let newCol = column + 1;
    let newPos = Math.ceil(pos / 2) - 1;

    console.log(newCol + " - " + newPos);
    this.teamPositions[newCol][newPos] = team;
    
    this.getUpdateBracket({team: team}, "setwinner").then((response) => {
      this.isBeingEdited = false;

      console.log(response);
    });
  }

  removeWinner(column: any, pos: any, team: string) {
    this.isBeingEdited = true;
    this.teamPositions[column][pos] = undefined;
    console.log(this.teamPositions);
    this.getUpdateBracket({team: team}, "removewinner").then((response) => {
      this.isBeingEdited = false;

      console.log(response);
    });
  }

  setBracket(teams: any[]) {
    this.teamPositions = [];
    this.showBrack = false;

    this.teams = teams;
    let teamCount = teams.length;

      let modifiedCount = teamCount * 2;
      this.grid = [];

      while(true) {
      
          if(modifiedCount % 2 !== 0 && modifiedCount != 1) {
            modifiedCount += 1;
          } else {
            if(modifiedCount % 2 === 0) {
              let tmpRows = Math.ceil(modifiedCount / 2);
              let tmpRow = "";
              for (let i = 0; i < tmpRows; i++) {
                tmpRow += "R"
              }
              this.grid.push(tmpRow.split(""));
              modifiedCount = Math.ceil(modifiedCount / 2);
            } else if(modifiedCount > 1) {
                modifiedCount += 1;
            } else {
              this.teamPositions;

              for(let i = 0; i < this.grid.length; i++) {
                this.teamPositions.push([]);
              }

//              this.teamPositions = [];
              for(let i = 0; i < teams.length; i++) {
                let positions = this.teams[i]['positions'];
               for(let position = 0; position < positions.length; position++) {
                  for (let i = 0; i < positions[position]['pos'] + 1; i++) {
                    this.teamPositions.push([]);
                    if(positions[position]['pos'] != this.teamPositions[i].length) {
                    }
                  }
                 console.log(position + " of " + teams[i]['name'])
                 console.log(teams[i]['name'] + " - " + positions[position]['col'] + " - " + (positions[position]['pos'] - 1));
                 this.teamPositions[positions[position]['col']][positions[position]['pos'] - 1] = teams[i]['name'];
               }
              }

 
              if(teams[teams.length - 1]['name'] == "") {
                teams.pop();
              }

              this.showBrack = true;  

              console.log(this.teamPositions);
              break;
            }
          
          
        }
      }
  }

  constructor(private http: HttpClient, private route: ActivatedRoute) {
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log("Detected")
    for (let propName in changes) {  
      let change = changes[propName];
      console.log(change.currentValue);
      this.teams = change.currentValue;
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
