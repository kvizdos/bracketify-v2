import { Component } from '@angular/core';
import { config } from "../../../assets/config.js"
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent {
  title = 'Bracketify Verify';
  verifying = false;

  errorTxt = "";
  error = false;

  success = false;

  async getToken(user: string, token: string) {
    var url = config.urls.current + "/verifyuser/" + user + "/" + token;

    let ret = await this.http.get(url).toPromise();
    return ret;
  }

  lastcode = "";

  checkCode(code: string) {
    this.error = false;
    if(code.length == 5) {
        this.verifying = true;
        let check = this.getToken(localStorage.getItem('username'), code).then((response) => {
          if(response['status'] == 'complete') {
            this.verifying = false;
            this.success = true;
            window.location.href = "/profile?user=" + localStorage.getItem("username");
          } else {
            let c = response['code'];
            switch(c) {
              case "invaliduser":
                this.errorTxt = "User not found. Please relogin.";
                break;
              case "invalidcode":
                this.errorTxt = "Invalid code. Please try again.";
                break;
              case "dbissue":
                this.errorTxt = "There was an issue on our end. Please report this to either @bracketify on twitter or bugs@bracketify.com with your username!"
                break;
            }

            this.error = true;
            this.verifying = false;

          }
        });
    } else {
      this.verifying = false;
      this.error = false;

    }

    this.lastcode = code;
  }

  constructor(private http: HttpClient) {}
}
