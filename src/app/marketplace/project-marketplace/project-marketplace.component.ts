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
  //sdgs = [];
  selectedSDGs = [];

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

  }

  formatDate(date): any {
    let formattedDate = new Date(date).toUTCString();
    return formattedDate.substring(5, formattedDate.length-13);
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


}
