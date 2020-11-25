import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'https://localhost:8080/api/communication';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  constructor(private http: HttpClient) { }

  createAnnouncement(data): Observable<any> {
    return this.http.post(API_URL + '/createAnnouncement', {
      title: data.title,
      desc: data.desc
    }, httpOptions);
  }

  editAnnouncement(data): Observable<any> {
    return this.http.post(API_URL + '/editAnnouncement', {
      announcementId: data.id,
      title: data.title,
      desc: data.desc
    }, httpOptions);
  }

  deleteAnnouncement(data): Observable<any> {
    return this.http.delete(API_URL + '/deleteAnnouncement?announcementId=' + data.id);
  }

  getAnnouncements(): Observable<any> {
    return this.http.get(API_URL + '/announcement');
  }

  getNotifications(): Observable<any> {
    return this.http.get(API_URL + '/notifications');
  }

  checkNewNotifications(): Observable<any> {
    return this.http.get(API_URL + '/gotNewNotif');
  }
  chatAccount(data): Observable<any> {
    return this.http.post(API_URL + '/chat/chatAccount', {
      chatType: data.chatType,
      targetId: data.targetId,
      targetType: data.targetType
    }, httpOptions);
  }

  sendChatMsg(data): Observable<any> {
    return this.http.post(API_URL + '/chat/send', {
      roomId: data.roomId,
      message: data.message
    }, httpOptions);
  }

  getChatRoomsList(): Observable<any> {
    return this.http.get(API_URL + '/chat/rooms');
  }

  getFilteredChatRoomsList(data): Observable<any> {
    return this.http.get(API_URL + '/chat/filtered/rooms?chatType=' + data.type);
  }

  getChatMsgs(data): Observable<any> {
    return this.http.get(API_URL + '/chat/chats?roomId=' + data.id);
  }
}
