import { Component, OnInit } from '@angular/core';
import { ResourceService } from '../../services/resource.service';

@Component({
  selector: 'app-create-manpower-resource',
  templateUrl: './create-manpower-resource.component.html',
  styleUrls: ['./create-manpower-resource.component.css']
})
export class CreateManpowerResourceComponent implements OnInit {

  form: any = {};
  isSuccessful = false;
  createFailed = false;
  errorMessage = '';

  constructor(private resourceService: ResourceService) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    console.log(this.form);
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
  }

}
