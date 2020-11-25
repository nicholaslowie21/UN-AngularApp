import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TokenStorageService } from '../services/token-storage.service';
import { CommunicationService } from '../services/communication.service';
import { MessageService } from 'primeng/api';
import { interval } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  providers: [MessageService]
})
export class ChatComponent implements OnInit {

  @ViewChild('messageArea')
  messageArea: ElementRef<HTMLElement>;

  isChatPage = true;
  isAdmin = false;
  username: any;

  chatStatus: any;
  chatRooms = [];
  chatRoomsAdmin = [];
  displayChatRooms = [];

  selectedChatRoom: any;
  selectedChatImg: any;
  selectedChatType = 'user';
  chatMsgs = [];
  chatForm: any = {};
  searchForm: any = {keyword: ''};

  source: any;
  subscribe: any;

  constructor(private tokenStorageService: TokenStorageService, private communicationService: CommunicationService,
    private messageService: MessageService) {
    this.source = interval(1000);
  }

  async ngOnInit() {
    let user = this.tokenStorageService.getUser();
    this.username = user.username;
    let role = user.role;
    if (role == 'adminlead' || role == 'admin' || role == 'regionaladmin') {
      this.isAdmin = true;
    }

    // this.chatStatus = this.tokenStorageService.getChatStatus();
    // console.log(this.chatStatus);
    await this.loadRooms();
  }

  async startTimer(id) {
    if (this.subscribe) {
      this.subscribe.unsubscribe();
    }

    // this.scrollToLastMessage();

    this.subscribe = await this.source.subscribe(async () => {
      console.log("timer is running");
      await this.getMessages(id);
    });
  }

  async loadRooms() {
    console.log("LOAD ROOMS")
    await this.communicationService.getFilteredChatRoomsList({ type: 'normal' }).toPromise().then(
      res => this.chatRooms = res.data.chatRooms
    );

    await this.communicationService.getFilteredChatRoomsList({ type: 'admin' }).toPromise().then(
      res => this.chatRoomsAdmin = res.data.chatRooms
    );

      if (this.selectedChatType == 'user') {
        this.displayChatRooms = this.chatRooms;
      } else {
        this.displayChatRooms = this.chatRoomsAdmin;
      }

    // console.log(this.chatRooms)
    // console.log(this.chatRoomsAdmin)
  }

  async openChatRoom(roomId) {
    // await this.getMessages(roomId);
    this.loadRooms();
    this.startTimer(roomId);
    this.scrollToLastMessage();
  }

  async getMessages(roomId) {
    let oldMsgsLength = this.chatMsgs.length;
    console.log("OLD "+oldMsgsLength);
    await this.communicationService.getChatMsgs({ id: roomId }).toPromise().then(
      res => {
        this.selectedChatImg = res.data.targetImg;
        this.selectedChatRoom = res.data.chatRoom;
        this.chatMsgs = res.data.chats;
        this.loadRooms();
        console.log("NEW "+this.chatMsgs.length);
        if(oldMsgsLength < this.chatMsgs.length) {
          console.log("SCROLL INSIDE TIMER")
          this.scrollToLastMessage();
        }
      }
    );
    
    // this.scrollToLastMessage();
  }

  sendMsg() {
    if (this.chatForm.message.length == 0) {
      return;
    }
    this.communicationService.sendChatMsg({ roomId: this.selectedChatRoom.id, message: this.chatForm.message }).subscribe(
      async response => {
        this.chatForm.message = "";
        await this.getMessages(this.selectedChatRoom.id);
        this.scrollToLastMessage();
      }, err => {
        this.messageService.add({ key: 'toastMsg', severity: 'error', summary: 'Error', detail: err.error.msg });
      }
    )
  }

  async searchChat() {
    console.log("SEARCH CHAT")
    await this.loadRooms();
    if(this.searchForm.keyword.length == 0) {
      return;
    }
    if (this.searchForm.keyword.length > 0) {
      let arr = [];
      for (var i = 0; i < this.displayChatRooms.length; i++) {
        if (this.displayChatRooms[i].user1username != this.username && this.displayChatRooms[i].user1username.includes(this.searchForm.keyword)) {
          arr.push(this.displayChatRooms[i]);
        } else if (this.displayChatRooms[i].user2username != this.username && this.displayChatRooms[i].user2username.includes(this.searchForm.keyword)) {
          arr.push(this.displayChatRooms[i]);
        }
      }
      this.displayChatRooms = arr;
    }
  }

  clearSearch(): void {
    this.searchForm.keyword = '';
    this.loadRooms();
  }

  scrollToLastMessage() {
    console.log("SCROLL");
    if (this.messageArea) {
      console.log(this.messageArea)
      console.log(this.messageArea.nativeElement.scrollTop);
      console.log(this.messageArea.nativeElement.scrollHeight);
      this.messageArea.nativeElement.scrollTop = this.messageArea.nativeElement.scrollHeight + 500;
    }
  }

  onChangeChatType(): void {
    this.loadRooms();
  }

  formatDate(date): any {
    let formattedDate = new Date(date).toDateString();
    return formattedDate.substring(4, formattedDate.length - 5);
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
