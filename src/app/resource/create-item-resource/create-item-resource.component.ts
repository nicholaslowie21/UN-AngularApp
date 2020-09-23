import { Component, OnInit } from '@angular/core';
import { ResourceService } from '../../services/resource.service';

@Component({
  selector: 'app-create-item-resource',
  templateUrl: './create-item-resource.component.html',
  styleUrls: ['./create-item-resource.component.css']
})
export class CreateItemResourceComponent implements OnInit {

  form: any = {};
  isSuccessful = false;
  createFailed = false;
  errorMessage = '';

  constructor(private resourceService: ResourceService) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    console.log(this.form);
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
  }

}
