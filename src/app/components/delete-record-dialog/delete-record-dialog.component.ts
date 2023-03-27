import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { lastValueFrom } from 'rxjs';
import { SHARED_DATA_TYPES } from 'src/app/interfaces/admin-shared';
import { ApiClientService } from 'src/app/services/api-client.service';

@Component({
  selector: 'app-delete-record-dialog',
  templateUrl: './delete-record-dialog.component.html',
  styleUrls: ['./delete-record-dialog.component.scss']
})
export class DeleteRecordDialogComponent implements OnInit {
  public title: string;
  public recordId: string;
  public recordName: string;
  public recordType: number;
  public showSpinner: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private matDialogRef: MatDialogRef<DeleteRecordDialogComponent>,
    private apiClientService: ApiClientService,
    private matSnackBar: MatSnackBar
  ) {
    this.title = this.data.title;
    this.recordId = this.data.recordId;
    this.recordName = this.data.recordName;
    this.recordType = this.data.recordType;
    this.showSpinner = false;
  }

  ngOnInit(): void {
  }

  public async closeDialog(submit: boolean) {
    if (submit) {
      this.showSpinner = true;
      let request: any;
      switch (this.recordType) {
        case SHARED_DATA_TYPES.location:
          request = this.apiClientService.deleteLocation(this.recordId);
          break;
        case SHARED_DATA_TYPES.ipFolder:
          request = this.apiClientService.deleteIpFolder(this.recordId);
          break;
        case SHARED_DATA_TYPES.camera:
          request = this.apiClientService.deleteCamera(this.recordId);
          break;
      }
      try {
        const resp: any = await lastValueFrom(request);
        this.matSnackBar.open('The record was deleted successfully', 'Ok', {
          duration: 7000
        });
        setTimeout(() => {
          this.showSpinner = false;
          this.matDialogRef.close(true);
        }, 1300);
      } catch (err) { }
      setTimeout(() => {
        this.showSpinner = false;
      }, 700);
      return;
    }
    this.matDialogRef.close(null);
  }

}
