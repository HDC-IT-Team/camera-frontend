import { Component, OnDestroy, OnInit } from '@angular/core';
import { lastValueFrom, Subscription } from 'rxjs';
import { ApiClientService } from 'src/app/services/api-client.service';
import { SubjectService } from 'src/app/services/subject.service';
import { DEFAULT_PREVIEW_IMG } from 'src/app/utils/constants';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss']
})
export class PhotoComponent implements OnInit, OnDestroy {
  public image: string;
  public subscription: Subscription;

  constructor(
    private subjectService: SubjectService,
    private apiClientService: ApiClientService
  ) {
    this.subjectService.isAdminGuest(false);
    this.image = "";
    this.subscription = new Subscription();
  }

  ngOnInit(): void {
    this.subscription.add(
      this.subjectService.getPhotoObs
        .subscribe((photoParams: { cameraCode: string, folderName: string }) => {
          if (photoParams) {
            this.getPhoto(photoParams.cameraCode, photoParams.folderName);
          }
        })
    )
  }

  private async getPhoto(cameraCode: string, folderName: string) {
    this.image = "";
    try {
      const base64Photo: any = await lastValueFrom(this.apiClientService.getBase64Photo(cameraCode, folderName));
      this.image = base64Photo ? base64Photo?.photo : this.image;
    } catch (err) { }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
