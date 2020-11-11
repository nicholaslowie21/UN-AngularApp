import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../services/token-storage.service';
import { CommunicationService } from '../services/communication.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  providers: [MessageService]
})
export class ChatComponent implements OnInit {

  isChatPage = true;
  isAdmin = false;
  
  chatStatus: any;
  chatRooms = [];
  chatRoomsAdmin = [];
  displayChatRooms = [];

  selectedChatRoom: any;
  selectedChatImg: any;
  chatMsgs = [];

  constructor(private tokenStorageService: TokenStorageService, private communicationService: CommunicationService, private messageService: MessageService) { }

  async ngOnInit() {
    let role = this.tokenStorageService.getUser().role;
    if(role == 'adminlead' || role == 'admin' || role == 'regionaladmin') {
      this.isAdmin = true;
    }

    this.chatStatus = this.tokenStorageService.getChatStatus();
    console.log(this.chatStatus);

    await this.communicationService.getChatRoomsList({ type: 'normal' }).toPromise().then(
      res => this.chatRooms = res.data.chatRooms
    );

    await this.communicationService.getChatRoomsList({ type: 'admin' }).toPromise().then(
      res => this.chatRoomsAdmin = res.data.chatRooms
    );

    if(this.isAdmin == true) {
      if(this.chatStatus.selectedChatType == 'user') {
        this.displayChatRooms = this.chatRooms;
      } else {
        this.displayChatRooms = this.chatRoomsAdmin;
      }
    } else {
      this.displayChatRooms = this.chatRooms.concat(this.chatRoomsAdmin);
      this.displayChatRooms.sort(this.sortFunction);
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
  }

  sortFunction(a, b) {
    var dateA = new Date(a.updatedAt).getTime();
    var dateB = new Date(b.updatedAt).getTime();
    return dateA > dateB ? -1 : 1;
  }

}
