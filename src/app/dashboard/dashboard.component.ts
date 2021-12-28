import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { Bk, Cls, Role, Sub } from '../models/models';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {
  title="V.V.S.K";
  classes:Cls[];
  cls:Cls;
  sub:Sub;
  bk:Bk;
  @ViewChild("iframe")
  iframe:ElementRef<HTMLIFrameElement>;
  constructor(public firestore: FirestoreService,public http:HttpClient) {
    
  }

  ngOnInit(): void {
    this.http.get('assets/ncert.json').subscribe((res:any)=>{
      this.classes=res;
      if(localStorage.getItem('state')!=null){
        let previousState:State=JSON.parse(localStorage.getItem('state'));
        this.cls=this.classes.filter(cl=>cl.id==previousState.cls)[0];
        this.sub=this.cls.subs.filter(su=>su.id==previousState.sub)[0];
        this.bk=this.sub.bks.filter(b=>b.id==previousState.bk)[0];
      }
    });
  }

  bookChanged(){
    if(this.bk==null)return;
    this.saveToLocalStorage();
    this.embedIFrame();
    this.getBookContent();
  }

  embedIFrame(){
    let url="https://ncert.nic.in/";
    this.iframe.nativeElement.src=url+this.bk.link;
  }

  getBookContent(){
    let url="https://ncert.nic.in/";
    this.http.get(url+this.bk.link).subscribe(res=>{
      console.log(res);
    });
  }

  saveToLocalStorage(){
    let currentState:State={cls:this.cls.id,sub:this.sub.id,bk:this.bk.id}
    localStorage.setItem('state',JSON.stringify(currentState));
  }


}

export class State{
  cls:string;
  sub:string;
  bk:string;
}
