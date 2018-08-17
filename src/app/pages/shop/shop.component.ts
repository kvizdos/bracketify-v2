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
  verifying = false;
  verified = false;

  shopUrl = "http://localhost:3030";
  saleURL = "";
  modalType = "";
  modalHeader = "";
  modalContent = "";
  showModal = false;
  showPaymentModal = false;
  modal(type: any, header: any, content: any) {
    this.modalType = type;
    this.modalHeader = header;
    this.modalContent = content;
    this.showModal = true;  
  }
  paymentModal(type: any, header: any, content: any) {
    this.modalType = type;
    this.modalHeader = header;
    this.modalContent = content;
    this.showPaymentModal = true;  
  }

  async verifySession() {
    var dat;
    var url = config.urls.current + "/verifysession"
    let ret = await this.http.get(url + "/?sessionid=" + localStorage.getItem("sessionid") + "&user=" + localStorage.getItem("username")).toPromise();
    return ret
  }

  buy(type: string, amount: any) {
    switch(type) {
      case "coins":
        console.log("Modaling");
        this.saleURL = this.shopUrl+"/buy?username="+localStorage.getItem('username')+"&type="+type+"&amount="+amount;
        this.verifying = false;
        this.modal('norm', "Checkout", "");

        break;
      default:
        alert("That shouldn't have happend! Please reload!");
    }
  }
  hex2a(hex) {
    var str = '';
    for (var i = 0; i < hex.length; i += 2) str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
  }
  startPurchase() {
    this.verifying = true;
    console.log(this.saleURL);
    if((localStorage.getItem("username") && localStorage.getItem("sessionid")) !== null) {
      let choice = this.verifySession().then((response) => {
          if(response['verified'] == "false") {
              window.location.href = "/login?callback=shop";
              return false
          } else {
            window.location.href = this.saleURL;
          }
      });
    } else {
      window.location.href = "/login?callback=shop";
      return false;
    }
  }
  private getUrlParameter(sParam) {
    return decodeURIComponent(window.location.search.substring(1)).split('&')
     .map((v) => { return v.split("=") })
     .filter((v) => { return (v[0] === sParam) ? true : false })[0]
  };
  
  constructor(private http: HttpClient) {
    if(this.getUrlParameter('payment') !== undefined && this.getUrlParameter('payment')[0] === 'payment') {
      switch(this.getUrlParameter('payment')[1]) {
        case "complete":
          this.paymentModal("norm", "Success!", "Thank you for your purchase! If you do not recieve your purchase within the next 10 minutes, please contact billing@bracketify.com");
          break;
        case "dbissue":
          this.paymentModal("error", "Uh oh!", "There was a database issue on our end. If you were charged, please contact billing@bracketify.com and we will get it resolved. If not, please try again.");
          break;
        case "fail":
          this.paymentModal("error", "Uh oh!", "Payment creation failed. No charges were made. Please try again and if you continue to have this issue, please contact billing@bracketify.com");
          break;
        case "itemnotfound":
          this.paymentModal("error", "Uh oh!", "That item was not found. Please try again");
          break;
        case "unknownusername":
          this.paymentModal("error", "Uh oh!", "Your username was not found. Please reload and try again.");
          break;
        case "notfound":
          this.paymentModal("error", "Uh oh!", "There was an issue processing your request. Please reload and try again.");
          break;
        case "unauthorized":
          this.paymentModal("error", "Uh oh!", "Payment authorization failed. Please reload and try again.");
          break;
        default:
          this.paymentModal("error", "Uh oh!", "Something went wrong somewhere... if you were charged, immediatly contact billing@bracketify.com and we will resolve the issue. If not, please reload and try again.");
          break;
      }
    }
  }

}
