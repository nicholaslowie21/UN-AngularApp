import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from './services/token-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunicationService } from './services/communication.service';
import { MessageService } from 'primeng/api';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MessageService]
})
export class AppComponent implements OnInit {
  private role: string;
  isLoggedIn = false;
  user: any;
  username: string;
  userType: any;
  showAdmin = false;
  showNavBar = true;
  showChatButton = true;

  isNotifOpen = false;
  notifications = [];
  hasNewNotif = false;

  chatStatus: any;
  chatRooms = [];
  selectedChatRoom: any;
  selectedChatImg: any;
  chatMsgs = [];
  chatForm: any = {};

  chatRoomsAdmin = [];
  displayChatRooms = [];
  selectedChatType = '';
  totalUnreadRooms = 0;

  constructor(private tokenStorageService: TokenStorageService, private route: ActivatedRoute,
    private router: Router, private communicationService: CommunicationService, private messageService: MessageService) {
  }

  async ngOnInit() {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    console.log(this.tokenStorageService.getToken())

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.user = user;
      if(this.tokenStorageService.getAccountType() == 'user') {
        this.userType = 'individual';
      } else {
        this.userType = 'institution';
      }
      this.role = user.role;
      console.log(this.role);
      if (this.role == 'admin') {
        this.showAdmin = true;
      } else if (this.role == 'regionaladmin') {
        this.showAdmin = true;
      } else if (this.role == 'adminlead') {
        this.showAdmin = true;
      }

      this.username = user.username;

      await this.communicationService.checkNewNotifications().toPromise().then(
        res => this.hasNewNotif = res.data.gotNew
      );
      await this.loadChat();
    }
  }

  async loadChat() {
    this.chatStatus = this.tokenStorageService.getChatStatus();
    console.log(this.chatStatus);

    await this.communicationService.getFilteredChatRoomsList({ type: 'normal' }).toPromise().then(
      res => this.chatRooms = res.data.chatRooms
    );

    await this.communicationService.getFilteredChatRoomsList({ type: 'admin' }).toPromise().then(
      res => this.chatRoomsAdmin = res.data.chatRooms
    );

    console.log(this.chatRooms);
    console.log(this.chatRoomsAdmin);

    
      if(this.chatStatus.selectedChatType == 'user') {
        this.displayChatRooms = this.chatRooms;
      } else {
        this.displayChatRooms = this.chatRoomsAdmin;
      }
    

    if (this.chatStatus.status == 'room') {
      await this.communicationService.getChatMsgs({ id: this.chatStatus.id }).toPromise().then(
        res => {
          this.selectedChatImg = res.data.targetImg;
          this.selectedChatRoom = res.data.chatRoom;
          this.chatMsgs = res.data.chats;
        }
      );
    }
    console.log(this.selectedChatRoom);
    console.log(this.chatMsgs);
    this.countTotalUnreadRooms();
  }

  countTotalUnreadRooms() {
    this.totalUnreadRooms = 0;
    for(var i=0; i<this.chatRooms.length; i++) {
      if(this.chatRooms[i].user1username == this.username && this.chatRooms[i].user1read == false) {
        this.totalUnreadRooms += 1;
      } else if(this.chatRooms[i].user2username == this.username && this.chatRooms[i].user2read == false) {
        this.totalUnreadRooms += 1;
      }
    }

    for(var i=0; i<this.chatRoomsAdmin.length; i++) {
      if(this.chatRoomsAdmin[i].user1username == this.username && this.chatRoomsAdmin[i].user1read == false) {
        this.totalUnreadRooms += 1;
      } else if(this.chatRoomsAdmin[i].user2username == this.username && this.chatRoomsAdmin[i].user2read == false) {
        this.totalUnreadRooms += 1;
      }
    }

    return this.totalUnreadRooms;
  }

  onActivate(event: any): void {
    if (event.isShareProfile) {
      this.showNavBar = false;
    }
    if(event.isChatPage) {
      this.showChatButton = false;
    }
  }

  toggleNotif(): void {
    this.isNotifOpen = !this.isNotifOpen;
    if(this.isNotifOpen == true) {
      this.loadNotif();
    }
  }

  loadNotif(): void {
    this.communicationService.getNotifications().toPromise().then(
      res => this.notifications = res.data.notifications
    );
    this.hasNewNotif = false;

    console.log(this.notifications);
  }

  formatDate(date): any {
    let formattedDate = new Date(date).toUTCString();
    return formattedDate.substring(5, formattedDate.length-13);
  }

  logout(): void {
    this.tokenStorageService.logOut();
    window.location.reload();
  }

  openChatPopUp(): void {
    this.tokenStorageService.setChatStatus({ status: "open", selectedChatType: "user" });
    this.chatStatus = this.tokenStorageService.getChatStatus();
    this.loadChat();
  }

  closeChatPopUp(): void {
    this.tokenStorageService.setChatStatus({ status: "close" });
    this.chatStatus = this.tokenStorageService.getChatStatus();
    this.loadChat();
  }

  openChatRoom(roomId): void {
    this.tokenStorageService.setChatStatus({ status: "room", id: roomId, selectedChatType: this.chatStatus.selectedChatType });
    this.chatStatus = this.tokenStorageService.getChatStatus();
    this.loadChat();
  }

  closeChatRoom(): void {
    if(this.selectedChatRoom.chatType == 'admin') this.chatStatus.selectedChatType = 'admin';
    else  this.chatStatus.selectedChatType = 'user';
    this.tokenStorageService.setChatStatus({ status: "open", selectedChatType: this.chatStatus.selectedChatType });
    this.chatStatus = this.tokenStorageService.getChatStatus();
    this.loadChat();
  }

  onChangeChatType(): void {
    this.tokenStorageService.setChatStatus({ status: "open", selectedChatType: this.chatStatus.selectedChatType });
    this.loadChat();
  }

  sendMsg(): void {
    if (this.chatForm.message.length == 0) {
      return;
    }
    this.communicationService.sendChatMsg({ roomId: this.selectedChatRoom.id, message: this.chatForm.message }).subscribe(
      response => {
        this.chatForm.message = "";
        this.loadChat();
      }, err => {
        this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:err.error.msg});
      }
    )
  }

  formatTime(date): any {
    let formattedDate = moment(date).format("MMM DD");
    let formattedTime = moment(date).format("h:mm a");
    return formattedTime + ' | ' + formattedDate;
  }

  sortFunction(a, b) {
    var dateA = new Date(a.updatedAt).getTime();
    var dateB = new Date(b.updatedAt).getTime();
    return dateA > dateB ? -1 : 1;
  }

}
