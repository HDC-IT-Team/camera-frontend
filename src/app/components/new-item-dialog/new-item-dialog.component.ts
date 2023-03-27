import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiClientService } from 'src/app/services/api-client.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { lastValueFrom } from 'rxjs';
import { SHARED_DATA_TYPES } from 'src/app/interfaces/admin-shared';
import { DynamicFormMetadata } from 'src/app/interfaces/dynamic-form';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-new-item-dialog',
  templateUrl: './new-item-dialog.component.html',
  styleUrls: ['./new-item-dialog.component.scss']
})
export class NewItemDialogComponent implements OnInit {
  public recordFormGroup: FormGroup;
  public formMetadata: DynamicFormMetadata[];
  public title: string;
  public recordType: number;
  public addUpdate: boolean;
  public showSpinner: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private matDialogRef: MatDialogRef<NewItemDialogComponent>,
    private apiClientService: ApiClientService,
    private matSnackBar: MatSnackBar
  ) {
    this.recordFormGroup = data.recordFormGroup;
    this.formMetadata = data.formMetadata;
    this.title = data.title;
    this.recordType = data.recordType;
    this.addUpdate = data.addUpdate;
    this.showSpinner = false;
  }

  ngOnInit(): void {
  }

  public async closeDialog(submit: boolean) {
    if (submit) {
      if (this.recordFormGroup.invalid) {
        this.matSnackBar.open('Please fill in the required fields', 'Ok', {
          duration: 4000
        });
        return;
      }
      this.showSpinner = true;
      const formData = this.recordFormGroup.getRawValue();
      let request: any;
      switch (this.recordType) {
        case SHARED_DATA_TYPES.location:
          request = this.addUpdate ? this.apiClientService.postLocation(formData) : this.apiClientService.putLocation(formData);
          break;
        case SHARED_DATA_TYPES.ipFolder:
          request = this.addUpdate ? this.apiClientService.postIpFolder(formData) : this.apiClientService.putIpFolder(formData);
          break;
        case SHARED_DATA_TYPES.camera:
          request = this.addUpdate ? this.apiClientService.postCamera(formData) : this.apiClientService.putCamera(formData);
          break;
      }
      try {
        const resp: any = await lastValueFrom(request);
        this.matSnackBar.open('The record was saved successfully', 'Ok', {
          duration: 7000
        });
        setTimeout(() => {
          this.showSpinner = false;
          this.matDialogRef.close(resp);
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
