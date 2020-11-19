import { Component, OnInit } from '@angular/core';
import {ChartModule} from 'primeng/chart';

@Component({
  selector: 'app-data-dashboard',
  templateUrl: './data-dashboard.component.html',
  styleUrls: ['./data-dashboard.component.css']
})
export class DataDashboardComponent implements OnInit {
  activeAccNum: any;
  resourcesNum: any;
  contributionsNum: any;
  fundingNum: any;
  projectsOngoingNum: any;
  projectsCompletedNum: any;
  resources: any;
  contributions: any;
  accBar: any;
  projectsLine: any;


  constructor() {
   }

  ngOnInit() {
    this.activeAccNum = 123;
    this.resourcesNum= 100;
    this.contributionsNum= 34;
    this.fundingNum= "2,999"; //Please return me in string, where there is commas?
    this.projectsOngoingNum= 122;
    this.projectsCompletedNum = 208;
    this.resources = {
      labels: ['Manpower','Item','Venue','Knowledge'],
      datasets: [
          {
              data: [200, 150, 100, 12],
              backgroundColor: [
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56",
                  "#eb803d"
              ],
              hoverBackgroundColor: [
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56",
                  "#eb803d"
              ]
          }]    
      };

      this.contributions = {
        labels: ['Manpower','Item','Venue','Knowledge','Funding'],
        datasets: [
            {
                data: [200, 150, 100, 12, 30],
                backgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#eb803d",
                    "#2B9093"
                ],
                hoverBackgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#eb803d",
                    "#2B9093"
                ]
            }]    
      };
      
      this.accBar = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'User Accounts',
                backgroundColor: '#42A5F5',
                borderColor: '#1E88E5',
                data: [65, 59, 80, 81, 56, 55, 40, 80, 81, 56, 55, 40]
            },
            {
                label: 'Institution Accounts',
                backgroundColor: '#9CCC65',
                borderColor: '#7CB342',
                data: [28, 48, 40, 19, 86, 27, 90, 28, 48, 40, 19, 86]
            }
        ]
      }

      this.projectsLine = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Projects',
                data: [65, 59, 80, 81, 56, 55, 40, 59, 80, 81, 56, 55],
                fill: false,
                borderColor: '#4bc0c0'
            },
        ]
    }
  }

}