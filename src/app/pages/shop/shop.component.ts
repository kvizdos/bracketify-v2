import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { config } from "../../../assets/config.js"
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})


export class ShopComponent {
  title = 'Bracketify Shop';


  async buyRequest(value: object) {
    var dat;
    var url = config.urls.current + "/register"
    let ret = await this.http.get(url + "/?username=" + value['username'] + "&password=" + value['password'] + "&email=" + value['email']).toPromise();
    return ret
  }

  buy(type: string, amount: any) {
    switch(type) {
      case "coins":
        if(amount = (10 || 25 || 50 || 100)) { 
          let req = this.buyRequest({type: "coins", amount: amount}).then((response) => {

          });
        } else {
          alert("Invalid coin amount. Please reload!");
        }
        break;
      default:
        alert("That shouldn't have happend! Please reload!");
    }
  }

  constructor(private http: HttpClient) {
    
  }

}
