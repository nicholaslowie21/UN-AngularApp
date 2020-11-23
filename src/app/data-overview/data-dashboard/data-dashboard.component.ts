import { Component, OnInit, ɵɵqueryRefresh } from '@angular/core';
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
  years: any;
  year: any;


  constructor() {
    this.year = "All years";
   }

  ngOnInit() {
    this.activeAccNum = 123;
    this.resourcesNum= 100;
    this.contributionsNum= 34;
    this.fundingNum= "2,999"; //Please return me in string, where there is commas?
    this.projectsOngoingNum= 122;
    this.projectsCompletedNum = 208;
    //Probably need to populate the years depending on until which year of data we have
    this.years = ["All years", 2020, 2019, 2018];
    this.initAllYears();
  }

  initAllYears() {
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

  update(event) {
      console.log(event.target.value);
      if (event.target.value == "All years") {
        this.initAllYears();

      } else {
        //   Fetch data based on year passed in the drop down
        this.resources = {
            labels: ['Manpower','Item','Venue','Knowledge'],
            datasets: [
                {
                    data: [0, 20, 10, 12],
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
                    data: [20, 15, 10, 12, 30],
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
                    data: [25, 9, 8, 1, 6, 5, 4, 18, 21, 5, 10, 4]
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
                    data: [15, 5, 8, 18, 6, 5, 4, 9, 8, 18, 5, 5],
                    fill: false,
                    borderColor: '#4bc0c0'
                },
            ]
        }
      }

  }

}