import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SeeAllEventsService {
  token: any;
  getData:any
  constructor(private readonly httpClient: HttpClient) { 
     this.token = localStorage.getItem('admToken');
    
  }

  sellAllOngoing(type:any){
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.httpClient.get(environment.global_url + 'tms/get_events?type='+type,
      {
        headers: reqHeader,
        params: {

        },
        observe: 'response',
      }
    ).pipe(
      map((response: any) => {
        return response;
      }));
  }

  sellAllOngoingAtHome(type:any){
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.httpClient.get(environment.global_url + 'tms/get_events?type='+type,
      {
        headers: reqHeader,
        params: {

        },
        observe: 'response',
      }
    ).pipe(
      map((response: any) => {
        return response;
      }));
  }

  searchMatches(searchedString:string){
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.httpClient.get(environment.global_url + 'tms/get_events?search='+searchedString,
      {
        headers: reqHeader,
        params: {

        },
        observe: 'response',
      }
    ).pipe(
      map((response: any) => {
        return response;
      }));
  }
}
