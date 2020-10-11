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

  constructor(private marketplaceService: MarketplaceService, private messageService: MessageService) { }

  async ngOnInit() {
    await this.marketplaceService.viewFundingProject().toPromise().then(
      res => this.projects = res.data.fundings
    );
    console.log(this.projects)
  }

  async onSDGChange(event) {
    await this.ngOnInit();
    let arr = [];
    if(this.selectedSDGs.length == 0) {
      return;
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
      this.projects = arr; 
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
