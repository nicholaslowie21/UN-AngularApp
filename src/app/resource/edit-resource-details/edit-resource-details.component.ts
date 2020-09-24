import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ResourceService } from '../../services/resource.service';

@Component({
  selector: 'app-edit-resource-details',
  templateUrl: './edit-resource-details.component.html',
  styleUrls: ['./edit-resource-details.component.css']
})
export class EditResourceDetailsComponent implements OnInit {

  id: any;
  type: any;
  resource: any;
  isUpdateSuccessful = false;
  errorMessage = '';

  countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua and Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central African Republic","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Côte d'Ivoire","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","East Timor","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre and Miquelon","Samoa","San Marino","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","Saint Kitts and Nevis","Saint Lucia","Saint Vincent And The Grenadines","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Turks and Caicos Islands","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam", "Virgin Islands (British)", "Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];

  constructor(private route: ActivatedRoute, private resourceService: ResourceService) { }

  async ngOnInit() {
    this.route.queryParams.subscribe(
      params => {
        this.id = params.id;
        this.type = params.type;
      }
    );
    
    if (this.type == 'item') {
      await this.resourceService.viewItemDetails({id: this.id}).toPromise().then(res => {this.resource = res.data.item});
    } else if (this.type == 'manpower') {
      await this.resourceService.viewManpowerDetails({id: this.id}).toPromise().then(res => {this.resource = res.data.manpower});
    } else if (this.type == 'venue') {
      await this.resourceService.viewVenueDetails({id: this.id}).toPromise().then(res => {this.resource = res.data.venue});
    } else if (this.type == 'knowledge') {
      await this.resourceService.viewKnowledgeDetails({id: this.id}).toPromise().then(res => {this.resource = res.data.knowledge});
    }
  }

  onSubmit(): void {
    console.log(this.id);
    if (this.type == 'item') {
      const formUpdateItem = {
        id: this.id,
        title: this.resource.title,
        desc: this.resource.desc,
        country: this.resource.country
      }
      this.resourceService.updateItem(formUpdateItem).subscribe(
        response => {
          this.isUpdateSuccessful = true;
        },
        err => {
          this.errorMessage = err.error.msg;
          this.isUpdateSuccessful = false;
        }
      )
    } else if (this.type == 'knowledge') {
      const formUpdateKnowledge = {
        id: this.id,
        title: this.resource.title,
        desc: this.resource.desc
      }
      this.resourceService.updateKnowledge(formUpdateKnowledge).subscribe(
        response => {
          this.isUpdateSuccessful = true;
        },
        err => {
          this.errorMessage = err.error.msg;
          this.isUpdateSuccessful = false;
        }
      )
    } else if (this.type == 'manpower') {
      const formUpdateManpower = {
        id: this.id,
        title: this.resource.title,
        desc: this.resource.desc,
        country: this.resource.country
      }
      this.resourceService.updateManpower(formUpdateManpower).subscribe(
        response => {
          this.isUpdateSuccessful = true;
        },
        err => {
          this.errorMessage = err.error.msg;
          this.isUpdateSuccessful = false;
        }
      )
    } else if (this.type == 'venue') {
      const formUpdateVenue = {
        id: this.id,
        title: this.resource.title,
        desc: this.resource.desc,
        address: this.resource.address,
        country: this.resource.country
      }
      this.resourceService.updateVenue(formUpdateVenue).subscribe(
        response => {
          this.isUpdateSuccessful = true;
        },
        err => {
          this.errorMessage = err.error.msg;
          this.isUpdateSuccessful = false;
        }
      )
    }
    
  }

}
