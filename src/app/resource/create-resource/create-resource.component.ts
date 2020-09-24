import { Component, OnInit } from '@angular/core';
import { ResourceService } from '../../services/resource.service';

@Component({
  selector: 'app-create-resource',
  templateUrl: './create-resource.component.html',
  styleUrls: ['./create-resource.component.css']
})
export class CreateResourceComponent implements OnInit {

  form: any = {};
  isSuccessful = false;
  createFailed = false;
  errorMessage = '';
  resourceType = '';

  constructor(private resourceService: ResourceService) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    console.log(this.form);
    if (this.resourceType == 'Item') {
      this.resourceService.createItem(this.form).subscribe(
        response => {
          this.isSuccessful = true;
          this.createFailed = false;
        },
        err => {
          this.errorMessage = err.error.msg;
          this.createFailed = true;
        }
      );
    } else if (this.resourceType == 'Knowledge') {
      this.resourceService.createKnowledge(this.form).subscribe(
        response => {
          this.isSuccessful = true;
          this.createFailed = false;
        },
        err => {
          this.errorMessage = err.error.msg;
          this.createFailed = true;
        }
      );
    } else if (this.resourceType == 'Manpower') {
      this.resourceService.createManpower(this.form).subscribe(
        response => {
          this.isSuccessful = true;
          this.createFailed = false;
        },
        err => {
          this.errorMessage = err.error.msg;
          this.createFailed = true;
        }
      );
    } else if (this.resourceType == 'Venue') {
      this.resourceService.createVenue(this.form).subscribe(
        response => {
          this.isSuccessful = true;
          this.createFailed = false;
        },
        err => {
          this.errorMessage = err.error.msg;
          this.createFailed = true;
        }
      );
    }
  } 
}