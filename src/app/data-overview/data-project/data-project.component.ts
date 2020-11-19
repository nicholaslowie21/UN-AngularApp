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

  constructor() { }

  ngOnInit(): void {
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

}
