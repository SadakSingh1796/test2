import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ProfileMenuService implements OnInit{
  token: any;
  constructor(private httpClient: HttpClient) {
   
  }
  ngOnInit() {
    this.token = localStorage.getItem('admToken');
  }
  getMasterCategories() {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '
    });
    return this.httpClient.get(environment.global_url + 'tms/get_master_categories',
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
