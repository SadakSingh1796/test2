import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VideosService {

  constructor(private httpClient: HttpClient) { }
  getMatchLiveStream(match_id: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.get(environment.global_url + 'tms/get_match_live_stream?match_id=' + match_id,
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
  createMatchLiveStream(match_id: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.get(environment.global_url + 'tms/create_match_live_stream?match_id=' + match_id,
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
  getEventStreamedMatches(event_id: any, category_id: any, type: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.get(environment.global_url + 'tms/get_event_live_matches?event_id=' + event_id + '&category_id=' + category_id + '&type=' + type,
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
  getEventLiveMatches(event_id: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.get(environment.global_url + 'tms/get_event_live_matches?event_id=' + event_id + '&type=live',
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
