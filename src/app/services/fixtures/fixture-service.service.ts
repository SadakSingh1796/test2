import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FixtureServiceService {
  players: any
  constructor(private readonly httpClient: HttpClient) { }
  generateFirstRoundKnockout(event: any, category: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.get(environment.global_url + 'tms/get_ko_first_round?event_id=' + event + '&category_id=' + category,
      {
        headers: reqHeader,
        params: {},
        observe: 'response',
      }
    ).pipe(
      map((response: any) => {
        return response;
      }));
  }

  generateCustomizedKnockout(data: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.post(environment.global_url + 'tms/create_custom_ko', data,
      {
        headers: reqHeader,
        params: {},
        observe: 'response',
      }
    ).pipe(
      map((response: any) => {
        return response;
      }));
  }

  getKnockoutTournament(event: any, category: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.get(environment.global_url + 'tms/get_ko_tournament?event_id=' + event + '&category_id=' + category,
      {
        headers: reqHeader,
        params: {},
        observe: 'response',
      }
    ).pipe(
      map((response: any) => {
        return response;
      }));
  }

  deleteKnockout(event: any, category: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    })
    return this.httpClient.delete(environment.global_url + 'tms/delete_ko_tournament?event_id=' + event + '&category_id=' + category, {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map((response: any) => {
      return response;
    })
    );
  }
}
