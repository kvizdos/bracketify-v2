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

  show = true;

  version = config.version;

  
  async searchTerms(term: string) {
    var dat;
    var url = config.urls.current + "/search"
    let ret = await this.http.get(url + "/?term=" + term).toPromise();
    return ret
  }

  async getExplore(type: string) {
    var dat;
    var url = config.urls.current + "/explore"
    let ret = await this.http.get(url + "/?type=" + type).toPromise();
    return ret
  }

  typingTimer: any;

  retExplore() {
    if(localStorage.getItem('newcache') !== null) this.newBrackets = JSON.parse(localStorage.getItem('newcache'))['new']; 
    let newbracs = this.getExplore("new").then((resp) => {
      this.newBrackets = [resp];
      this.newBrackets = this.newBrackets[0];
      localStorage.setItem('newcache', JSON.stringify({new: this.newBrackets}));

    });
  }

  watch(id: string) {
    window.location.href = "/watch/" + id;
  }

  replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
  };

  modalType = "";
  modalHeader = "";
  modalContent = "";
  showModal = false;
  modal(type: any, header: any, content: any) {
    this.modalType = type;
    this.modalHeader = header;
    this.modalContent = content;
    this.showModal = true;  
  }

  explore(type: String, term: String) {
    switch(type) { 
      case "user":
        window.location.href = "/profile?user=" + term.toLowerCase();
        break;
      default: 
        this.modal('norm', 'Thank\'s for taking interest, but..', "Sadly, due to time constraints, we are unable to provide you with the explore page. We are working hard on getting this page published and as soon as we have it done it will be live (and the update will be sent in the weekly update email)")
        break;
    }
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

  private getUrlParameter(sParam) {
    return decodeURIComponent(window.location.search.substring(1)).split('&')
     .map((v) => { return v.split("=") })
     .filter((v) => { return (v[0] === sParam) ? true : false })[0]
  };

  constructor(private http: HttpClient,private sanitizer: DomSanitizer) {
    if(this.getUrlParameter('error') !== undefined && this.getUrlParameter('error')[0] === 'error') {
      let error = this.getUrlParameter('error')[1]

      if(error == "unf") {
        this.modal("error", "User not found!", "That user was not found");
      }
    }
    this.retExplore();
  }
}
