import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MembershipService{
  _token: any;
  constructor(private readonly httpClient: HttpClient) {
    this._token = localStorage.getItem('admToken');
  }
  
  getMemships() {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '
    })
    return this.httpClient.get("http://20.83.52.157:8000/role/",
      {
        headers: reqHeader,
        params: {

        },
        observe: 'response',
      }
    ).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getMemberShipRoleWise(role_id: any, type_id: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+ localStorage.getItem('admToken')
    })
    return this.httpClient.get(environment.global_url+"role/get_role_memberships?role_id=" + role_id + '&type_id=' + type_id,
      {
        headers: reqHeader,
        params: {

        },
        observe: 'response',
      }
    ).pipe(
      map((response: any) => {
        return response;
      })
    );

  }
  createMemberShip(data: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('admToken')
    })
    return this.httpClient.post(environment.global_url+"role/create_membership/", data, {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map((response: any) => {
      return response;
    })
    );
  }
  updateMemberShip(data: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('admToken')
    })
    return this.httpClient.post(environment.global_url+"role/update_membership/", data, {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map((response: any) => {
      return response;
    })
    );
  }
  buyMemberShip(data: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('admToken')
    })
    return this.httpClient.post("http://20.83.52.157:8000/role/assign_user_membership/", data, {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map((response: any) => {
      return response;
    })
    );
  }
}
