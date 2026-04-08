import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http:HttpClient){}
  url="http://localhost:3000/api/orders/"


  placeorder(data:any){
    console.log(data);
    
    console.log(this.url+"place");
    
    return this.http.post(this.url+"place",data)
  }
  myorder(id:string){
    console.log(this.url+"user/"+id);
    
    return this.http.get(this.url+"user/"+id)
  }

  allorder(){
    return this.http.get(this.url+"all")
  }

  updateStatus(id: string, status: string) {
    return this.http.put(this.url + 'status/' + id, { status });
  }
}