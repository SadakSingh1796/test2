import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { AnyMxRecord } from 'dns';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EncyptDecryptService } from '../EncryptDecrypt/encypt-decrypt.service';
@Injectable({
  providedIn: 'root'
})
export class EventsService {
  token: any="";
  
  event_id: any;
  constructor(private readonly httpClient: HttpClient, private encyptDecryptService: EncyptDecryptService) {
    this.event_id = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    this.token = localStorage.getItem('reqToken');
    }
  
  createEvents(data: any) {
    const reqHeader = new HttpHeaders({
      'enctype': 'multipart/form-data',
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.post(environment.global_url + 'tms/create_event', data,
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

  getDefaultBanners() {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.get(environment.global_url + 'tms/get_events_banners',
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

  updateEventImage(eventId: any, formData: any) {
    const reqHeader = new HttpHeaders({
      'enctype': 'multipart/form-data',
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.patch(environment.global_url + 'tms/update_event_image?event_id=' + eventId, formData,
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
  // updateEventImage(eventId: any, formData: any) {
  //   const reqHeader = new HttpHeaders({
  //     'enctype': 'multipart/form-data',
  //     'Authorization': 'Bearer ' + this.token
  //   });
  //   return this.httpClient.post(environment.global_url+'file_upload?path=event/'+eventId+'/',formData,
  //     {
  //       headers: reqHeader,
  //       params: {

  //       },
  //       observe: 'response',
  //     }
  //   ).pipe(
  //     map((response: any) => {
  //       return response;
  //     }));
  // }

  addCategoryClass(): Observable<any> {
    return this.httpClient.get("assets/JsonData/EventScreenWeb/rulesSetting.json");
  }

  getRegistrations(): Observable<any> {
    return this.httpClient.get("assets/JsonData/EventScreenWeb/registrationForm.json");
  }

  updateRegistrationFees(item: any, event_id: number): Observable<any> {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });

    return this.httpClient.patch(environment.global_url + 'tms/update_categories_registration_and_price/?event_id=' + event_id, item,
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
  /*get Ongoing Events*/
  getEventsinArray() {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.get(environment.global_url + 'tms/get_home_events',
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

  getEventsinArrayHome() {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.httpClient.get(environment.global_url + 'tms/get_home_events?published=true',
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

  deleteEvents(id: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.delete(environment.global_url + 'tms/delete_event?event_id=' + id,
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

  updateEvents(updatedData: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.put(environment.global_url + 'tms/update_event', updatedData,
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
  getOfficialList(eventId: any) {
    const reqHeader = new HttpHeaders({
      'enctype': 'multipart/form-data',
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.get("http://api.stupaevents.com:8005/user/get_officials?event_id=" + eventId,
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
  addEventOfficial(event_id: any, data: any) {


    const reqHeader = new HttpHeaders({
      'enctype': 'multipart/form-data',
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.post("http://api.stupaevents.com:8005/tms/add_event_officials/?event_id=" + event_id, data,
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
  getEventOfficial(event_id: any, eventState: any) {
    const reqHeader = new HttpHeaders({
      'enctype': 'multipart/form-data',
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.get("http://api.stupaevents.com:8005/tms/get_event_officials?event_id=" + event_id + "&is_active=" + eventState,
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
  getParticipantTypeAndCategories(event_id: number) {

    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.get(environment.global_url + "tms/get_participant_types_and_categories/?event_id=" + event_id, {
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
  removeOfficial(event_id: any, data: any) {


    const reqHeader = new HttpHeaders({
      'enctype': 'multipart/form-data',
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.delete("http://api.stupaevents.com:8005/tms/remove_event_officials?event_id=" + event_id,
      {
        headers: reqHeader,
        body: data,
        params: {

        },
        observe: 'response',
      }
    ).pipe(
      map((response: any) => {
        return response;
      }));
  }
  getPlayers(eventId: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    var url;
    if (eventId == null) {
      url = 'user/get_players'
    }
    else {

      url = 'user/get_players?event_id='+eventId
    }

    return this.httpClient.get(environment.global_url + url,
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
  registerParticipants(data: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.post(environment.global_url + 'tms/register_order_participants', data,
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
  getGroupList(event_id: any, category_id: any, group_type: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.get(environment.global_url + "tms/get_group_details?event_id=" + event_id + "&category_id=" + category_id + "&group_type=" + group_type, {
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
  generateFixtures(data: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.post(environment.global_url + 'tms/generate_fixtures', data,
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
  deleteFixtures(category_id: any, event_id: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.delete(environment.global_url + 'tms/delete_groups?category_id=' + category_id + '&event_id=' + event_id,
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
  createTeam(data: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.post(environment.global_url + 'tms/create_team', data,
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
  createCustomGroups(data: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.post(environment.global_url + 'tms/create_custom_groups', data,
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
  lockGroup(event_id: any, category_id: any) {
    const data = {}
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.patch(environment.global_url + 'tms/lock_groups?event_id=' + event_id + '&category_id=' + category_id + '&group_type=' + 1, data,
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
  createMatches(event_id: any, category_id: any, group_type: any) {
    const data = {}
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.post(environment.global_url + 'tms/create_matches?event_id=' + event_id + '&category_id=' + category_id + '&group_type=' + group_type, data,
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
  getGroupMatchDetails(event_id: any, category_id: any, group_type: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.get(environment.global_url + "tms/get_group_matches_details?event_id=" + event_id + "&category_id=" + category_id + "&group_type=" + group_type + '&version=v1', {
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
  getGroupMatchDetailsV2(event_id: any, category_id: any, group_type: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.get(environment.global_url + "tms/get_group_matches_details?event_id=" + event_id + "&category_id=" + category_id + "&group_type=" + group_type + '&version=v2', {
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
  getEventRegistedPlayers(event_id: any, participant_type_id: any, category_id: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.get(environment.global_url + "tms/get_event_registered_participants?event_id=" + event_id + "&participant_type_id=" + participant_type_id + "&category_id=" + category_id, {
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
  getDetailsByEventId() {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.httpClient.get(environment.global_url + 'tms/get_events',
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
  updateScore(data: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.patch(environment.global_url + 'tms/update_score', data,
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
  updateProspectus(image: any, event_id: any) {

    const datta = {}
    const reqHeader = new HttpHeaders({
      'enctype': 'multipart/form-data',
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken'),
    });
    return this.httpClient.patch(environment.global_url + 'tms/update_event_prospectus_image_url/?event_id=' + event_id, image,
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
  // updateProspectus( event_id: any,image: any,) {

  //   const datta = {}
  //   const reqHeader = new HttpHeaders({
  //     'enctype': 'multipart/form-data',
  //     'Authorization': 'Bearer ' + this.token,
  //   });
  //   return this.httpClient.post(environment.global_url + 'file_upload?path=event/'+event_id+'/',image,
  //     {
  //       headers: reqHeader,
  //       params: {},
  //       observe: 'response',
  //     }
  //   ).pipe(
  //     map((response: any) => {
  //       return response;
  //     }));
  // }
  createDayPlanner(data: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.post(environment.global_url + 'tms/create_event_planner', data,
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
  updateDayPlanner(data: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.patch(environment.global_url + 'tms/update_event_planner', data,
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

  getPlannerDates(event_id: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.get(environment.global_url + 'tms/get_planner_dates?event_id=' + event_id,
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
  getEventPlannerDetails(event_id: any, planner_id: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.get(environment.global_url + 'tms/get_event_planner_details?event_id=' + event_id + '&planner_id=' + planner_id,
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
  // http://api.stupaevents.com:8005/tms/delete_match_slot?event_id=1&planner_id=12&slot_id=12&match_id=21
  deleteMatchSlot(event_id: any, planner_id: any, slot_id: any, match_id: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.delete(environment.global_url + 'tms/delete_match_slot?event_id=' + event_id + '&planner_id=' + planner_id + '&slot_id=' + slot_id + '&match_id=' + match_id,
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
  getSlotMatches(event_id: any, category_id: any, planner_id: any, status: any, start_time: any, end_time: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.get(environment.global_url + 'tms/get_slot_matches?event_id=' + event_id + '&category_id=' + category_id + '&planner_id=' + planner_id + '&status=' + status + '&start_time=' + start_time + '&end_time=' + end_time,
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
  updateMatchSlot(slotDetails: any) {
    const data = {}
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.patch(environment.global_url + 'tms/update_match_slot', slotDetails,
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
  createTeamMatches(data: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.post(environment.global_url + 'tms/create_team_matches', data,
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
  getTeamParticipantsDetails(event_id: any, category_id: any, match_id: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.get(environment.global_url + 'tms/get_team_participants_details?event_id=' + event_id + '&category_id=' + category_id + '&match_id=' + match_id,
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
  getTeamMatches(event_id: any, parent_match_id: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.get(environment.global_url + 'tms/get_team_matches?event_id=' + event_id + '&parent_match_id=' + parent_match_id,
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
  updateTeamScore(scoreDetails: any) {
    const data = {}
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.patch(environment.global_url + 'tms/update_team_score', scoreDetails,
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
  createRanking(event_id: any, category_id: any) {
    const data = {}
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.post(environment.global_url + 'tms/generate_rank?event_id=' + event_id + '&category_id=' + category_id, data,
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

  getCategoryRanking(event_id: any, category_id: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.get(environment.global_url + 'tms/get_category_ranking?event_id=' + event_id + '&category_id=' + category_id,
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
  getGroupResults(event_id: any, category_id: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.get(environment.global_url +'tms/get_group_results?event_id='+ event_id+'&category_id='+category_id,{
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
