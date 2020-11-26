import { Component, OnInit, ɵɵqueryRefresh } from '@angular/core';
import {ChartModule} from 'primeng/chart';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-data-dashboard',
  templateUrl: './data-dashboard.component.html',
  styleUrls: ['./data-dashboard.component.css']
})
export class DataDashboardComponent implements OnInit {
  activeAccNum: any;
  resourcesNum: any;
  paidResourcesNum: any;
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
  noResourceBoolean: boolean;
  noContributionBoolean: boolean;

  constructor(private dataService: DataService) {
    this.year = new Date().getFullYear();
    this.years = [2020, 2019, 2018, 2017];
    this.noResourceBoolean = false;
    this.noContributionBoolean = false;
   }

  async ngOnInit() {
      await this.dataService.getDashboard().toPromise().then(
        res => {
            this.activeAccNum = res.data.activeAccNum;
            this.paidResourcesNum = res.data.paidResourcesNum;
            this.resourcesNum= res.data.resourcesNum;
            this.contributionsNum= res.data.contributionsNum;
            this.fundingNum= res.data.fundingRaised;
            this.projectsOngoingNum= res.data.projectsOngoingNum;
            this.projectsCompletedNum = res.data.projectsCompletedNum;
            console.log(res);
        }
      );

      await this.dataService.getResourceTypes(this.year).toPromise().then(
        res => {
            console.log(res.data.resourcesTypesNum);
            if(JSON.stringify(res.data.resourcesTypesNum) == JSON.stringify([0, 0, 0, 0])) {
                this.noResourceBoolean = true;
            } else {
                this.noResourceBoolean = false;
                this.resources = {
                labels: ['Manpower','Item','Venue','Knowledge'],
                datasets: [
                    {
                        data: res.data.resourcesTypesNum,
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
            }
        }
      );

      await this.dataService.getContributionTypes(this.year).toPromise().then(
        res => {
            console.log(res.data.contributionsTypesNum);
            if(JSON.stringify(res.data.contributionsTypesNum) == JSON.stringify([0, 0, 0, 0, 0])) {
                this.noContributionBoolean = true;
            } else {
                this.noContributionBoolean = false;
                this.contributions = {
                labels: ['Manpower','Item','Venue','Knowledge','Funding'],
                datasets: [
                    {
                        data: res.data.contributionsTypesNum,
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
        }});

        await this.dataService.getAccountsChart(this.year).toPromise().then(
            res => {
                this.accBar = {
                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
                    datasets: [
                        {
                            label: 'User Accounts',
                            backgroundColor: '#42A5F5',
                            borderColor: '#1E88E5',
                            data: res.data.usersPerMonth
                        },
                        {
                            label: 'Institution Accounts',
                            backgroundColor: '#9CCC65',
                            borderColor: '#7CB342',
                            data: res.data.institutionsPerMonth
                        }
                    ]
                  }
            });
        
        await this.dataService.getCumulativeProjects(this.year).toPromise().then(
            res => {
                this.projectsLine = {
                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
                    datasets: [
                        {
                            label: 'Projects',
                            data: res.data.cumulativeThisYear,
                            fill: false,
                            borderColor: '#4bc0c0'
                        },
                    ]
                }
            });
  }

  async update(event) {
      console.log(event.target.value);

      await this.dataService.getResourceTypes(event.target.value).toPromise().then(
        res => {
            console.log(res.data.resourcesTypesNum);
            if(JSON.stringify(res.data.resourcesTypesNum) == JSON.stringify([0, 0, 0, 0])) {
                this.noResourceBoolean = true;
            } else {
                this.noResourceBoolean = false;
                this.resources = {
                labels: ['Manpower','Item','Venue','Knowledge'],
                datasets: [
                    {
                        data: res.data.resourcesTypesNum,
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
            }
        }
      );

      await this.dataService.getContributionTypes(event.target.value).toPromise().then(
        res => {
            console.log(res.data.contributionsTypesNum);
            if(JSON.stringify(res.data.contributionsTypesNum) == JSON.stringify([0, 0, 0, 0, 0])) {
                this.noContributionBoolean = true;
            } else {
                this.noContributionBoolean = false;
                this.contributions = {
                labels: ['Manpower','Item','Venue','Knowledge','Funding'],
                datasets: [
                    {
                        data: res.data.contributionsTypesNum,
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
            } 
        });

        await this.dataService.getAccountsChart(event.target.value).toPromise().then(
            res => {
                this.accBar = {
                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
                    datasets: [
                        {
                            label: 'User Accounts',
                            backgroundColor: '#42A5F5',
                            borderColor: '#1E88E5',
                            data: res.data.usersPerMonth
                        },
                        {
                            label: 'Institution Accounts',
                            backgroundColor: '#9CCC65',
                            borderColor: '#7CB342',
                            data: res.data.institutionsPerMonth
                        }
                    ]
                  }
            });
        
        await this.dataService.getCumulativeProjects(event.target.value).toPromise().then(
            res => {
                this.projectsLine = {
                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
                    datasets: [
                        {
                            label: 'Projects',
                            data: res.data.cumulativeThisYear,
                            fill: false,
                            borderColor: '#4bc0c0'
                        },
                    ]
                }
            });

  }

}