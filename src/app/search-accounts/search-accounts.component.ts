import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { TokenStorageService } from '../services/token-storage.service';

@Component({
  selector: 'app-search-accounts',
  templateUrl: './search-accounts.component.html',
  styleUrls: ['./search-accounts.component.css']
})
export class SearchAccountsComponent implements OnInit {

  constructor(private userService: UserService, private tokenStorageService: TokenStorageService) { }

  users: any;
  institutions: any;
  indAffiliations: any;
  
  countries = ["All","Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua and Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central African Republic","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Côte d'Ivoire","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","East Timor","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Kitts and Nevis","Saint Lucia","Saint Vincent And The Grenadines","Saint Pierre and Miquelon","Samoa","San Marino","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Turks and Caicos Islands","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (British)","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];
  countryOptions = [];
  filterKeyCountryUser = '';
  filterKeyCountryInst = '';
  userKey = 'user';
  instKey = 'inst';

  async ngOnInit() {
    await this.userService.getAllUsers().toPromise().then(
      res => this.users = res.data.users
    );
    await this.userService.getAllInstitutions().toPromise().then(
      res => this.institutions = res.data.institutions
    );
    console.log(this.users);
    console.log(this.institutions);

    for (let i = 0; i < this.countries.length; i++) {
      this.countryOptions.push({label: this.countries[i], value: this.countries[i]});
    }
  }

  async filterByCountry(event, type) {
    await this.ngOnInit();
    let arr = [];
    let value = event.value;
    let tempArr;
    if(type == 'user')  tempArr = this.users;
    else  tempArr = this.institutions;

    if(value == 'All') {
      arr = tempArr;
    } else {
      for(let i = 0; i < tempArr.length; i++) {
        if(tempArr[i].country == value) {
          arr.push(tempArr[i]);
        }
      }
    }

    if(type == 'user')  this.users = arr;
    else  this.institutions = arr;
  }

}
