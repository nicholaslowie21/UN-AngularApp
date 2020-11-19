import { Component, OnInit } from '@angular/core';
import { TargetService } from '../services/target.service';
import { UserService } from '../services/user.service';
import { TokenStorageService } from '../services/token-storage.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'app-edit-target',
  templateUrl: './edit-target.component.html',
  styleUrls: ['./edit-target.component.css'],
  providers: [MessageService]
})
export class EditTargetComponent implements OnInit {

  //SDGs = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17];
  SDGs: any;
  sdg: any;
  user: any;
  id: any;
  isLoggedIn = false;
  SDGsMap = [];
  file: any;
  targets = [];
  accTargets: any;
  newAccTargets = [];
  checkTarget = [];
  selectTarget = [];
  replaceTargets = [];
  projectId: any;
  type: any;
  projTargets: any;
  project: any;
  accountType: any;
  //rdata: { SDGs: any; };

  constructor(private targetService: TargetService, private userService: UserService, private tokenStorage: TokenStorageService,
    private messageService: MessageService, private route: ActivatedRoute, private projectService: ProjectService) { }

  async ngOnInit() {
    this.newAccTargets = [];
    this.route.queryParams
      .subscribe(params => {
        this.projectId = params.id;
        this.type = params.type;
      }
      );
      console.log(this.projectId + " " + this.type);

    if(this.type == 'project') {
      await this.projectService.viewProject({id: this.projectId}).toPromise().then(
        response => {
          this.project = response.data.targetProject;
          this.SDGs = this.project.SDGs;
          console.log(this.SDGs);
        }
      );
    } else {
      if(this.tokenStorage.getToken()) {
        this.isLoggedIn = true;
        this.user = this.tokenStorage.getUser();
        this.id = this.user.id;
        this.SDGs = this.user.SDGs;
        this.accountType = this.tokenStorage.getAccountType();
        console.log(this.accountType);
      }
    }

    const rdata = {
      SDGs: this.SDGs
    }
    console.log(rdata);

    await this.targetService.getPossibleTargetLists(rdata).toPromise().then(
      response => {
        this.sdg = response.data.targets;
        console.log(this.sdg);
        console.log(response);
      }
    );

    if(this.type == 'project') {
      for (var x=0; x<17; x++) {
        if (this.project.SDGs.includes(x+1)) {
          this.SDGsMap[x] = true;
        } else {
          this.SDGsMap[x] = false;
        }
      }
      await this.targetService.getProjectTargets({id: this.projectId}).toPromise().then(
        response => {
          this.accTargets = response.data.targets;
          console.log(response);
        }
      );
    } else {
      for (var x=0; x<17; x++) {
        if (this.user.SDGs.includes(x+1)) {
          this.SDGsMap[x] = true;
        } else {
          this.SDGsMap[x] = false;
        }
      }
      await this.targetService.getAccountTargets({id: this.id, type: this.accountType}).toPromise().then(
        response => {
          this.accTargets = response.data.targets;
          console.log(response);
        }
      );
    }
    //console.log(this.SDGsMap);
  }

  selectFile(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.file = file;
    }
  }

  uploadCSV(): void {
    if (this.file == null) {
      alert("Choose a file!");
      //this.errorMsgUpload = 'Choose a file!';
      return;
    }
    const formData = new FormData();
    formData.append('csvTarget', this.file);

    this.targetService.addTargetCSV(formData).subscribe(
      response => {
        console.log(JSON.stringify(response));
      }, 
      err => {
        alert(err.error.msg);
      }
    )
  }

  //possible targets for a SDG
  getTarget(num): void {
    this.targets = [];
    this.checkTarget = [];
    this.selectTarget = [];
    //console.log(this.sdg[1]);
    for (var x=0; x<this.sdg.length; x++) {
      if (this.sdg[x].SDG == num) {
        this.targets.push(this.sdg[x]);
      }
    }
    console.log(this.targets);
    for(var y=0; y<this.accTargets.length; y++){
      if (this.accTargets[y].SDG == num) {
        console.log(this.accTargets[y].targetCode)
        //this.selectTarget[(this.accTargets[y].targetCode)-1] = true;
        for(var a=0; a<this.targets.length; a++)
        if(this.accTargets[y].id == this.targets[a].id){
          console.log(this.accTargets[y].id);
          this.checkTarget[a] = true;
          this.selectTarget[a] = true;
        }
      }
    }
  }

  updateTarget(num): void {
    //push out old SDG targets
    for(var x=0; x<this.accTargets.length; x++) {
      if(this.accTargets[x].SDG != num) {
        this.newAccTargets.push(this.accTargets[x].id);
      }
    }
    console.log(this.newAccTargets);
    console.log(this.selectTarget);

    for(var y=0; y<this.targets.length; y++) {
      if(this.selectTarget[y] == true) {
        console.log(y);
        this.newAccTargets.push(this.targets[y].id);
      }
    }
    console.log(this.newAccTargets);

    if(this.type == 'project') {
      this.targetService.updateProjectTargets({id: this.projectId, targets: this.newAccTargets}).subscribe(
        response => {
          this.messageService.add({ key: 'toastMsg', severity: 'success', summary: 'Success', detail: 'Project SDG Targets updated!' });
          console.log(response);
          this.ngOnInit();
        }
      );
    } else {
      this.targetService.updateAccountTargets({ids: this.newAccTargets}).subscribe(
        response => {
          this.messageService.add({ key: 'toastMsg', severity: 'success', summary: 'Success', detail: 'Account SDG Targets updated!' });
          console.log(response);
          this.ngOnInit();
        }
      );
    }
  }

  updateCheckedTargets(x, event): void{
    this.selectTarget[x] = event.target.checked;
    //this.checkTarget[x] = true;
    console.log(x);
  }

}
