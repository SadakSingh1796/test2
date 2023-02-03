import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CommonApiService {
  //This Service Is Only For Common API Methods
  constructor(private readonly httpClient: HttpClient) { }
  
  getCityList(state_id: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.httpClient.get(environment.global_url+'get_cities?state_id=' + state_id, {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map(
      (response: any) => {
        return response;
      })
      ,);
  }
  getStateList(country_id: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.httpClient.get(environment.global_url+'get_states?country_id=' + country_id, {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map(
      (response: any) => {
        return response;
      })
      ,);
  }
  getCountriesList() {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.httpClient.get(environment.global_url+'get_countries', {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map(
      (response: any) => {
        return response;
      })
      ,);
  }
  convertUTCDateToLocalDate(date:any) {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(),  date.getHours(), date.getMinutes(), date.getSeconds()));

}
}
