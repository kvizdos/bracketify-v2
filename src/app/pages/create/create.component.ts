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

  nameError = false;
  descError = false;
  gameError = false;
  dateError = false; 
  modalType = "";
  modalHeader = "";
  modalContent = "";
  showModal = false;
  coinBoosterChecked = false;
  modal(type: any, header: any, content: any) {
    this.modalType = type;
    this.modalHeader = header;
    this.modalContent = content;
    this.showModal = true;  
  }

  async getCreateBracket(value: object) {
    var dat;
    var url = config.urls.current + "/createbracket"
    let ret = await this.http.get(url + `/?name=${value['name']}&description=${value['description']}&live=${value['live']}&game=${value['game']}&owner=${value['owner']}&addons=${value['addons']}&pubreg=${value['pubreg']}&pubview=${value['pubview']}&date=${value['date']}`).toPromise();
    return ret
  }

  createBracket(value: object) {
    console.log(value['pubView']);
    if(value['date'].length < 10) {
      this.dateError = true;
    } else {
      this.dateError = false;
    }
    if(value['name'].length == 0) {
      this.nameError = true;
    } else {
      this.nameError = false;
    }
    if(value['description'].length == 0) {
      this.descError = true;
    } else {
      this.descError = false;
    }
    if(value['game'].length == 0) {
      this.gameError = true;
    } else {
      this.gameError = false;
    }

    if(value['pubReg'] == true && value['pubView'] == false) {
      this.modal('warning', "Just a heads up..", "You've set public registration to ON, though the bracket isn't visibile to the public, so nobody will be able to join until you make it public.")
    }

    if(this.nameError || this.descError || this.gameError || this.dateError) {
      this.modal('error', 'Please fix some fields', 'Please fix the fields that are red.');
    } else {
      
      this.clicked = true;
      let owner = localStorage.getItem('username');
      let bracket = this.getCreateBracket({date: value['date'], name: value['name'], description: value['description'], live: value['live'], game: value['game'], owner: owner, addons: value['addons'], pubreg: value['pubReg'], pubview: value['pubView']}).then((response) => {
        if(response['createStatus'] == "complete") {
          let cache = JSON.parse(localStorage.getItem('usercache'));
          let cachedBrackets = cache.brackets;

          cachedBrackets.push({name: value['name'], description: value['description'], link: "/moderate/" + response['id'], id: response['id']});

          cache.brackets = cachedBrackets;

          localStorage.setItem('usercache', JSON.stringify(cache));

          this.router.navigate(['/watch/' + response['id']]);

          this.clicked = true;
        } else {
          this.clicked = false;
        }
      });
    
    }
  }

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {
    //if(localStorage.getItem("sessionid") == null) {
    //  window.location.href = "/login"
    //}
  }
}
