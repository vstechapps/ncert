import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { Bk, Cls, Role, Sub } from '../models/models';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';


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
  ch:number;
  
  constructor(public firestore: FirestoreService,public http:HttpClient,public sanitizer:DomSanitizer) {
    
  }

  ngOnInit(): void {
    this.http.get('assets/ncert.json').subscribe((res:any)=>{
      this.classes=res;
      this.preprocess();
      
      if(localStorage.getItem('state')!=null){
        let previousState:State=JSON.parse(localStorage.getItem('state'));
        this.cls=this.classes.filter(cl=>cl.id==previousState.cls)[0];
        this.sub=this.cls.subs.filter(su=>su.id==previousState.sub)[0];
        this.bk=this.sub.bks.filter(b=>b.id==previousState.bk)[0];
        this.ch=previousState.ch;
      }
    });

  }

  bookChanged(){
    if(this.bk==null)return;
    this.saveToLocalStorage();
    this.getBookContent();
  }

  preprocess(){
    this.classes.forEach(cl=>{
      cl.subs.forEach(s=>{
        s.bks.forEach(b=>{
          try{
            b.cntnts=[];
            var bk=b.link.substring(b.link.indexOf("?")+1);
            var len=parseInt(b.link.substring(b.link.indexOf("-")+1));
            bk=bk.replace("=0-"+len,"");
            for(var i=1;i<=len;i++){
              var t=(i)<10?"0"+(i):""+(i);
              var s="https://ncert.nic.in/textbook/pdf/"+bk+t+".pdf";
              b.cntnts.push(s);
            }
          }catch(e){
            console.error(e);
          }
        });
      });
    });
  }

  open(c:string,i:number){
    this.ch=i;
    this.saveToLocalStorage();
    window.open(c,"_blank");
  }

  getBookContent(){
    let url="https://ncert.nic.in/";
    this.http.get(url+this.bk.link).subscribe(res=>{
      console.log(res);
    });
  }

  saveToLocalStorage(){
    let currentState:State={cls:this.cls.id,sub:this.sub.id,bk:this.bk.id,ch:0}
    if(this.ch!=null)currentState.ch=this.ch;
    localStorage.setItem('state',JSON.stringify(currentState));
  }


}

export class State{
  cls:string;
  sub:string;
  bk:string;
  ch:number;
}
