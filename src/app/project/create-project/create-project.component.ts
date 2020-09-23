import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css']
})
export class CreateProjectComponent implements OnInit {

  form: any = {};
  errorMessage = '';
  isSuccessful = false;
  isCreateFailed = false;

  SDGs = ['1. No Poverty', '2. Zero Hunger', '3. Good Health and Well-Being',
    '4. Quality Education', '5. Gender Equality', '6. Clean Water and Sanitation',
    '7. Affordable and Clean Energy', '8. Decent Work and Economic Growth',
    '9. Industry, Innovation, and Infrastructure', '10. Reduced Inequalities',
    '11. Sustainable Cities and Communities', '12. Responsible Consumption and Production',
    '13. Climate Action', '14. Life Below Water', '15. Life on Land',
    '16. Peace, Justice, and Strong Institutions', '17. Partnerships'];
  SDGsMap = [];
  SDGsChecked = [];

  projId: any;

  constructor(private projectService: ProjectService) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.updateSDGs();
    console.log(this.SDGsChecked);
    //console.log(this.form);
    const formCreateProject = {
      title: this.form.title,
      desc: this.form.desc,
      rating: Number(this.form.rating),
      SDGs: this.SDGsChecked,
    }
    console.log(formCreateProject);

    this.projectService.createProject(formCreateProject).subscribe(
      response => {
        this.isSuccessful = true;
        this.isCreateFailed = false;
        this.projId = response.data.project.id;
        console.log(JSON.stringify(response));
        console.log(JSON.stringify(this.projId) );
      },
      err => {
        this.errorMessage = err.error.msg;
        console.log(this.errorMessage);
        this.isCreateFailed = true;
      }
    );

  }

  updateCheckedSDGs(x, event) {
    this.SDGsMap[x] = event.target.checked;
    console.log(x);
  }

  updateSDGs() {
    for (var x in this.SDGsMap) {
      if(this.SDGsMap[x]) {
        this.SDGsChecked.push(parseInt(x)+1);
      }
    }
  }

}
