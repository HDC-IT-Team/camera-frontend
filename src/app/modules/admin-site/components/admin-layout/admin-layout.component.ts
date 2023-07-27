import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { lastValueFrom, Subscription } from 'rxjs';
import { DeleteRecordDialogComponent } from 'src/app/components/delete-record-dialog/delete-record-dialog.component';
import { NewItemDialogComponent } from 'src/app/components/new-item-dialog/new-item-dialog.component';
import { AdminSharedData, SHARED_DATA_TYPES } from 'src/app/interfaces/admin-shared';
import { Camera } from 'src/app/interfaces/camera';
import { DynamicFormMetadata } from 'src/app/interfaces/dynamic-form';
import { IpFolder } from 'src/app/interfaces/ip-folder';
import { ApiClientService } from 'src/app/services/api-client.service';
import { SubjectService } from 'src/app/services/subject.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {
  private subscription: Subscription;
  public adminData: AdminSharedData;
  public itemType: any;
  public image: string;
  public navigationArray: AdminSharedData[];

  constructor(
    private subjectService: SubjectService,
    private apiClientService: ApiClientService,
    private matDialog: MatDialog,
  ) {
    this.subscription = new Subscription();
    this.adminData = { id: '', name: '', type: 0 }
    this.itemType = SHARED_DATA_TYPES;
    this.image = "";
    this.navigationArray = [];
  }

  ngOnInit() {
    this.subjectService.isAdminGuest(true);
    this.subscription.add(
      this.subjectService.sideNavDataObs.subscribe(async (data: AdminSharedData) => {
        if (data) {
          if (JSON.stringify(this.adminData) != JSON.stringify(data)) {
            this.adminData = JSON.parse(JSON.stringify(data));
            await this.defineBreadcrumbs();
          }
        } else {
          this.navigationArray = [];
        }
      })
    )
  }

  public async openDeleteDialog(recordId: string, recordName: string, recordType: number, fromBreadcrumbs: boolean = false) {
    const dialogRef = this.matDialog.open(DeleteRecordDialogComponent, {
      data: {
        title: recordType == SHARED_DATA_TYPES.location ? 'Delete Location' : recordType == SHARED_DATA_TYPES.ipFolder ? 'Delete Ip Folder' : 'Delete Camera',
        recordId: recordId,
        recordName: recordName,
        recordType: recordType,
      },
      panelClass: 'h-position-relative'
    });
    const response = await lastValueFrom(dialogRef.afterClosed());
    if (response) {
      if (fromBreadcrumbs) {
        if (recordType != SHARED_DATA_TYPES.location) {
          this.navigationArray.pop();
          this.selectChildItem(this.navigationArray[this.navigationArray.length - 1], this.navigationArray[this.navigationArray.length - 1].parentId);
          const index = this.adminData.children.findIndex((c: any) => c.id == recordId);
          if (index > -1) {
            this.adminData.children.splice(index, 1);
          }
        }
      } else {
        const index = this.adminData.children.findIndex((c: any) => c.id == recordId);
        if (index > -1) {
          this.adminData.children.splice(index, 1);
        }
      }
      this.subjectService.recordDeleted({ recordId: recordId, recordType: recordType });
    }
  }

  public async updateRecord() {
    let formGroup: FormGroup;
    let formMetadata: DynamicFormMetadata[];
    let dialogTitle: string;
    const recordType = this.adminData.type;

    switch (this.adminData.type) {
      case SHARED_DATA_TYPES.location:
        formGroup = new FormGroup({
          'id': new FormControl(this.adminData.id, Validators.required),
          'locationName': new FormControl(this.adminData.name, Validators.required)
        });

        formMetadata = [
          {
            formControlLabel: 'Name',
            formControlName: 'locationName',
            isRequired: true,
          }
        ];
        dialogTitle = 'Update Ip Folder';
        break;
      case SHARED_DATA_TYPES.ipFolder:
        formGroup = new FormGroup({
          'id': new FormControl(this.adminData.id, Validators.required),
          'folderName': new FormControl(this.adminData.name, Validators.required)
        });

        formMetadata = [
          {
            formControlLabel: 'Name',
            formControlName: 'folderName',
            isRequired: true,
          }
        ];
        dialogTitle = 'Update Ip Folder';
        break;
      default:
        formGroup = new FormGroup({
          'id': new FormControl(this.adminData.id, Validators.required),
          'code': new FormControl(this.adminData.code, Validators.required),
          'cameraName': new FormControl(this.adminData.name, Validators.required)
        });

        formMetadata = [
          {
            formControlLabel: 'Code',
            formControlName: 'code',
            isRequired: true,
          },
          {
            formControlLabel: 'Name',
            formControlName: 'cameraName',
            isRequired: true,
          }
        ];
        dialogTitle = 'Update Camera';
        break;
    }

    await this.openCreateUpdateDialog(formGroup, formMetadata, dialogTitle, recordType, false, false);
  }

  public async addUpdateChildRecord(addUpdate: boolean, item?: IpFolder | Camera | any) {
    let formGroup: FormGroup;
    let formMetadata: DynamicFormMetadata[];
    let dialogTitle: string;
    let recordType: number;
    if (this.adminData.type == SHARED_DATA_TYPES.location) {
      formGroup = new FormGroup({
        'folderName': new FormControl(addUpdate ? '' : item.folderName, Validators.required),
        'locationId': new FormControl(addUpdate ? this.adminData.id : item.locationId, Validators.required)
      });

      if (!addUpdate) {
        formGroup.addControl('id', new FormControl(item.id, Validators.required));
      }

      formMetadata = [
        {
          formControlLabel: 'Name',
          formControlName: 'folderName',
          isRequired: true,
        },
        {
          formControlLabel: 'Location ID',
          formControlName: 'locationId',
          isRequired: true,
          invisible: true
        }
      ];
      dialogTitle = addUpdate ? 'New Ip Folder' : 'Update Ip Folder';
      recordType = SHARED_DATA_TYPES.ipFolder;
    } else {
      formGroup = new FormGroup({
        'code': new FormControl(addUpdate ? '' : item.code, Validators.required),
        'cameraName': new FormControl(addUpdate ? '' : item.cameraName, Validators.required),
        'ipFolderId': new FormControl(addUpdate ? this.adminData.id : item.ipFolderId, Validators.required)
      });

      if (!addUpdate) {
        formGroup.addControl('id', new FormControl(item.id, Validators.required));
      }

      formMetadata = [
        {
          formControlLabel: 'Code',
          formControlName: 'code',
          isRequired: true,
        },
        {
          formControlLabel: 'Name',
          formControlName: 'cameraName',
          isRequired: true,
        },
        {
          formControlLabel: 'Ip Folder Id',
          formControlName: 'ipFolderId',
          isRequired: true,
          invisible: true
        }
      ];
      dialogTitle = addUpdate ? 'New Camera' : 'Update Camera';
      recordType = SHARED_DATA_TYPES.camera;
    }

    await this.openCreateUpdateDialog(formGroup, formMetadata, dialogTitle, recordType, addUpdate);
  }

  private async openCreateUpdateDialog(formGroup: FormGroup, formMetadata: DynamicFormMetadata[], dialogTitle: string, recordType: number, addUpdate: boolean, childRecord: boolean = true) {
    const dialogRef = this.matDialog.open(NewItemDialogComponent, {
      data: {
        recordFormGroup: formGroup,
        formMetadata: formMetadata,
        title: dialogTitle,
        recordType: recordType,
        addUpdate: addUpdate
      },
      panelClass: 'h-position-relative'
    });
    const record = await lastValueFrom(dialogRef.afterClosed());
    if (record) {
      if (addUpdate && SHARED_DATA_TYPES.ipFolder) {
        record.cameras = [];
      }

      if (childRecord) {
        const oldRecord = this.adminData.children.find((c: any) => c.id == record.id);
        if (!oldRecord) {
          this.adminData.children.push(record);
        } else {
          for (let property in record) {
            oldRecord[property] = record[property];
          }
        }
      } else {
        this.adminData.id = record.id;
        this.adminData.name = recordType == SHARED_DATA_TYPES.location ? record.locationName : recordType == SHARED_DATA_TYPES.ipFolder ? record.folderName : `${record.code} (${record.cameraName})`;
        this.adminData.code = recordType != SHARED_DATA_TYPES.camera ? undefined : record.code;
        this.adminData.type = recordType;

        let breadcrumbsRecord;
        switch (recordType) {
          case SHARED_DATA_TYPES.ipFolder:
            breadcrumbsRecord = this.navigationArray[0].children.find((c: any) => c.id == record.id);
            if (breadcrumbsRecord) {
              breadcrumbsRecord.folderName = record.folderName;
            }
            break;
          case SHARED_DATA_TYPES.camera:
            breadcrumbsRecord = this.navigationArray[1].children.find((c: any) => c.id == record.id);
            if (breadcrumbsRecord) {
              breadcrumbsRecord.cameraName = record.cameraName;
            }
            break;
        }
      }
      this.subjectService.recordSaved(record);
    }
  }

  private async defineBreadcrumbs() {
    if (this.adminData.type == SHARED_DATA_TYPES.location) {
      this.navigationArray = [this.adminData];
    } else {
      if (this.adminData.type == SHARED_DATA_TYPES.ipFolder) {
        if (this.navigationArray.length == 3) {
          this.navigationArray.pop();
        }
      } else {
        const parent: AdminSharedData | any = this.navigationArray.find(n => n.id === this.adminData.parentId);
        await this.getPhoto(this.adminData.code, parent.name);
      }

      const index = this.navigationArray.findIndex(n => n.type == this.adminData.type);
      if (index == -1) {
        this.navigationArray.push(this.adminData);
      } else {
        this.navigationArray.splice(index, 1, this.adminData);
      }
    }
  }

  private async getPhoto(cameraCode: string, folderName: string) {
    this.image = "";
    try {
      const base64Photo: any = await lastValueFrom(this.apiClientService.getBase64Photo(cameraCode, folderName));
      this.image = base64Photo ? base64Photo?.photo : this.image;
    } catch (err) { }
  }

  public async selectChildItem(item: AdminSharedData | IpFolder | Camera | any, parentId: string) {
    this.adminData = {
      id: item.id,
      name: item.name ? item.name : item.folderName ? item.folderName : `${item.code} (${item.cameraName})`,
      code: item.folderName ? undefined : item.code,
      type: item.name ? item.type : item.folderName ? SHARED_DATA_TYPES.ipFolder : SHARED_DATA_TYPES.camera,
      parentId: parentId,
      children: item.name ? item.children : item.folderName ? item.cameras : null
    };

    await this.defineBreadcrumbs();

    if (!item.cameraName) {
      this.subjectService.adminShares(this.adminData);
      return;
    }
  }
}
