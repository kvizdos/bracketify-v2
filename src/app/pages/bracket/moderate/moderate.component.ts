import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { config } from "../../../../assets/config.js"
import { BracketComponent } from "../bracket/bracket.component"

import { JsonPipe } from '@angular/common';

import { ActivatedRoute, Router } from '@angular/router';

import { trigger, style, animate, transition } from '@angular/animations';

import { Subscriber } from 'rxjs';

declare var jquery:any;
declare var $ :any;
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
  tweet = "";

  rateStatus;

  isAddingTeam = false;
  resetClicked = false;
  beingEdited = false;
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

  async getUpdateBracket(data: object, type: string) {
    let id;
    let tempid = this.route.params.subscribe(paramsId => {
      id = paramsId.id;
    });

    var url = "http://" + config.urls.current + "/updatebracket"
    let ret = await this.http.get(url + "/?id=" + id + "&data=" + JSON.stringify(data) + "&type=" + type + "&modid=" + localStorage.getItem("modid")).toPromise();
    return ret
  }

  getTeams() {
    return this.teams;
  }

  modify(modding: string, extra: string) {
    extra = extra || '';
    this.beingEdited = true;
    switch(modding) {
      case "description":
        let newDescription = prompt("What would you like the description to be?", this.description);
        if(newDescription == this.description) {
          alert("Description cannot be the same.")
        } else if (newDescription === null) {} else {
          let oldDesc = this.description;
          this.description = newDescription;
          console.log("here");
          let change = this.getUpdateBracket({description: newDescription}, "description").then((response) => {
            console.log("hyere");
            if(response['updateStatus'] == "complete") {
              alert("Description changed!");
            } else {
              alert("Something went wrong when changing the name. Please reload.");
              this.description = oldDesc;

            }
          });
        }
        break;
      case "name":
        let name = prompt("What would you like the name to be?", this.name);
        if(name == this.name) {
          alert("Name cannot be the same.")
        } else if (name === null) {} else {
          let oldName = this.name;
          this.name = name;

          let change = this.getUpdateBracket({name: name}, "name").then((response) => {
            if(response['updateStatus'] == "complete") {
              alert("Name changed!");
            } else {
              this.name = oldName;
              alert("Something went wrong when changing the name. Please reload.");
            }
          });
        }
        break;
      case "tweet":
        let tweet = prompt("What would you like the tweet to be? (It automagically puts the link at the end)", this.tweet);

        if(tweet == this.tweet) {
          alert("Tweet cannot be the same.")
        } else if (tweet === null) {} else {
          let oldTweet = this.tweet;
          this.tweet = tweet;

          let change = this.getUpdateBracket({tweet: tweet}, "tweet").then((response) => {
            if(response['updateStatus'] == "complete") {
              alert("Tweet changed!");
            } else {
              this.tweet = oldTweet;
              alert("Something went wrong when changing the name. Please reload.");
            }
          });
        }
        break;
      case "game":
        let game = prompt("What would you like the game to be?", this.game);
          if(game == this.game) {
            alert("Game cannot be the same.")
          } else if (game === null) {} else {
            let oldGame = game;
            this.game = game;

            let change = this.getUpdateBracket({game: game}, "game").then((response) => {
              if(response['updateStatus'] == "complete") {
                alert("Game changed!");
              } else {
                this.game = oldGame;
                alert("Something went wrong when changing the name. Please reload.");
              }
            });
          }
          break;
      case "teamname":
        let team = extra;
        let teamNames = [];
        for(let i = 0; i < this.teams.length; i++) {
          teamNames.push(this.teams[i].name);
        }
        let teamPos = teamNames.indexOf(team);
        let newname = prompt("What would you like the new name to be?", team);
        if(team == newname) {
          alert("Name cannot be the same.");
        } else if (newname === null) {} else {
          let oldTeam = this.teams[teamPos]['name'];
          this.teams[teamPos]['name'] = newname;

          let change = this.getUpdateBracket({team: team, new: newname}, "teamname").then((response) => {
            if(response['updateStatus'] == "complete") {
              alert("Name changed!");
            } else {
              this.teams[teamPos]['name'] = oldTeam;

              switch(response['code']) {
                case "alreadyTeam":
                  alert("This is already a team name. It cannot be.");
                  break;
                case "invalidBracket":
                  alert("Invalid bracket - please reload");
                  break;
                case "somethingWrong":
                  alert("Something went wrong - please reload");
                  break;
              }
            }
          });
        }
        break;
      case "teamdescription":
        let description = extra['description'];
        let updateTeam = extra['team'];

        let teamDescNames = [];
        for(let i = 0; i < this.teams.length; i++) {
          teamDescNames.push(this.teams[i].name);
        }
        let teamDescPos = teamDescNames.indexOf(updateTeam);
        this.teams[teamDescPos]['descEditing'] = true;
        console.log(this.teams[teamDescPos]);

        let newdesc = prompt("What would you like the new description to be?", description).replace(">", "").replace("<", "").replace("/", "");
        if(description == newdesc) {
          alert("Description cannot be the same.");
        } else if (newdesc === null) {} else {
          let oldTeamDescription = this.teams[teamDescPos]['description'];
          this.teams[teamDescPos]['description'] = newdesc;

          let change = this.getUpdateBracket({team: updateTeam, description: description, new: newdesc}, "teamdescription").then((response) => {
            if(response['updateStatus'] == "complete") {

              alert("Description changed!");
            } else {
              this.teams[teamDescPos]['description'] = oldTeamDescription;              
              switch(response['code']) {
                case "alreadyDesc":
                  alert("This is already the description. It cannot be.");
                  break;
                case "invalidBracket":
                  alert("Invalid bracket - please reload");
                  break;
                case "somethingWrong":
                  alert("Something went wrong - please reload");
                  break;
              }
            }
          });
        }
        break;
    }
    this.beingEdited = false;
  }

  addRating(value: object) {
    alert("You can't rate a bracket you own / moderate!");
  }

  resetToken() {
    this.resetClicked = true;
    let c = confirm("Are you sure you want to reset the token? All currently viewing moderators will need to refresh their page to be able to change things.");

    if(c == true) {
      let reset = this.getUpdateBracket({}, "modid").then((response) => {
        if(response['retStatus'] == "success") {
          this.resetClicked = false;

          location.reload();
        } else {
          this.resetClicked = false;

          switch(response['retStatus']) {
            case "somethingWrong":
              alert("Something went wrong, please reload.");
              break;
            case "invalidBracket":
              alert("The bracket specified is not found. Please reload");
              break;
          }
        }
      });
    } else {
      this.resetClicked = false;
    }
  }

  removeTeam(team: string) {
    let c = confirm("Are you sure you want to delete " + team + "?");
    if (c) {
      let teamNames = [];
      for(let i = 0; i < this.teams.length; i++) {
        teamNames.push(this.teams[i].name);
      }
      let teamPos = teamNames.indexOf(team);
      if(teamPos >= 0) {
        this.getUpdateBracket({name: team}, "removeteam").then((response) => {
          if(response['updateStatus'] != "complete") {
            console.log(response);
            switch(response['code']) {
              case "noTeam":
                alert("Team not found!");
                break;
              case "invalidBracketToken":
                alert("You have an invalid bracket token. We are reloading this page to try and fix this.");
                location.reload();
                break;
            }
          } else {
            alert("Removed " + team);
            this.teams.splice(teamPos, 1);
          }
        });
      } else {
        alert("That team doesn't exist!");  
      }
    }
    
  }

  addTeam(team: string) {
    console.log("Got here..")
    this.isAddingTeam = true;
    if(team.length > 0) {
      let addingTeam = this.getUpdateBracket({name: team}, "addteam").then((response) => {
        if(response['updateStatus'] != "complete") {
          this.isAddingTeam = false;
          switch(response['code']) {
            case "invalidBracket":
              alert("That is an invalid bracket id.");
              break;
            case "alreadyTeam":
              alert("That is already a team.");
              break;
            case "reload":
              alert("Something went wrong. We are most likely seeing this, but please report it to us @bracketify on twitter or bugs@bracketify.com");
              break;
            case "invalidBracketToken":
              alert("You have an invalid bracket token. We are reloading this page to try and fix this.");
              location.reload();
            case "complete":
              break;
            default:
              console.log(response);
              alert("We have no clue what went wrong - if you see this message: we're sending help. Please contact us @bracketify on twitter or bugs@bracketify.com");
          }
        } else {
          this.isAddingTeam = false;
          this.teams.push({name: team, description: "Click to change me!", pos: 1});
          this.teams = this.teams.slice();
        }
      });
    } else {
      alert("You need to enter a team name!")
    }
  }
  
  constructor(private http: HttpClient, private route: ActivatedRoute, private bInfo: BracketComponent) {
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
      this.tweet = response['info']['tweet'];
      this.owner = response['info']['owner'];
      this.teams = response['info']['teams'];

      this.loaded = true;
    });

  }
}
