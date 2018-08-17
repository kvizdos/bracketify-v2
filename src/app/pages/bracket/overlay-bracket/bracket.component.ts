import { Component, OnChanges, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { config } from "../../../../assets/config.js"
import { ModComponent } from "../moderate/moderate.component";
import { Input, HostListener, SimpleChanges } from '@angular/core';

import { JsonPipe } from '@angular/common';

import { ActivatedRoute, Router } from '@angular/router';

import { trigger, style, animate, transition } from '@angular/animations';

import { BracketService } from '../bracket.service';

@Component({
  selector: 'overlaybracket',
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
export class OverlayBracketComponent implements OnChanges, OnInit {
  @Input("teams") teams: any[];
  teamPositions = [];
  grid = [];
  updateBracket = false;
  showBrack = false;
  isAdmin = false;

  isBeingEdited = false;

  Math = Math;

  highlightedTeams = [];
  
  async getBracketInfo(value: string) {
    var dat;
    var url = config.urls.current + "/bracketinfo"
    let ret = await this.http.get(url + "/?id=" + value).toPromise();
    return ret
  }

  concat(v1: string, v2: string) {
    return v1 + "-" + v2;
  }

  addTeam(team: string) {
    this.teamPositions.push(team);

  }

  async getUpdateBracket(data: object, type: string) {
    let id;
    let tempid = this.route.params.subscribe(paramsId => {
      id = paramsId.id;
    });

    var url = config.urls.current + "/updatebracket"
    let ret = await this.http.get(url + "/?id=" + id + "&data=" + JSON.stringify(data) + "&type=" + type + "&modid=" + localStorage.getItem("modid") + "&user=" + localStorage.getItem("username")).toPromise();
    return ret
  }

  highlightTeam(team: any) {
    this.highlightedTeams = [];
    let poss = [];
    for(let col = 0; col < this.teamPositions.length; col++) {
      if(this.teamPositions[col].indexOf(team) >= 0) {
        poss.push({col: col, pos: this.teamPositions[col].indexOf(team)});
        this.highlightedTeams.push(team)
      }
    }

  }

  setWinner(column: any, pos: any, team: string) {
    
    let id;
    let yote = this.route.params.subscribe(paramsId => {
      id = paramsId.id;
    });

    this._bracketService.emit('startingbuild', {id: id});
    this.isBeingEdited = true;

    let newCol = column + 1;
    let newPos = Math.ceil(pos / 2) - 1;

    this.teamPositions[newCol][newPos] = team;
    let newTeamPos = this.teamPositions;

    let teamNames = [];
    for(let i = 0; i < this.teams.length; i++) {
      teamNames.push(this.teams[i]['name']);
    }

    this.teams[teamNames.indexOf(team)]['positions'].push({col: newCol, pos: newPos + 1});
    this.getUpdateBracket({team: team}, "setwinner").then((response) => {
      this.isBeingEdited = false;

      this._bracketService.emit("rebuildbracket", {teams: this.teams, id: id, modid: localStorage.getItem("modid")});
    });
  }

  removeWinner(column: any, pos: any, team: string) {
    let id;
    let yote = this.route.params.subscribe(paramsId => {
      id = paramsId.id;
    });

    this._bracketService.emit('startingbuild', {id: id});

    this.isBeingEdited = true;
    this.teamPositions[column][pos] = undefined;

    let teamNames = [];
    for(let i = 0; i < this.teams.length; i++) {
      teamNames.push(this.teams[i]['name']);
    }

    this.teams[teamNames.indexOf(team)]['positions'].pop();
    this.getUpdateBracket({team: team}, "removewinner").then((response) => {
      this.isBeingEdited = false;

      this._bracketService.emit("rebuildbracket", {teams: this.teams, id: id, modid: localStorage.getItem("modid")});
    });
  }

  setBracket(teams: any[]) {
    this.teamPositions = [];
    this.showBrack = false;

    this.teams = teams;
                  
    if(teams.length <= 0) {
      teams.push({name: "Please create a team!", description: "No teams added. Please add one.", positions: [{col: 0, pos: 1}]})
    }

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
                 this.teamPositions[positions[position]['col']][positions[position]['pos'] - 1] = teams[i]['name'];
               }
              }

 
              if(teams[teams.length - 1]['name'] == "") {
                teams.pop();
              }

              this.showBrack = true;  

              break;
            }
          
          
        }
      }
  }

  constructor(private http: HttpClient, private route: ActivatedRoute, private _bracketService: BracketService) {
  }
  ngOnChanges(changes: SimpleChanges) {
    for (let propName in changes) {  
      let change = changes[propName];
      this.teams = change.currentValue;
      this.setBracket(this.teams);

    }
  }

  async getToken() {
    let id;
    let tempid = this.route.params.subscribe(paramsId => {
      id = paramsId.id;
    });

    var url = config.urls.current + "/gettoken"
    let ret = await this.http.get(url + "/?id=" + id + "&user=" + localStorage.getItem("username") + "&session=" + localStorage.getItem('sessionid') + "&modid=" + localStorage.getItem("modid")).toPromise();
    return ret
  }
  ngOnInit() {
    let id;
    let yote = this.route.params.subscribe(paramsId => {
      id = paramsId.id;
    });

    //let gettingTeams = this.getBracketInfo(id).then((response) => {
      //this.teams = response['info']['teams'];

      

    this._bracketService.on('startbuild', (data: any) => {
      if(data['id'] == id) {
        this.isBeingEdited = true;

      }
    });
    this._bracketService.on('syncteams', (data: any) => {
      if(data['id'] == id) {
        this.teams = data['teams'];
        
        this.setBracket(this.teams);  
        this.isBeingEdited = false;
      }
    });

    this.getToken().then((response) => {
      if(response['retStatus'] == "complete") {
        if(response['token'] == localStorage.getItem("modid")) {
          this.isAdmin = true;
        } else {
          this.isAdmin = false;
        }
      } else {
        this.isAdmin = false;
      }

      console.log(this.isAdmin);
    });

  }

}
