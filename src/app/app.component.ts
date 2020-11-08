import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from './services/token-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunicationService } from './services/communication.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MessageService]
})
export class AppComponent implements OnInit {
  private role: string;
  isLoggedIn = false;
  username: string;
  userType: any;
  showAdmin = false;
  showNavBar = true;

  chatStatus: any;
  chatRooms = [];
  selectedChatRoom: any;
  selectedChatImg: any;
  chatMsgs = [];
  chatForm: any = {};

  chatRoomsAdmin = [];
  displayChatRooms = [];
  selectedChatType: any;

  constructor(private tokenStorageService: TokenStorageService, private route: ActivatedRoute,
    private router: Router, private communicationService: CommunicationService, private messageService: MessageService) {
  }

  async ngOnInit() {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      if (this.tokenStorageService.getAccountType() == 'user') {
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

      this.selectedChatType = 'user';
      await this.loadChat();
    }
  }

  async loadChat() {
    this.chatStatus = this.tokenStorageService.getChatStatus();
    console.log(this.chatStatus);

    await this.communicationService.getChatRoomsList({ type: 'normal' }).toPromise().then(
      res => this.chatRooms = res.data.chatRooms
    );

    await this.communicationService.getChatRoomsList({ type: 'admin' }).toPromise().then(
      res => this.chatRoomsAdmin = res.data.chatRooms
    );

    console.log(this.chatRooms);
    console.log(this.chatRoomsAdmin);

    if(this.showAdmin == true) {
      if(this.selectedChatType == 'user') {
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
    console.log(this.selectedChatRoom);
    console.log(this.chatMsgs);
  }

  onActivate(event: any): void {
    if (event.isShareProfile) {
      this.showNavBar = false;
    }
  }

  logout(): void {
    this.tokenStorageService.logOut();
    window.location.reload();
  }

  openChatPopUp(): void {
    this.tokenStorageService.setChatStatus({ status: "open" });
    this.chatStatus = this.tokenStorageService.getChatStatus();
  }

  closeChatPopUp(): void {
    this.tokenStorageService.setChatStatus({ status: "close" });
    this.chatStatus = this.tokenStorageService.getChatStatus();
  }

  openChatRoom(roomId): void {
    this.tokenStorageService.setChatStatus({ status: "room", id: roomId });
    this.chatStatus = this.tokenStorageService.getChatStatus();
    this.loadChat();
  }

  closeChatRoom(): void {
    this.tokenStorageService.setChatStatus({ status: "open" });
    this.chatStatus = this.tokenStorageService.getChatStatus();
  }

  onChangeChatType(): void {
    if(this.selectedChatType == "user") {
      this.displayChatRooms = this.chatRooms;
    } else {
      this.displayChatRooms = this.chatRoomsAdmin;
    }
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

  sortFunction(a, b) {
    var dateA = new Date(a.updatedAt).getTime();
    console.log("DATE A" + dateA);
    var dateB = new Date(b.updatedAt).getTime();
    return dateA > dateB ? -1 : 1;
  }

}
