import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { config } from "../../../assets/config.js"
import { JsonPipe } from '@angular/common';

import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent {
  title = 'Bracketify Create';
  verified;
  clicked;

  async getCreateBracket(value: object) {
    var dat;
    var url = "http://" + config.urls.current + "/createbracket"
    let ret = await this.http.get(url + `/?name=${value['name']}&description=${value['description']}&live=${value['live']}&game=${value['game']}&owner=${value['owner']}&addons=${value['addons']}`).toPromise();
    return ret
  }

  createBracket(value: string) {
    this.clicked = true;
    console.log("got here");
    let owner = localStorage.getItem('username');
    console.log(owner);
    let bracket = this.getCreateBracket({name: value['name'], description: value['description'], live: value['live'], game: value['game'], owner: owner, addons: value['addons']}).then((response) => {
      console.log(response);
      if(response['createStatus'] == "complete") {
        console.log(response['id'] + " <-- here")
        this.router.navigate(['/watch/' + response['id']]);

        this.clicked = true;
      } else {
        this.clicked = false;
      }
    });
  }

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {
    //if(localStorage.getItem("sessionid") == null) {
    //  window.location.href = "/login"
    //}
  }
}
