import { Component, OnInit } from '@angular/core';
import { CommunicationService } from '../services/communication.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  notifications = [];

  constructor(private communicationService: CommunicationService) { }

  async ngOnInit() {
    await this.communicationService.getNotifications().toPromise().then(
      res => this.notifications = res.data.notifications
    );

    console.log(this.notifications)
  }

}
