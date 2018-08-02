import { Component } from '@angular/core';
import { config } from "../../../assets/config.js"
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  title = 'Bracketify Home';
  searchResults: any[];
  cacheSearchResults: any[];
  neverChange: any[];
  extraOptions: any[];

  newBrackets: any[];

  search: any;

  
  async searchTerms(term: string) {
    var dat;
    var url = "http://" + config.urls.current + "/search"
    let ret = await this.http.get(url + "/?term=" + term).toPromise();
    return ret
  }

  async getExplore(type: string) {
    var dat;
    var url = "http://" + config.urls.current + "/explore"
    let ret = await this.http.get(url + "/?type=" + type).toPromise();
    return ret
  }

  typingTimer: any;

  retExplore() {
    let newbracs = this.getExplore("new").then((resp) => {
      this.newBrackets = [resp];
      this.newBrackets = this.newBrackets[0];
      console.log(this.newBrackets);
    });
  }

  watch(id: string) {
    window.location.href = "/watch/" + id;
  }

  replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
  };


  explore(type: string, term: string) {
    window.location.href = "/explore?" + type + "=" + term;
  }

  prepSearchTerm(termString: string) {
    if(termString !== '') {
      let cont = false;

      clearTimeout(this.typingTimer);

      if(this.searchResults !== ([] || undefined) && (this.searchResults !== undefined && this.searchResults[0]['id'] != "#")) {
        for(let result = 0; result < this.searchResults.length; result++) {
        
          if(this.searchResults[result]['name'].toLowerCase().includes(termString.toLowerCase()) == false && this.searchResults[result]['id'] !== "#") {
            
            this.searchResults.splice(result, 1);
            console.log(this.searchResults);
          } 
        }

        this.searchResults = this.searchResults;
        this.typingTimer = setTimeout(() => {this.searchTerm(termString)}, 350);          
        
      } else {
        this.searchResults = [{name: "Searching...", owner: "", id: "#"}];
        this.typingTimer = setTimeout(() => {this.searchTerm(termString)}, 350);   
      }

      


    } else {
      this.searchResults = undefined; 
      this.cacheSearchResults = undefined;
    }
  }

  resetTimer() {
    clearTimeout(this.typingTimer);
  }

  searchTerm(term: string) {

    let cont = false;
    let fullTerm = term;
    if(term == '') {
      this.searchResults = undefined;
    } else {
      let terms = term.split(" ");
        let s = this.searchTerms(term).then((resp) => {
  
          if(Object.keys(resp).length > 0) {

            this.cacheSearchResults = [resp];
            this.cacheSearchResults = this.cacheSearchResults[0];
            this.neverChange = [resp];
            this.neverChange = this.neverChange[0];
            this.searchResults = [resp];
            this.searchResults = this.searchResults[0];

          

          } else {
            this.cacheSearchResults = undefined;
            this.searchResults = [{name: "<span>No brackets found :(</span>", owner: "", id: "#"}];
          }
        })
      
    }
  }

  constructor(private http: HttpClient,private sanitizer: DomSanitizer) {

    this.retExplore();
  }
}
