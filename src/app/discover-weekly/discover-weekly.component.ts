import { Component, OnInit } from '@angular/core';
import { MarketplaceService } from '../services/marketplace.service';

@Component({
  selector: 'app-discover-weekly',
  templateUrl: './discover-weekly.component.html',
  styleUrls: ['./discover-weekly.component.css']
})
export class DiscoverWeeklyComponent implements OnInit {

  projects = [];

  constructor(private marketplaceService: MarketplaceService) { }

  async ngOnInit() {
    await this.marketplaceService.getDiscoverWeekly().toPromise().then(
      res => this.projects = res.data.discoverweekly
    );
    console.log(this.projects)
  }

  formatDate(date): any {
    let formattedDate = new Date(date).toUTCString();
    return formattedDate.substring(5, formattedDate.length-13);
  }

}
