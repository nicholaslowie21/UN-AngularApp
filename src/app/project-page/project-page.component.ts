import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.css']
})
export class ProjectPageComponent implements OnInit {

  projectCode: any;
  project: any;

  constructor(private route: ActivatedRoute, private projectService: ProjectService) { }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        this.projectCode = params.projectCode;
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
