import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { NavComponent } from './modules/navbar/nav.component';
import { RouterOutlet } from '@angular/router';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { exec } from 'child_process';
import { HttpClient } from '@angular/common/http';
describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let debugElement: DebugElement;
  let htmlElement: HTMLElement;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        NavComponent,
        RouterOutlet,
        HttpClient
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement.query(By.css('title'));
    htmlElement = debugElement.nativeElement;
  });
  it('should have title "Bracketify"', async(() => {
    expect(htmlElement.textContent).toEqual('Bracketify');
  }));
});
