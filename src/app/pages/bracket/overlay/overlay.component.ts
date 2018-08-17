import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { config } from "../../../../assets/config.js"
import { JsonPipe } from '@angular/common';

import { ActivatedRoute, Router } from '@angular/router';

import { trigger, style, animate, transition } from '@angular/animations';
import { BracketService } from '../bracket.service';

@Component({
  selector: 'overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.css'],
  animations: [
    trigger(
      'slideUp', [
        style({position: 'absolute', bottom: 0}),
        animate('500ms', style({position: 'absolute', top: 0}))
      ]
    )
  ]
})
export class OverlayComponent {
  title = 'Bracketify Overlay';

  teams = [{"loading": "Loading team descriptions.."}];
  loaded = false;

  async getBracketInfo(value: string) {
    var dat;
    var url = config.urls.current + "/bracketinfo"
    let ret = await this.http.get(url + "/?id=" + value).toPromise();
    return ret
  }

  constructor(private http: HttpClient, private route: ActivatedRoute, private _bracketService: BracketService) {
    console.log(this.teams);
    let id;
    let yote = this.route.params.subscribe(paramsId => {
      id = paramsId.id;
    });

    let bracket = this.getBracketInfo(id).then((response) => {
      this.teams = response['info']['teams'];
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
