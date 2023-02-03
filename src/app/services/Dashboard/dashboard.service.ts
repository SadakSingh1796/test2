import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EncyptDecryptService } from '../EncryptDecrypt/encypt-decrypt.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService implements OnInit{
  token: any = '';
  constructor(private readonly httpClient: HttpClient, private encyptDecryptService: EncyptDecryptService) {
    
  }
  ngOnInit(): void {
    this.token = localStorage.getItem('reqToken');
  }
  getTeams() {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    })
    return this.httpClient.get(environment.global_url + "tms/get_teams", {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map((response: any) => {
      return response;
    })
    );
  }

  deleteTeams(deletedTeamId: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    })
    return this.httpClient.delete(environment.global_url + "tms/delete_team?team_id=" + deletedTeamId, {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map((response: any) => {
      return response;
    })
    );
  }

  updateTeam(data: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.patch(environment.global_url + 'tms/update_team', data,
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
  getTeamsByParticipantID(participantId: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    })
    return this.httpClient.get(environment.global_url + "tms/get_teams?participant_type_id=" + participantId, {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map((response: any) => {
      return response;
    })
    );
  }
  duplicateTeamName(teamName: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    })
    return this.httpClient.get(environment.global_url + "tms/check_duplicate_team_name?name=" + teamName, {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map((response: any) => {
      return response;
    })
    );
  }
  getTeamsByParticipantIDAndEventId(participantId: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    })
    return this.httpClient.get(environment.global_url + "tms/get_teams?participant_type_id=" + participantId + '&event_id=' + this.encyptDecryptService.decryptUsingAES256(
      localStorage.getItem('event_id')
    ), {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map((response: any) => {
      return response;
    })
    );
  }
}
