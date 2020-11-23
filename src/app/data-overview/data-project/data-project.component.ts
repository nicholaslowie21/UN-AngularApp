import { Component, OnInit } from '@angular/core';
import {TableModule} from 'primeng/table';

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

  constructor() { }

  ngOnInit(): void {
    // Set as date of the app creation
    this.firstYear = 2019;
    this.thisYear = 2022;
    this.minDateValue = new Date();
    this.minDateValue.setFullYear(this.firstYear);
    this.minDateValue.setMonth(0);
    this.maxDateValue = new Date();
    this.initAll();
  }

  initAll() {
    this.dataBySDG = [
      { sdgTitle: '1: Alleviate Poverty', accountsNum:'100', projectsNum: '231', contributionsNum: '1231', fundingNum: '54406.00'},
      { sdgTitle: '2: Food', accountsNum:'200', projectsNum: '211', contributionsNum: '1231', fundingNum: '24406.00'},
      { sdgTitle: '3: Animal Protection', accountsNum:'300', projectsNum: '31', contributionsNum: '131', fundingNum: '4406.00'},
      { sdgTitle: '4: Water Safety', accountsNum:'400', projectsNum: '121', contributionsNum: '1231', fundingNum: '14406.00'},
    ]

    this.dataByCountry = [
      { country: 'Singapore', accountsNum:'100', projectsNum: '231', contributionsNum: '1231', fundingNum: '54406.00'},
      { country: 'Indonesia', accountsNum:'200', projectsNum: '211', contributionsNum: '1231', fundingNum: '24406.00'},
      { country: 'Malaysia', accountsNum:'300', projectsNum: '31', contributionsNum: '131', fundingNum: '4406.00'},
      { country: 'Vietnam', accountsNum:'400', projectsNum: '121', contributionsNum: '1231', fundingNum: '14406.00'},
    ]
  }

  update(event) {
    console.log(this.rangeDates);
    // Will return me [Mon Nov 09 2020 00:00:00 GMT+0800 (Singapore Standard Time), Thu Nov 12 2020 00:00:00 GMT+0800 (Singapore Standard Time)]
    if (this.rangeDates[1] != null) {
      console.log("fetch data based on dates here and reinitialise table");
      // use moment js to convert Date to 2020-12-23 then feed to back end
        this.dataBySDG = [
          { sdgTitle: '1: Alleviate Poverty', accountsNum:'10', projectsNum: '23', contributionsNum: '11', fundingNum: '506.00'},
          { sdgTitle: '2: Food', accountsNum:'20', projectsNum: '21', contributionsNum: '11', fundingNum: '246.00'},
          { sdgTitle: '3: Animal Protection', accountsNum:'30', projectsNum: '31', contributionsNum: '1', fundingNum: '46.00'},
          { sdgTitle: '4: Water Safety', accountsNum:'40', projectsNum: '21', contributionsNum: '11', fundingNum: '16.00'},
        ]
    
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
