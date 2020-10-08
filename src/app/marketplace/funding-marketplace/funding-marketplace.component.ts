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

  constructor(private marketplaceService: MarketplaceService, private messageService: MessageService) { }

  async ngOnInit() {
    await this.marketplaceService.viewFundingProject().toPromise().then(
      res => this.projects = res.data.fundings
    );
  }

  getForm(proj): void {
    this.projForm = {
      id: proj.id,
      title: proj.title,
      desc: proj.desc,
      country: proj.country,
      imgPath: proj.imgPath,
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
      remainingSum: (proj.total-proj.pendingSum-proj.receivedSum)
    }
  }

  donate(): void {
    const formDonate = {
      id: this.projForm.needId,
      desc: this.form.desc || '',
      moneySum: this.form.moneySum
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
