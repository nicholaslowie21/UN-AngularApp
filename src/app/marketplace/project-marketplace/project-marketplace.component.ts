import { Component, OnInit } from '@angular/core';
import {SelectItem} from 'primeng/api';
import { MarketplaceService } from '../../services/marketplace.service';

@Component({
  selector: 'app-project-marketplace',
  templateUrl: './project-marketplace.component.html',
  styleUrls: ['./project-marketplace.component.css']
})
export class ProjectMarketplaceComponent implements OnInit {

  projects: any;
  errorMessage = '';
  sdgs = [];
  selectedSDGs: number[] = [];
  //selectedCities: string[] = [];
  //cities: any[];

  constructor(private marketplaceService: MarketplaceService) { }

  async ngOnInit() {
    await this.marketplaceService.getOngoingProjects().toPromise().then(
      response => {
        this.projects = response.data.projects;
        console.log(JSON.stringify(this.projects));
      }, err => {
        console.log(JSON.stringify(err));
      }
    );

    /**this.cities = [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' }
    ];
    this.sdgs = [
      { value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 }, { value: 6 }, { value: 7 }, { value: 8 },
      { value: 9 }, { value: 10 }, { value: 11 }, { value: 12 }, { value: 13 }, { value: 14 }, { value: 15 }, { value: 16 }
    ];
    console.log(this.sdgs);**/
  }


}
