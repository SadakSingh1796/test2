import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BannerManagementService {
  token: string | null;

  constructor(private readonly httpClient: HttpClient) { this.token = localStorage.getItem('reqToken');}
  getPublish() {
    if(this.token == null){
    var reqHeader = new HttpHeaders({
        'Content-Type': 'application/json'
      });
    }
    else{
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('admToken')
    });
  }
    return this.httpClient.get("http://api.stupaevents.com:8005/asset/get_banners",{
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map(
      (response: any) => {
        return response;
      })
      ,);
  }
  publishBanner(formData: any,publishUnpublishImage:any) {
    const reqHeader = new HttpHeaders({
      'enctype': 'multipart/form-data',
      'Authorization': 'Bearer ' + localStorage.getItem('admToken') });
      return this.httpClient.post('http://api.stupaevents.com:8005/asset/create_banner?published='+ publishUnpublishImage, formData, {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map(
      (response: any) => {
        return response;
      })
      ,);
  }
  updateBanner(updatedArrangeView:any){
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('admToken') });
    return this.httpClient.post('http://api.stupaevents.com:8005/asset/update_banner', updatedArrangeView, {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map(
      (response: any) => {
        return response;
      })
      ,);
  }
  deleteBanner(banner_id:any){
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('admToken')  });
    return this.httpClient.post('http://api.stupaevents.com:8005/asset/delete_banner',banner_id,{
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map(
      (response: any) => {
        return response;
      })
      ,);
  }
}
