import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { config } from "../../../assets/config.js"

export class teamProvider {

    teams = [];
    grid = [];

    teamPositions = [];

    showError = false;

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
              if(this.teams.length % 2 !== 0) {
                this.showError = true;
              } else {
                
              }
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
      
                for(let i = 0; i < this.teams.length; i++) {
                  for(let x = 0; x < this.teams[i]['pos']; x++) {
                    console.log("Pos: " + x);
                    console.log(this.teams[x]);
                    this.teamPositions.push([]);
                    this.teamPositions[x].push(this.teams[i]['name'])
                  }
                  
                }
      
                console.log(this.teamPositions);
                break;
              }
              
            }
          });
    }

}