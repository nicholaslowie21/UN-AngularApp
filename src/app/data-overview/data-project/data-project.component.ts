import { Component, OnInit, ViewChild } from '@angular/core';
import {Table} from 'primeng/table';
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
  accounts: any;
  projects: any;
  contributions: any;
  funding: any;
  accountArr: any[];
  projectArr: any[];
  contributionArr: any[];
  fundingArr: any[];
  sdgColor: any[];

  @ViewChild('dt1')sdgTable: Table;
  @ViewChild('dt')countryTable: Table;

  constructor(private dataService: DataService, private datePipe: DatePipe) {
    this.sdgColor = [
      'rgb(235, 28, 45, 0.99)', 'rgb(211, 160, 41, 0.99)', 'rgb(39, 155, 72, 0.99)', 'rgb(196, 31, 50, 0.99)', 'rgb(239, 64, 43, 0.99)',
      'rgb(0, 174, 217, 0.99)', 'rgb(253, 183, 19, 0.99)', 'rgb(143, 24, 56, 0.99)', 'rgb(243, 109, 36, 0.99)', 'rgb(225, 20, 132, 0.99)',
      'rgb(249, 157, 38, 0.99)', 'rgb(207, 141, 42, 0.99)', 'rgb(72, 119, 62, 0.99)', ' rgb(0, 125, 188, 0.99)', 'rgb(62, 176, 73, 0.99)',
      'rgb(2, 85, 139, 0.99)', 'rgb(24, 54, 104, 0.99)'];
   }

  async ngOnInit() {
    // Set as date of the app creation
    this.firstYear = 2017;
    this.minDateValue = new Date();
    this.minDateValue.setFullYear(this.firstYear);
    this.minDateValue.setMonth(0);
    this.minDateValue.setDate(1);
    this.maxDateValue = new Date();
    this.thisYear = this.maxDateValue.getFullYear();
    console.log(this.thisYear);
    this.initAll();
  }

  async initAll() {
    this.data = {
      'startDate': this.datePipe.transform(this.minDateValue, "yyyy-MM-dd"),
      'endDate': this.datePipe.transform(this.maxDateValue, "yyyy-MM-dd")
    };
    this.accountArr = [];
    this.projectArr = [];
    this.contributionArr = [];
    this.fundingArr = [];

    await this.dataService.getDatabySDG(this.data).toPromise().then(
      res => {
        this.dataBySDG = res.data.dataBySDGs;
        for (var i = 0; i <this.dataBySDG.length; i++) {
          this.accountArr.push(this.dataBySDG[i].accountsNum);
          this.projectArr.push(this.dataBySDG[i].projectsNum);
          this.contributionArr.push(this.dataBySDG[i].contributionsNum);
          this.fundingArr.push(this.dataBySDG[i].fundingRaisedSum);
        }

        this.accounts = {
          labels: ['1','2','3','4','5','6','7','8', '9', '10', '11', '12', '13', '14', '15', '16', '17'],
          datasets: [
              {
                  data: this.accountArr,
                  backgroundColor: this.sdgColor,
                  hoverBackgroundColor: this.sdgColor
              }]    
          };

        this.projects = {
          labels: ['1','2','3','4','5','6','7','8', '9', '10', '11', '12', '13', '14', '15', '16', '17'],
          datasets: [
              {
                  data: this.projectArr,
                  backgroundColor: this.sdgColor,
                  hoverBackgroundColor: this.sdgColor
              }]    
        };

        this.contributions = {
          labels: ['1','2','3','4','5','6','7','8', '9', '10', '11', '12', '13', '14', '15', '16', '17'],
          datasets: [
              {
                  data: this.contributionArr,
                  backgroundColor: this.sdgColor,
                  hoverBackgroundColor: this.sdgColor
              }]    
        };

        this.funding = {
          labels: ['1','2','3','4','5','6','7','8', '9', '10', '11', '12', '13', '14', '15', '16', '17'],
          datasets: [
              {
                  data: this.fundingArr,
                  backgroundColor: this.sdgColor,
                  hoverBackgroundColor: this.sdgColor
              }]    
        };
      }
    );

    await this.dataService.getDatabyCountries(this.data).toPromise().then(
      res => {
        this.dataByCountry = res.data.dataByCountries;
      }
    );

  }


  async update(event) {
    if (this.rangeDates[1] != null) {
      this.data = {
        'startDate': this.datePipe.transform(this.rangeDates[0], "yyyy-MM-dd"),
        'endDate': this.datePipe.transform(this.rangeDates[1], "yyyy-MM-dd")
      };
      this.accountArr = [];
      this.projectArr = [];
      this.contributionArr = [];
      this.fundingArr = [];
  
      await this.dataService.getDatabySDG(this.data).toPromise().then(
        res => {
          this.dataBySDG = res.data.dataBySDGs
          console.log(this.dataBySDG);
          for (var i = 0; i <this.dataBySDG.length; i++) {
            this.accountArr.push(this.dataBySDG[i].accountsNum);
            this.projectArr.push(this.dataBySDG[i].projectsNum);
            this.contributionArr.push(this.dataBySDG[i].contributionsNum);
            this.fundingArr.push(this.dataBySDG[i].fundingRaisedSum);
          }
  
          this.accounts = {
            labels: ['1','2','3','4','5','6','7','8', '9', '10', '11', '12', '13', '14', '15', '16', '17'],
            datasets: [
                {
                    data: this.accountArr,
                    backgroundColor: this.sdgColor,
                    hoverBackgroundColor: this.sdgColor
                }]    
            };
  
          this.projects = {
            labels: ['1','2','3','4','5','6','7','8', '9', '10', '11', '12', '13', '14', '15', '16', '17'],
            datasets: [
                {
                    data: this.projectArr,
                    backgroundColor: this.sdgColor,
                    hoverBackgroundColor: this.sdgColor
                }]    
          };
  
          this.contributions = {
            labels: ['1','2','3','4','5','6','7','8', '9', '10', '11', '12', '13', '14', '15', '16', '17'],
            datasets: [
                {
                    data: this.contributionArr,
                    backgroundColor: this.sdgColor,
                    hoverBackgroundColor: this.sdgColor
                }]    
          };
  
          this.funding = {
            labels: ['1','2','3','4','5','6','7','8', '9', '10', '11', '12', '13', '14', '15', '16', '17'],
            datasets: [
                {
                    data: this.fundingArr,
                    backgroundColor: this.sdgColor,
                    hoverBackgroundColor: this.sdgColor
                }]    
          };
        }
      );
    
      await this.dataService.getDatabyCountries(this.data).toPromise().then(
        res => {
          this.dataByCountry = res.data.dataByCountries;
        }
      );

    } else if (this.rangeDates[0] == null) {
      this.initAll();
    }
  }

  showAll(event) {
    console.log("I should reinit to all");
    this.initAll();
  }

  onAccountChange(event) {
    const value = event.target.value;
    console.log(value);
    if (value && value.trim().length) {
        const input = parseInt(value);

        if (!isNaN(input)) {
            this.sdgTable.filter(input, 'accountsNum', 'gte');
        }
    } else {
        this.sdgTable.filter(0, 'accountsNum', 'gte');     
      }
  }

  onAccountChangeCountry(event) {
    const value = event.target.value;
    if (value && value.trim().length) {
        const input = parseInt(value);

        if (!isNaN(input)) {
            this.countryTable.filter(input, 'accountsNum', 'gte');
        }
    } else {
      this.countryTable.filter(0, 'accountsNum', 'gte');       
    }
  }

  onProjectChange(event) {
    const value = event.target.value;
    if (value && value.trim().length) {
        const input = parseInt(value);

        if (!isNaN(input)) {
            this.sdgTable.filter(input, 'projectsNum', 'gte');
        }
    } else {
      this.sdgTable.filter(0, 'projectsNum', 'gte');      
    }
    
  }

  onProjectChangeCountry(event) {
    const value = event.target.value;
    if (value && value.trim().length) {
        const input = parseInt(value);

        if (!isNaN(input)) {
            this.countryTable.filter(input, 'projectsNum', 'gte');
        }
    } else {
      this.countryTable.filter(0, 'projectsNum', 'gte');       
    }
  }

  onContributionChange(event) {
    const value = event.target.value;
    if (value && value.trim().length) {
        const input = parseInt(value);

        if (!isNaN(input)) {
            this.sdgTable.filter(input, 'contributionsNum', 'gte');
        }
    } else {
      this.sdgTable.filter(0, 'contributionsNum', 'gte');        
    }
  }

  onContributionChangeCountry(event) {
    const value = event.target.value;
    if (value && value.trim().length) {
        const input = parseInt(value);

        if (!isNaN(input)) {
            this.countryTable.filter(input, 'contributionsNum', 'gte');
        }
    } else {
      this.countryTable.filter(0, 'contributionsNum', 'gte');       
    }
  }

  onFundingChange(event) {
    const value = event.target.value;
    if (value && value.trim().length) {
        const input = parseInt(value);

        if (!isNaN(input)) {
            this.sdgTable.filter(input, 'fundingRaisedSum', 'gte');
        }
    } else {
      this.sdgTable.filter(0, 'fundingRaisedSum', 'gte');       
    }
  }

  onFundingChangeCountry(event) {
    const value = event.target.value;
    if (value && value.trim().length) {
        const input = parseInt(value);

        if (!isNaN(input)) {
            this.countryTable.filter(input, 'fundingRaised', 'gte');
        }
    } else {
      this.countryTable.filter(0, 'fundingRaised', 'gte');       
    }
  }
}
