import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TokenStorageService } from './services/token-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunicationService } from './services/communication.service';
import { MessageService } from 'primeng/api';
import * as moment from 'moment';
import { interval } from 'rxjs';

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

  source: any;
  subscribe: any;

  sourceRoom: any;
  subscribeRoom: any;

  @ViewChild('messageArea')
  messageArea: ElementRef<HTMLElement>;

  constructor(private tokenStorageService: TokenStorageService, private route: ActivatedRoute,
    private router: Router, private communicationService: CommunicationService, private messageService: MessageService) {
    this.source = interval(1000);
    this.sourceRoom = interval(1000);
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

      this.communicationService.checkNewNotifications().toPromise().then(
        res => this.hasNewNotif = res.data.gotNew
      );

      this.username = user.username;
      await this.loadChat();
    }
    console.log(this.showChatButton)
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
    let formattedDate = moment(date).format("DD MMM YYYY");
    let formattedTime = moment(date).format("h:mm a");
    return formattedDate + " | " + formattedTime;
  }

  logout(): void {
    this.tokenStorageService.logOut();
    window.location.reload();
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

    if(this.chatStatus.status == 'open') {
      this.startTimerRoom();
    }
    if(this.chatStatus.status == 'room') {
      await this.getMessages();
      this.startTimer();
    }

    console.log(this.selectedChatRoom);
    this.countTotalUnreadRooms();
  }

  async getMessages() {
    await this.communicationService.getChatMsgs({ id: this.chatStatus.id }).toPromise().then(
      res => {
        this.selectedChatImg = res.data.targetImg;
        this.selectedChatRoom = res.data.chatRoom;
        this.chatMsgs = res.data.chats;
      }
    );
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

  async startTimer() {
    if (this.subscribe) {
      this.subscribe.unsubscribe();
    }

    this.subscribe = await this.source.subscribe(async () => {
      console.log("timer is running");
      await this.getMessages();
    });
  }

  async startTimerRoom() {
    if (this.subscribeRoom) {
      this.subscribeRoom.unsubscribe();
    }

    this.subscribeRoom = await this.sourceRoom.subscribe(async () => {
      console.log("room timer is running");
      await this.loadChat();
    });
  }

  openChatPopUp(): void {
    this.tokenStorageService.setChatStatus({ status: "open", selectedChatType: "user" });
    // this.chatStatus = this.tokenStorageService.getChatStatus();
    // this.loadChat();
    this.startTimerRoom();
  }

  closeChatPopUp(): void {
    this.tokenStorageService.setChatStatus({ status: "close" });
    // this.chatStatus = this.tokenStorageService.getChatStatus();
    this.loadChat();
    if (this.subscribe) {
      this.subscribe.unsubscribe();
    }
    if (this.subscribeRoom) {
      this.subscribeRoom.unsubscribe();
    }
  }

  async openChatRoom(roomId) {
    this.tokenStorageService.setChatStatus({ status: "room", id: roomId, selectedChatType: this.chatStatus.selectedChatType });
    this.chatStatus = this.tokenStorageService.getChatStatus();
    // this.loadChat();
    await this.startTimer();
    this.scrollToLastMessage();
  }

  closeChatRoom(): void {
    if(this.selectedChatRoom.chatType == 'admin') this.chatStatus.selectedChatType = 'admin';
    else  this.chatStatus.selectedChatType = 'user';
    this.tokenStorageService.setChatStatus({ status: "open", selectedChatType: this.chatStatus.selectedChatType });
    // this.chatStatus = this.tokenStorageService.getChatStatus();
    // this.loadChat();
    if (this.subscribe) {
      this.subscribe.unsubscribe();
    }
    this.startTimerRoom();
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
        this.scrollToLastMessage();
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

  scrollToLastMessage() {
    console.log("SCROLL");
    if (this.messageArea) {
      this.messageArea.nativeElement.scrollTop = this.messageArea.nativeElement.scrollHeight + 500;
    }
  }

  sortFunction(a, b) {
    var dateA = new Date(a.updatedAt).getTime();
    var dateB = new Date(b.updatedAt).getTime();
    return dateA > dateB ? -1 : 1;
  }

}
