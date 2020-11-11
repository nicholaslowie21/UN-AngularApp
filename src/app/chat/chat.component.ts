import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../services/token-storage.service';
import { CommunicationService } from '../services/communication.service';
import { MessageService } from 'primeng/api';
import { interval } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  providers: [MessageService]
})
export class ChatComponent implements OnInit {

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
  searchForm: any = {};

  source: any;
  subscribe: any;

  constructor(private tokenStorageService: TokenStorageService, private communicationService: CommunicationService, 
    private messageService: MessageService) {
    this.source = interval(3000);
  }

  async ngOnInit() {
    let user = this.tokenStorageService.getUser();
    this.username = user.username;
    let role = user.role;
    if(role == 'adminlead' || role == 'admin' || role == 'regionaladmin') {
      this.isAdmin = true;
    }

    // this.chatStatus = this.tokenStorageService.getChatStatus();
    // console.log(this.chatStatus);
    await this.loadRooms();
  }

  startTimer(id) {
    if(this.subscribe) {
      this.subscribe.unsubscribe();
    }
    
    this.subscribe = this.source.subscribe(() => {
      this.openChatRoom(id);
        console.log("timer is running");
      }
    );
  }

  async loadRooms() {
    await this.communicationService.getFilteredChatRoomsList({ type: 'normal' }).toPromise().then(
      res => this.chatRooms = res.data.chatRooms
    );

    await this.communicationService.getFilteredChatRoomsList({ type: 'admin' }).toPromise().then(
      res => this.chatRoomsAdmin = res.data.chatRooms
    );

    if(this.isAdmin == true) {
      if(this.selectedChatType == 'user') {
        this.displayChatRooms = this.chatRooms;
      } else {
        this.displayChatRooms = this.chatRoomsAdmin;
      }
    } else {
      this.displayChatRooms = this.chatRooms.concat(this.chatRoomsAdmin);
      this.displayChatRooms.sort(this.sortFunction);
    }

    console.log(this.chatRooms)
    console.log(this.chatRoomsAdmin)
  }

  async openChatRoom(roomId) {
    await this.communicationService.getChatMsgs({ id: roomId }).toPromise().then(
      res => {
        this.selectedChatImg = res.data.targetImg;
        this.selectedChatRoom = res.data.chatRoom;
        this.chatMsgs = res.data.chats;
      }
    );
    console.log(this.selectedChatRoom)
    this.loadRooms();
  }

  sendMsg(): void {
    if (this.chatForm.message.length == 0) {
      return;
    }
    this.communicationService.sendChatMsg({ roomId: this.selectedChatRoom.id, message: this.chatForm.message }).subscribe(
      response => {
        this.chatForm.message = "";
        this.openChatRoom(this.selectedChatRoom.id);
      }, err => {
        this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:err.error.msg});
      }
    )
  }

  searchChat(): void {
    
  }

  onChangeChatType(): void {
    this.loadRooms();
  }

  formatDate(date): any {
    let formattedDate = new Date(date).toDateString();
    return formattedDate.substring(4, formattedDate.length-5);
  }

  sortFunction(a, b) {
    var dateA = new Date(a.updatedAt).getTime();
    var dateB = new Date(b.updatedAt).getTime();
    return dateA > dateB ? -1 : 1;
  }

}
