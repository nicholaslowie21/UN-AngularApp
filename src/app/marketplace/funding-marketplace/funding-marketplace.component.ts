import { Component, OnInit } from '@angular/core';
import { MarketplaceService } from '../../services/marketplace.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-funding-marketplace',
  templateUrl: './funding-marketplace.component.html',
  styleUrls: ['./funding-marketplace.component.css'],
  providers: [MessageService]
})
export class FundingMarketplaceComponent implements OnInit {

  projects = [];
  projForm: any = {imgPath: '', ownerType: '', ownerImg: ''};
  form: any = {};

  sortField: string;
  sortOrder: number;
  sdgOption = [
    {name: '1. No Poverty', number: 1},
    {name: '2. Zero Hunger', number: 2},
    {name: '3. Good Health and Well-Being', number: 3},
    {name: '4. Quality Education', number: 4},
    {name: '5. Gender Equality', number: 5},
    {name: '6. Clean Water and Sanitation', number: 6},
    {name: '7. Affordable and Clean Energy', number: 7},
    {name: '8. Decent Work and Economic Growth', number: 8},
    {name: '9. Industry, Innovation, and Infrastructure', number: 9},
    {name: '10. Reduced Inequalities', number: 10},
    {name: '11. Sustainable Cities and Communities', number: 11},
    {name: '12. Responsible Consumption and Production', number: 12},
    {name: '13. Climate Action', number: 13},
    {name: '14. Life Below Water', number: 14},
    {name: '15. Life on Land', number: 15},
    {name: '16. Peace, Justice, and Strong Institutions', number: 16},
    {name: '17. Partnerships', number: 17},
  ]

  selectedSDGs = [];

  countries = ["All","Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua and Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central African Republic","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Côte d'Ivoire","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","East Timor","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre and Miquelon","Samoa","San Marino","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","Saint Kitts and Nevis","Saint Lucia","Saint Vincent And The Grenadines","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Turks and Caicos Islands","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam", "Virgin Islands (British)", "Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];
  countryOptions = [];
  filterKeyCountry = '';

  constructor(private marketplaceService: MarketplaceService, private messageService: MessageService) { }

  async ngOnInit() {
    await this.marketplaceService.viewFundingProject().toPromise().then(
      res => this.projects = res.data.fundings
    );

    for(var i=0; i<this.countries.length; i++) {
      this.countryOptions.push({label: this.countries[i], value: this.countries[i]});
    }
  }

  async onSDGChange(event) {
    await this.ngOnInit();
    let arr = [];
    if(this.selectedSDGs.length == 0) {
      arr = this.projects;
    } else {
      for(var j=0; j<this.projects.length; j++) {
        let isProject = false;
        for(var k=0; k<this.projects[j].SDGs.length; k++) {
          for(var i=0; i<this.selectedSDGs.length; i++) {
            if(this.projects[j].SDGs[k] == this.selectedSDGs[i].number) {
              arr.push(this.projects[j]);
              isProject = true;
              break;
            }
          }
          if(isProject) break;
        }  
      }
    }

    this.projects = arr;

      let arr2 = [];
      if(this.filterKeyCountry.length > 0) {
        if(this.filterKeyCountry == 'All') {
          arr2 = this.projects;
        } else {
          for(var m=0; m<this.projects.length; m++) {
            if(this.projects[m].country == this.filterKeyCountry) {
              arr2.push(this.projects[m]);
            }
          }
        }
        this.projects = arr2;
      }
  }

  async onFilterCountry(event) {
    await this.ngOnInit();
    let arr = [];
    let value = event.value;
    if(value == 'All') {
      arr = this.projects;
    } else {
      for(var m=0; m<this.projects.length; m++) {
        if(this.projects[m].country == value) {
          arr.push(this.projects[m]);
        }
      }
    }
    
    this.projects = arr;

    let arr2 = [];
    if(this.selectedSDGs.length > 0) {
      for(var j=0; j<this.projects.length; j++) {
        let isProject = false;
        for(var k=0; k<this.projects[j].SDGs.length; k++) {
          for(var i=0; i<this.selectedSDGs.length; i++) {
            if(this.projects[j].SDGs[k] == this.selectedSDGs[i].number) {
              arr2.push(this.projects[j]);
              isProject = true;
              break;
            }
          }
          if(isProject) break;
        }  
      }
      this.projects = arr2;
    }
  }

  calculateProgress(total,received) {
    if(received == 0) {
      return 0;
    }
    return parseFloat((received*100/total).toFixed(2));
  }

  formatDate(date): any {
    let formattedDate = new Date(date).toUTCString();
    return formattedDate.substring(5, formattedDate.length-13);
  }

  getForm(proj): void {
    this.projForm = {
      id: proj.id,
      title: proj.title,
      desc: proj.desc,
      country: proj.country,
      imgPath: proj.imgPath,
      createdAt: proj.createdAt,
      ownerName: proj.ownerName,
      ownerUsername: proj.ownerUsername,
      ownerType: proj.ownerType,
      ownerImg: proj.ownerImg,
      SDGs: proj.SDGs,
      needId: proj.needId,
      fundingTitle: proj.fundingTitle,
      fundingDesc: proj.fundingDesc,
      targetSum: proj.total,
      pendingSum: proj.pendingSum,
      receivedSum: proj.receivedSum,
      remainingSum: (proj.total-proj.pendingSum-proj.receivedSum),
      amount: '',
      reqDesc: ''
    }
  }

  donate(): void {
    const formDonate = {
      id: this.projForm.needId,
      desc: this.projForm.reqDesc || '',
      moneySum: parseInt(this.projForm.amount)
    }
    console.log(formDonate)
    this.marketplaceService.contributeMoney(formDonate).subscribe(
      response => {
        this.messageService.add({key:'toastMsg',severity:'success',summary:'Success',detail:'Your request to donate has been submitted!'});
        window.location.reload();
      },
      err => {
        this.messageService.add({key:'toastMsg',severity:'error',summary:'Error',detail:err.error.msg});
      }
    );
  }

}
