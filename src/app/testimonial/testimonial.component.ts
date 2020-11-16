import { Component, OnInit } from '@angular/core';
import { TestimonialService } from '../services/testimonial.service';
import { TokenStorageService } from '../services/token-storage.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-testimonial',
  templateUrl: './testimonial.component.html',
  styleUrls: ['./testimonial.component.css'],
  providers: [MessageService]
})
export class TestimonialComponent implements OnInit {

  myId: any;
  myType: any;
  myRequested = [];
  myPending = [];
  myOpen = [];

  giveReq = [];
  givePending = [];

  testiForm: any = {targetImg: ''};
  testiDesc = '';
  isGiveSuccessful = false;

  constructor(private testimonialService: TestimonialService, private tokenStorageService: TokenStorageService,
    private messageService: MessageService) { }

  async ngOnInit() {
    this.myId = this.tokenStorageService.getUser().id;
    this.myType = this.tokenStorageService.getAccountType();

    await this.testimonialService.getMyTestimonial({id: this.myId, type: this.myType, status: 'requested'}).toPromise().then(
      res => this.myRequested = res.data.testimonials
    );
    await this.testimonialService.getMyTestimonial({id: this.myId, type: this.myType, status: 'pending'}).toPromise().then(
      res => this.myPending = res.data.testimonials
    );
    await this.testimonialService.getMyTestimonial({id: this.myId, type: this.myType, status: 'open'}).toPromise().then(
      res => this.myOpen = res.data.testimonials
    );

    console.log(this.myRequested);
    console.log(this.myPending);
    console.log(this.myOpen);

    await this.testimonialService.getMyOutgoingTestimonials({id: this.myId, type: this.myType, status: 'requested'}).toPromise().then(
      res => this.giveReq = res.data.testimonials
    );
    await this.testimonialService.getMyOutgoingTestimonials({id: this.myId, type: this.myType, status: 'pending'}).toPromise().then(
      res => this.givePending = res.data.testimonials
    );

    console.log(this.giveReq);
    console.log(this.givePending);
  }

  updateMyTestimonialStatus(id, status): void {
    let r;
    if(status == 'open') {
      r = confirm("Are you sure you want to accept this testimonial?");
    } else {
      r = confirm("Are you sure you want to dismiss this testimonial?");
    }
    if (r == true) {
      this.testimonialService.updateMyTestimonialStatus({id: id, status: status}).subscribe(
        res => {
          this.ngOnInit();
          if(status == 'open') {
            this.messageService.add({key:'toastMsg', severity:'success', summary:'Success', detail:'Testimonial has been accepted successfully!'});
          } else {
            this.messageService.add({key:'toastMsg', severity:'success', summary:'Success', detail:'Testimonial has been dismissed successfully!'});
          }
        },
        err => {
          this.messageService.add({key:'toastMsg', severity:'error', summary:'Error', detail:err.error.msg});
        }
      );
    } else {
      return;
    }
  }

  getTestimonialInfo(t): void {
    this.isGiveSuccessful = false;
    this.testiForm = {
      targetImg: t.targetImg,
      targetName: t.targetName,
      targetType: t.targetType,
      targetUsername: t.targetUsername,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
      id: t.id,
      projectId: t.projectId,
      projectTitle: t.projectTitle
    }
  }

  updateOutgoingTestimonial(): void {
    this.testimonialService.updateMyOutgoingTestimonial({id: this.testiForm.id, status: 'pending', desc: this.testiDesc}).subscribe(
      res => {
        this.isGiveSuccessful = true;
        this.ngOnInit();
        this.testiDesc = '';
      },
      err => {
        this.messageService.add({key:'toastMsg', severity:'error', summary:'Error', detail:err.error.msg});
      }
    )
  }

  dismissOutgoing(id): void {
    let r = confirm("Are you sure you want to dismiss this testimonial?");
    if(r == true) {
      this.testimonialService.updateMyOutgoingTestimonial({id: id, status: 'dismissed', desc: ''}).subscribe(
        res => {
          this.ngOnInit();
          this.messageService.add({key:'toastMsg', severity:'success', summary:'Success', detail:'Testimonial has been dismissed successfully!'});
        },
        err => {
          this.messageService.add({key:'toastMsg', severity:'error', summary:'Error', detail:err.error.msg});
        }
      );
    } else {
      return;
    }
  }

  cancelOutgoing(id): void {
    let r = confirm("Are you sure you want to cancel this testimonial?");
    if(r == true) {
      this.testimonialService.updateMyOutgoingTestimonial({id: id, status: 'close', desc: ''}).subscribe(
        res => {
          this.ngOnInit();
          this.messageService.add({key:'toastMsg', severity:'success', summary:'Success', detail:'Testimonial has been cancelled successfully!'});
        },
        err => {
          this.messageService.add({key:'toastMsg', severity:'error', summary:'Error', detail:err.error.msg});
        }
      );
    } else {
      return;
    }
  } 

  formatDate(date): any {
    let formattedDate = new Date(date).toUTCString();
    return formattedDate.substring(5, formattedDate.length-13);
  }

}
