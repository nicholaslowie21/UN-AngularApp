import { Component, OnInit } from '@angular/core';
import {TableModule} from 'primeng/table';
import { DataService } from '../../services/data.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-data-project',
  templateUrl: './data-project.component.html',
  styleUrls: ['./data-project.component.css']
})
export class DataProjectComponent implements OnInit {
  dataBySDG: any;
  dataByCountry: any;
  rangeDates: Date[];
  minDateValue: any;
  maxDateValue: any;
  firstYear: any;
  thisYear: any;
  data: any;

  constructor(private dataService: DataService, private datePipe: DatePipe) { }

  async ngOnInit() {
    // Set as date of the app creation
    this.firstYear = 2019;
    this.thisYear = 2022;
    this.minDateValue = new Date();
    this.minDateValue.setFullYear(this.firstYear);
    this.minDateValue.setMonth(0);
    this.maxDateValue = new Date();
    this.initAll();
  }

  async initAll() {
    this.data = {
      'startDate': this.datePipe.transform(this.minDateValue, "yyyy-MM-dd"),
      'endDate': this.datePipe.transform(this.maxDateValue, "yyyy-MM-dd")
    };

    await this.dataService.getDatabySDG(this.data).toPromise().then(
      res => {
        this.dataBySDG = res.data.dataBySDGs;
        console.log(res);
      }
    );

    this.dataByCountry = [
      { country: 'Singapore', accountsNum:'100', projectsNum: '231', contributionsNum: '1231', fundingNum: '54406.00'},
      { country: 'Indonesia', accountsNum:'200', projectsNum: '211', contributionsNum: '1231', fundingNum: '24406.00'},
      { country: 'Malaysia', accountsNum:'300', projectsNum: '31', contributionsNum: '131', fundingNum: '4406.00'},
      { country: 'Vietnam', accountsNum:'400', projectsNum: '121', contributionsNum: '1231', fundingNum: '14406.00'},
    ]
  }


  async update(event) {
    if (this.rangeDates[1] != null) {
      this.data = {
        'startDate': this.datePipe.transform(this.rangeDates[0], "yyyy-MM-dd"),
        'endDate': this.datePipe.transform(this.rangeDates[1], "yyyy-MM-dd")
      };
  
      await this.dataService.getDatabySDG(this.data).toPromise().then(
        res => this.dataBySDG = res.data.dataBySDGs
      );
    
        this.dataByCountry = [
          { country: 'Singapore', accountsNum:'10', projectsNum: '21', contributionsNum: '31', fundingNum: '546.00'},
          { country: 'Indonesia', accountsNum:'20', projectsNum: '21', contributionsNum: '31', fundingNum: '206.00'},
          { country: 'Malaysia', accountsNum:'30', projectsNum: '3', contributionsNum: '1', fundingNum: '46.00'},
          { country: 'Vietnam', accountsNum:'40', projectsNum: '11', contributionsNum: '13', fundingNum: '146.00'},
        ]
    } else if (this.rangeDates[0] == null) {
      this.initAll();
    }
  }

  showAll(event) {
    console.log("I should reinit to all");
    this.initAll();
  }
}
