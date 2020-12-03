import { Component, OnInit } from '@angular/core';
import { CommunicationService } from '../../services/communication.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-admin-announcement',
  templateUrl: './admin-announcement.component.html',
  styleUrls: ['./admin-announcement.component.css'],
  providers: [MessageService]
})
export class AdminAnnouncementComponent implements OnInit {

  announcements = [];
  form: any = {};
  isCreateSuccessful = false;

  viewForm: any = {};
  isEdit = false;

  isDelSuccessful = false;

  sortField: string;
  sortOrder: number;
  sortKeyDate = '';
  sortOptions = [];

  constructor(private communicationService: CommunicationService, private messageService: MessageService) { }

  async ngOnInit() {
    await this.communicationService.getAnnouncements().toPromise().then(
      res => this.announcements = res.data.announcements
    );

    this.sortOptions = [
      {label: 'Date Newest to Oldest', value: '!updatedAt'},
      {label: 'Date Oldest to Newest', value: 'updatedAt'}
    ];

    this.isCreateSuccessful = false;
    this.isEdit = false;
    this.isDelSuccessful = false;
    console.log(this.announcements)
  }

  onSubmit(): void {
    console.log(this.form)
    this.communicationService.createAnnouncement(this.form).subscribe(
      res => {
        this.isCreateSuccessful = true;
        this.form.title = '';
        this.form.desc = '';
      },
      err => {
        this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:err.error.msg});
      }
    )
  }

  onUpdate(): void {
    this.communicationService.editAnnouncement(this.viewForm).subscribe(
      res => {
        this.isEdit = false;
        this.ngOnInit();
      },
      err => {
        this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:err.error.msg});
      }
    )
  }

  deleteAnnouncement(): void {
    let r = confirm("Are you sure you want to delete this announcement?");
    if(r == true) {
      this.communicationService.deleteAnnouncement({id: this.viewForm.id}).subscribe(
        res => {
          this.isDelSuccessful = true;
        },
        err => {
          this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:err.error.msg});
        }
      );
    } else {
      return;
    }
  }

  getAnnouncement(a): void {
    this.viewForm = {
      id: a.id,
      title: a.title,
      desc: a.desc,
      updatedAt: a.updatedAt
    }
  }

  clickEdit(): void {
    this.isEdit = true;
  }

  cancelEdit(): void {
    this.isEdit = false;
  }

  onSortDate(event) {
    let value = event.value;
    if (value.indexOf('!') === 0) {
        this.sortOrder = -1;
        this.sortField = value.substring(1, value.length);
    }
    else {
        this.sortOrder = 1;
        this.sortField = value;
    }
  }

  formatDate(date): any {
    let formattedDate = new Date(date).toUTCString();
    return formattedDate.substring(5, formattedDate.length-13);
  }

  closeModal(): void {
    this.ngOnInit();
  }

}
