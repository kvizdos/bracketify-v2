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

  highlightedTeams = [];

  showModal = false;
  modalHeader = "Modal Header";
  modalContent = "<p>Modal Content</p>";
  modalType = "norm";

  isAddingTeam = false;

  canRemoveTeams = true;
  
  async getBracketInfo(value: string) {
    var dat;
    var url = config.urls.current + "/bracketinfo"
    let ret = await this.http.get(url + "/?id=" + value).toPromise();
    return ret
  }

  concat(v1: string, v2: string) {
    return v1 + "-" + v2;
  }

  removeTeam(team: string) {
    console.log("CLICKED");
    if(team != 'Please create a team!') {
    let teams = this.teams;

    let invalidPositions = false;
    for (let team = 0; team < teams.length; team++) {
      if(teams[team]['positions'].length > 1 && !invalidPositions) {
        invalidPositions = true;
      }
    }

    if(!invalidPositions) {
      let c = confirm("Are you sure you want to delete " + team + "?");
      if (c) {
        let teamNames = [];
        for(let i = 0; i < this.teams.length; i++) {
          teamNames.push(this.teams[i].name);
        }

        let teamPos = teamNames.indexOf(team);
        console.log(teamPos);
        if(teamPos >= 0) {
          this.getUpdateBracket({name: team}, "removeteam").then((response) => {
            if(response['updateStatus'] != "complete") {
              switch(response['code']) {
                case "noTeam":
                  this.modalType = "error";
                  this.modalHeader = "Error!";
                  this.modalContent = "That team doesn't exist!";
                  this.showModal = true;
                  break;
                case "teamsCantAdvance":
                  this.modalType = "error";
                  this.modalHeader = "Error!";
                  this.modalContent = "No team can be advanced to remove teams.";
                  this.showModal = true;
                  break;
                case "invalidBracketToken":
                  this.modalType = "error";
                  this.modalHeader = "Error!";
                  this.modalContent = "You have an invalid bracket token. Please reload this page to fix.";
                  this.showModal = true;
                  break;
              }
            } else {
              alert("Removed " + team);
              // TOOD: Replace w/ small alert (COMPLETE)
              this.teams.splice(teamPos, 1);

              let start = teamPos;
              console.log(this.teams);
              for(let x = start; x < this.teams.length; x++) {
                  for(let p = 0; p < this.teams[x]['positions'].length; p++) {
                    this.teams[x]['positions'][p]['pos'] = this.teams[x]['positions'][p]['pos'] - 1;
                      console.log(this.teams[x]['positions']);
                  }
                  
              }            
              this.teams = this.teams.slice(); 

              let id;
              let yote = this.route.params.subscribe(paramsId => {
                id = paramsId.id;
              });

              this._bracketService.emit("teamsync", {teams: this.teams, id: id, modid: localStorage.getItem("modid")});
            }
          });
        } else {
          this.modalType = "error";
          this.modalHeader = "Error!";
          this.modalContent = "That team doesn't exist!";
          this.showModal = true;
        }
      }
    } else {
      this.modalType = "error";
      this.modalHeader = "Error!";
      this.modalContent = "No team can be advanced while trying to remove teams.";
      this.showModal = true;
    } 
    
      
    } else {
      this.modalType = "norm";
      this.modalHeader = "Wait a sec!";
      this.modalContent = "To get rid of this, please make sure you have a team added, after you confirm you have finished that step, please reload.";
      this.showModal = true;  
    }
  }

  addTeam(team: string) {
    this.isAddingTeam = true;
    if(team == 'Please create a team!') {
      this.isAddingTeam = false;
      this.modalType = "error";
      this.modalHeader = "Error!";
      this.modalContent = "Please do not set the team name to that!";
      this.showModal = true;  
    } else {
      if(team.length > 0) {
        let addingTeam = this.getUpdateBracket({name: team}, "addteam").then((response) => {
          if(response['updateStatus'] != "complete") {
            this.isAddingTeam = false;
            switch(response['code']) {
              case "invalidBracket":
                this.modalType = "error";
                this.modalHeader = "Error!";
                this.modalContent = "That bracket is not found. Please reload.";
                this.showModal = true;
                break;
              case "alreadyTeam":
                this.modalType = "error";
                this.modalHeader = "Error!";
                this.modalContent = "That is already a team!";
                this.showModal = true;
                break;
              case "reload":
                alert("Something went wrong. We are most likely seeing this, but please report it to us @bracketify on twitter or bugs@bracketify.com");
                break;
              case "invalidBracketToken":
                this.modalType = "error";
                this.modalHeader = "Error!";
                this.modalContent = "You have an invalid bracket token. Please reload to fix.";
                this.showModal = true;
              case "complete":
                break;
              default:
                alert("We have no clue what went wrong - if you see this message: we're sending help. Please contact us @bracketify on twitter or bugs@bracketify.com");
            }
          } else {
            this.isAddingTeam = false;
            this.teams.push({name: team, description: "This is a basic description!", positions: [{col: 0, pos: this.teams.length + 1}]});
            this.teams = this.teams.slice();
            let id;
            let yote = this.route.params.subscribe(paramsId => {
              id = paramsId.id;
            });

            this._bracketService.emit("teamsync", {teams: this.teams, id: id, modid: localStorage.getItem("modid")});
          }
        });
      } else {
        this.modalType = "error";
        this.modalHeader = "Error!";
        this.modalContent = "You need to enter a team name!";
        this.showModal = true;
      }
    }
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

    
    for (let team = 0; team < this.teams.length; team++) {
      if(this.teams[team]['positions'].length > 1 && this.canRemoveTeams) {
        this.canRemoveTeams = false;
      }
      console.log(this.teams[team]['positions'].length);
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

    
    for (let team = 0; team < this.teams.length; team++) {
      if(this.teams[team]['positions'].length > 1 && this.canRemoveTeams) {
        this.canRemoveTeams = false;
      }
      console.log(this.teams[team]['positions'].length);
    }

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

    
    for (let team = 0; team < teams.length; team++) {
      if(teams[team]['positions'].length > 1 && this.canRemoveTeams) {
        this.canRemoveTeams = false;
      }
      console.log(teams[team]['positions'].length);
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
                  this.teamPositions.push([]);
                  if(teams[i]['name'] != undefined) {
                    this.teamPositions[positions[position]['col']][positions[position]['pos'] - 1] = teams[i]['name'];
                  } else {
                    this.teamPositions[positions[position]['col']][positions[position]['pos'] - 1] = " ";
                  }
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
