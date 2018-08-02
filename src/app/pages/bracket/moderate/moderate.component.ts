import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { config } from "../../../../assets/config.js"
import { BracketComponent } from "../bracket/bracket.component"

import { JsonPipe } from '@angular/common';

import { ActivatedRoute, Router } from '@angular/router';

import { trigger, style, animate, transition } from '@angular/animations';

import { Subscriber } from 'rxjs';

import { BracketService } from '../bracket.service';

declare var jquery:any;
declare var $ :any;
@Component({
  selector: 'mod',
  templateUrl: './moderate.component.html',
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
export class ModComponent implements OnInit {
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
  admins = [];
  date;
  isPublic;
  hasPublicJoins;

  rateStatus;

  showModal = false;
  modalHeader = "Modal Header";
  modalContent = "<p>Modal Content</p>";
  modalType = "norm";
  modalPlaceholder = "";
  modalButton = "";
  modalCb;
  isAddingTeam = false;
  resetClicked = false;
  beingEdited = false;

  pubViewEdit = false;
  pubRegEdit = false;

  dateEdit = false;

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
    let ret = await this.http.get(url + "/?id=" + id + "&data=" + JSON.stringify(data) + "&type=" + type + "&modid=" + localStorage.getItem("modid") + "&user=" + localStorage.getItem("username")).toPromise();
    return ret
  }

  modal(type: any, header: any, content: any, placeholder: any, modalButton: any, callback) {
    if(placeholder.length == 0) { placeholder = "" }
    this.modalType = type;
    this.modalHeader = header;
    this.modalContent = content;
    this.modalPlaceholder = placeholder;
    this.modalButton = modalButton;
    this.modalCb = callback;
    this.showModal = true;  
  }
  getTeams() {
    return this.teams;
  }

  shuffle(arr: any[]) {
    let ctr = arr.length;
    let temp;
    let index;
    let used = [];
    let attempts = [];
    while(ctr > 0) {
      index = Math.floor(Math.random() * arr.length);
      if(attempts.indexOf(index) == -1) {
        if(used.indexOf(index) == -1) {
          attempts.push(index);

          used.push(index);

          ctr--;

          let temppos = arr[ctr]['positions'][0];
          temp = arr[ctr];
          arr[index]['positions'][0]['pos'] = index;
//          arr[ctr] = arr[index];
          //arr[index] = temp;
          
        } else {
          if(attempts.length == 10) {
            break;
          }
          attempts.push(index);
          console.log("Attempts:");
          console.log(attempts);
          console.log("----");
          index = Math.floor(Math.random() * arr.length);

        }

      } else {
        
        console.log("Trying: " + index + " - has " + used.indexOf(index));
        index = Math.floor(Math.random() * arr.length);
        console.log("Going to try: " + index + " - has " + used.indexOf(index));


      }

      console.log(arr);
    }

    return arr;
  }





  modify(modding: string, extra: string) {
    extra = extra || '';
    this.beingEdited = true;
    switch(modding) {
      case "date":
        this.dateEdit = true;
        let tempdate = this.date;
        this.date = extra;
        let dateChange = this.getUpdateBracket({date: extra}, "date").then((response) => {
          if(response['updateStatus'] == 'complete') {
            this.dateEdit = false;
            // TODO: Replace w/ small bottom alert (COMPLETE)
          } else {
            this.dateEdit = false;
            this.date = tempdate;
            alert("Something went wrong. Please reload.")
          }
        });
        break;
      case "description":
        let newDescription = prompt("What would you like the description to be?", this.description);
        if(newDescription == this.description || newDescription.length <= 200 == false) {
          console.log("error error!");
          this.modalType = "error";
          this.modalHeader = "Error!";
          this.modalContent = newDescription == this.description ? "Please do not set the same description." : newDescription.length <= 200 == false ? "You went over the maximum amount of characters!" : "Something went wrong..";
          this.showModal = true;
        } else if (newDescription === null) {} else {
          let oldDesc = this.description;
          this.description = newDescription;
          let change = this.getUpdateBracket({description: newDescription}, "description").then((response) => {
            if(response['updateStatus'] == "complete") {
              // TODO: Replace w/ small bottom alert (COMPLETE)
            } else {
              console.log(response['updateStatus']);
              alert("Something went wrong when changing the description. Please reload.");
              this.description = oldDesc;

            }
          });
        }
        break;
      case "name":
        let name = prompt("What would you like the name to be?", this.name);
        if(name == this.name) {
          this.modalType = "error";
          this.modalHeader = "Error!";
          this.modalContent = "Please do not set the same name.";
          this.showModal = true;
        } else if (name === null) {} else {
          let oldName = this.name;
          this.name = name;

          let change = this.getUpdateBracket({name: name}, "name").then((response) => {
            if(response['updateStatus'] == "complete") {
              // TODO: Replace w/ small bottom alert (COMPLETE)
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
          this.modalType = "error";
          this.modalHeader = "Error!";
          this.modalContent = "Please do not set the same tweet.";
          this.showModal = true;
        } else if (tweet === null) {} else {
          let oldTweet = this.tweet;
          this.tweet = tweet;

          let change = this.getUpdateBracket({tweet: tweet}, "tweet").then((response) => {
            if(response['updateStatus'] == "complete") {
              // TODO: Replace w/ small bottom alert (COMPLETE)
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
            this.modalType = "error";
            this.modalHeader = "Error!";
            this.modalContent = "Please do not set the same game.";
            this.showModal = true;
          } else if (game === null) {} else {
            let oldGame = game;
            this.game = game;

            let change = this.getUpdateBracket({game: game}, "game").then((response) => {
              if(response['updateStatus'] == "complete") {
                // TODO: Replace w/ small bottom alert (COMPLETE)
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
          this.modalType = "error";
          this.modalHeader = "Error!";
          this.modalContent = "Please do not set the same team name.";
          this.showModal = true;
        } else if (newname === null) {} else {
          let oldTeam = this.teams[teamPos]['name'];
          this.teams[teamPos]['name'] = newname;

          let change = this.getUpdateBracket({team: team, new: newname}, "teamname").then((response) => {
            if(response['updateStatus'] == "complete") {
              // TODO: Replace w/ small bottom alert (COMPLETE)
            } else {
              this.teams[teamPos]['name'] = oldTeam;

              switch(response['code']) {
                case "alreadyTeam":
                  this.modalType = "error";
                  this.modalHeader = "Error!";
                  this.modalContent = "This is already a team name. It cannot be.";
                  this.showModal = true;
                  break;
                case "invalidBracket":
                  this.modalType = "error";
                  this.modalHeader = "Error!";
                  this.modalContent = "Invalid bracket. Please reload.";
                  this.showModal = true;
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

        let newdesc = prompt("What would you like the new description to be?", description).replace(">", "").replace("<", "").replace("/", "");
        if(description == newdesc) {
          this.modalType = "error";
          this.modalHeader = "Error!";
          this.modalContent = "Please do not set the same description.";
          this.showModal = true;
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
                  this.modalType = "error";
                  this.modalHeader = "Error!";
                  this.modalContent = "Please do not set the same description.";
                  this.showModal = true;
                  break;
                case "invalidBracket":
                  this.modalType = "error";
                  this.modalHeader = "Error!";
                  this.modalContent = "Invalid bracket. Please reload.";
                  this.showModal = true;
                  break;
                case "somethingWrong":
                  alert("Something went wrong - please reload");
                  break;
              }
            }
          });
        }
        break;
      case "addadmin":
        let admin = prompt("What is the username of the admin you would like to invite? (Must be a valid Bracketify user)");
        //let admin = this.modal('prompt', 'Please input the admin\'s username', 'This user must be a registered Bracketify user', "kento", "Add", "");
          
        if(admin.length > 0) {
          if(this.admins.indexOf(admin) == -1) {
            this.admins.push(admin);
            let newAdminPos = this.admins.indexOf(admin);
          }

          this.getUpdateBracket({admin: admin}, "addadmin").then((response) => {
            if(response['updateStatus'] !== "complete") {
              this.admins.splice(this.admins.indexOf(admin));
              switch(response['code']) {
                case "invalidUser":
                  this.modalType = "error";
                  this.modalHeader = "Error!";
                  this.modalContent = "The username length is invalid.";
                  this.showModal = true;
                  break;
                case "alreadyAdmin":
                  this.modalType = "error";
                  this.modalHeader = "Error!";
                  this.modalContent = "That person is already an admin!";
                  this.showModal = true;
                  break;
                case "userNotFound":
                  this.modalType = "error";
                  this.modalHeader = "Error!";
                  this.modalContent = "That is not a valid Bracketify user.";
                  this.showModal = true;
                  break;
                case "invalidBracket":
                  this.modalType = "error";
                  this.modalHeader = "Error!";
                  this.modalContent = "This bracket is invalid. Please reload";
                  this.showModal = true;
                  break;
              }
            } else {
              // TODO: Replace w/ small bottom alert (COMPLETE)
            }
          });
        } else {
          this.modalType = "error";
          this.modalHeader = "Error!";
          this.modalContent = "Please make the username a valid length.";
          this.showModal = true;
        }
        break;
      case "removeadmin":
        let removeadmin = extra['removeadmin'];
        let removeAdminPos = this.admins.indexOf(removeadmin);
        this.admins.splice(removeAdminPos, 1);
        if(removeadmin.length > 0) {
          this.getUpdateBracket({admin: removeadmin}, "removeadmin").then((response) => {
            if(response['updateStatus'] !== "complete") {
              this.admins.splice(removeAdminPos, 0, removeadmin);
              switch(response['code']) {
                case "invalidUser":
                  this.modalType = "error";
                  this.modalHeader = "Error!";
                  this.modalContent = "The username length is invalid.";
                  this.showModal = true;
                  break;
                case "notAdmin":
                  this.modalType = "error";
                  this.modalHeader = "Error!";
                  this.modalContent = "That person is not an admin!";
                  this.showModal = true;
                  break;
                case "userNotFound":
                  this.modalType = "error";
                  this.modalHeader = "Error!";
                  this.modalContent = "That is not a Bracketify user!";
                  this.showModal = true;
                  break;
                case "invalidBracket":
                  this.modalType = "error";
                  this.modalHeader = "Error!";
                  this.modalContent = "Invalid bracket. Please reload.";
                  this.showModal = true;
                  break;
              }
            } else {
              // TODO: Replace w/ small bottom alert (COMPLETE)
            }
          });
        } else {
          this.modalType = "error";
          this.modalHeader = "Error!";
          this.modalContent = "Invalid username length.";
          this.showModal = true;
        }
        break;
      case "pubview":
        this.pubViewEdit = true;
        this.isPublic = !this.isPublic;
        let changeView = this.getUpdateBracket({public: this.isPublic.toString()}, "publicity").then((response) => {
          if(response['updateStatus'] == "complete") {
            this.pubViewEdit = false;
            // TODO: Replace w/ small bottom alert (COMPLETE)
          } else {
            this.isPublic = !this.isPublic;
            alert("Something went wrong when changing the name. Please reload.");
          }
        });
        break;
      case "pubreg":
        this.pubRegEdit = true;
        this.hasPublicJoins = !this.hasPublicJoins;
        let changeReg = this.getUpdateBracket({register: this.hasPublicJoins}, "pubregister").then((response) => {
          if(response['updateStatus'] == "complete") {
            this.pubRegEdit = false;
            // TODO: Replace w/ small bottom alert (COMPLETE)
          } else {
            this.hasPublicJoins = !this.hasPublicJoins;
            alert("Something went wrong when changing the name. Please reload.");
          }
        });
        break;
      case "randomizeTeams":
        let teams = this.teams;
        let pos = [];
        let invalidPositions = false;
        for (let team = 0; team < teams.length; team++) {
          if(teams[team]['positions'].length > 1) {
            invalidPositions = true;
          } else {
            pos.push({team: team, pos: teams[team]['positions']})
          }
        }

        if(invalidPositions) {
          alert("No team can be advanced to scramble teams.")
        } else {
          /*
          let used = [];
          for(let p = 0; p < pos.length; p++) {
            let randomPos = Math.floor(Math.random() * pos.length + 1);
            while(true) {
              if(used.indexOf(randomPos) == -1) {
                used.push(randomPos);
                pos[p]['pos'] = randomPos; 
                break;
              } else {
                randomPos = Math.floor(Math.random() * pos.length + 1);
              }
            }
          }
          let usedList = [];
          let usedTeams = [];
          let newTeam = [];

          for(let team = 0; team < this.teams.length; team++) {
            let randomPos = Math.floor(Math.random() * this.teams.length);
            console.log("Starting on team " + team + " with the new pos of " + randomPos);

            while(true) {
              console.log(usedList);
              if(usedList.indexOf(randomPos) == -1 && team !== randomPos) {
                if(newTeam.indexOf(this.teams[randomPos])) {
                  console.log(randomPos + " - " + this.teams[randomPos]);
                  newTeam[randomPos] = this.teams[randomPos];
                  console.log(newTeam[team]);
  
                  usedList.push(randomPos);
                  usedTeams.push(this.teams[randomPos]['name']);
                  this.teams.splice(team, 1);

                  break;
                } else {
                  randomPos = Math.floor(Math.random() * this.teams.length);
                }
                
              } else {
                console.log("restarting");
                randomPos = Math.floor(Math.random() * this.teams.length);
              }
            }
            console.log("New team: ");
            console.log(newTeam);
            this.teams = newTeam;
            
          }
          */
          this.teams = this.shuffle(this.teams);
          console.log(this.teams);
          this.teams = this.teams.slice();

          let id;
          let yote = this.route.params.subscribe(paramsId => {
            id = paramsId.id;
          });

          this._bracketService.emit("rebuildbracket", {teams: this.teams, id: id, modid: localStorage.getItem("modid")});

          this.getUpdateBracket({teams: this.teams}, "scramble").then((response) => {
            // TODO: alert done
          });
        };
    }
    this.beingEdited = false;
  }

  addRating(value: object) {
    this.modalType = "error";
    this.modalHeader = "Error!";
    this.modalContent = "You can't rate a bracket you own / moderate!";
    this.showModal = true;  
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
              this.modalType = "error";
              this.modalHeader = "Error!";
              this.modalContent = "Something went wrong, please reload.";
              this.showModal = true;
              break;
            case "invalidBracket":
              this.modalType = "error";
              this.modalHeader = "Error!";
              this.modalContent = "The bracket specified isn't valid in our system. Please reload.";
              this.showModal = true;
              break;
          }
        }
      });
    } else {
      this.resetClicked = false;
    }
  }

  removeTeam(team: string) {
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
  
  constructor(private http: HttpClient, private route: ActivatedRoute, private bInfo: BracketComponent, private _bracketService: BracketService) {
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
      this.admins = response['info']['admins'];
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
