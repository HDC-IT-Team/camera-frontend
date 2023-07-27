import { Component, OnInit } from '@angular/core';
import { SubjectService } from 'src/app/services/subject.service';

@Component({
  selector: 'app-external-layout',
  templateUrl: './external-layout.component.html',
  styleUrls: ['./external-layout.component.scss']
})
export class ExternalLayoutComponent implements OnInit {

  constructor(
    private subjectService: SubjectService
  ) { }

  ngOnInit(): void {
    this.subjectService.sideNavShares(null);
  }

}
