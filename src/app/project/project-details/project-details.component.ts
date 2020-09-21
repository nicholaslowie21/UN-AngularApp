import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {

  projectCode: any;
  project: any;

  constructor(private route: ActivatedRoute, private projectService: ProjectService) { }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        this.projectCode = params.code;
      }
    );
    this.loadProject();
  }

  loadProject(): void {
    this.projectService.viewProject({code: this.projectCode}).subscribe(
      response => {
        this.project = response.data.targetProject;
      },
      err => {
        alert(err.error.msg);
      }
    )
  }

}
