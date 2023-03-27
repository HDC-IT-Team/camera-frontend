import { Component, OnInit, OnDestroy } from '@angular/core';
import { lastValueFrom, Subscription } from 'rxjs';
import { AdminSharedData, SHARED_DATA_TYPES } from 'src/app/interfaces/admin-shared';
import { Location } from 'src/app/interfaces/location';
import { ApiClientService } from 'src/app/services/api-client.service';
import { SubjectService } from 'src/app/services/subject.service';
import { MatDialog } from '@angular/material/dialog';
import { NewItemDialogComponent } from '../new-item-dialog/new-item-dialog.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IpFolder } from 'src/app/interfaces/ip-folder';
import { Camera } from 'src/app/interfaces/camera';

@Component({
  selector: 'side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit, OnDestroy {
  public locationList: Location[];
  public isAdmin: boolean;
  public subscription: Subscription;
  public sharedDataTypes: any;

  constructor(
    private apiClientService: ApiClientService,
    private subjectService: SubjectService,
    private matDialog: MatDialog
  ) {
    this.locationList = [];
    this.isAdmin = false;
    this.subscription = new Subscription();
    this.sharedDataTypes = SHARED_DATA_TYPES;
  }

  async ngOnInit() {
    this.subscription.add(
      this.subjectService.adminGuestObs
        .subscribe((isAdmin: boolean) => {
          this.isAdmin = isAdmin;
        })
    );

    this.subscription.add(
      this.subjectService.adminSharedDataObs.subscribe((data: AdminSharedData) => {
        if (data) {
          this.expandItem(data);
        }
      })
    );

    this.subscription.add(
      this.subjectService.recordObs.subscribe((record: Location | IpFolder | Camera | any) => {
        if (record) {
          if (record.locationName) {
            const location = this.locationList.find(l => l.id == record.id);
            if (location) {
              location.locationName = record.locationName;
            }
          } else if (record.folderName) {
            const location = this.locationList.find(l => l.id == record.locationId);
            if (location) {
              const oldRecord: any = location.ipFolders.find(f => f.id == record.id);
              if (!oldRecord) {
                location.ipFolders.push(record);
              } else {
                for (let property in record) {
                  oldRecord[property] = record[property];
                }
              }
            }
          } else {
            this.locationList.map((item) => {
              const ipFolder = item.ipFolders.find(f => f.id == record.ipFolderId);
              if (ipFolder) {
                const oldRecord: any = ipFolder.cameras.find(c => c.id == record.id);
                if (!oldRecord) {
                  ipFolder.cameras.push(record);
                } else {
                  for (let property in record) {
                    oldRecord[property] = record[property];
                  }
                }
              }
            });
          }
        }
      })
    );

    this.subscription.add(
      this.subjectService.recordDeletedObs.subscribe((data: { recordId: string, recordType: number }) => {
        if (data) {
          let index: number;
          switch (data.recordType) {
            case SHARED_DATA_TYPES.location:
              index = this.locationList.findIndex(l => l.id == data.recordId);
              if (index > -1) {
                this.locationList.splice(index, 1);
                if (this.locationList.length) {
                  this.shareAdminData(this.locationList[0].id, this.locationList[0].locationName, SHARED_DATA_TYPES.location, undefined, this.locationList[0].ipFolders);
                } else {
                  this.shareAdminData('', '', 0);
                }
              }
              break;
            case SHARED_DATA_TYPES.ipFolder:
              this.locationList.map((location) => {
                index = location.ipFolders.findIndex(a => a.id == data.recordId);
                if (index > -1) {
                  location.ipFolders.splice(index, 1);
                }
              });
              break;
            case SHARED_DATA_TYPES.camera:
              this.locationList.map((location) => {
                location.ipFolders.map((ipFolder) => {
                  index = ipFolder.cameras.findIndex(a => a.id == data.recordId);
                  if (index > -1) {
                    ipFolder.cameras.splice(index, 1);
                  }
                });
              });
              break;
          }
        }
      })
    );

    this.locationList = await lastValueFrom(this.apiClientService.getAllLocations());
    this.locationList[0].expanded = true;
    this.shareAdminData(this.locationList[0].id, this.locationList[0].locationName, SHARED_DATA_TYPES.location, undefined, this.locationList[0].ipFolders);
  }

  public async addLocation() {
    const formGroup = new FormGroup({
      'locationName': new FormControl('', Validators.required)
    })

    const formMetadata = [{
      formControlLabel: 'Name',
      formControlName: 'locationName',
      isRequired: true,
    }];

    const dialogRef = this.matDialog.open(NewItemDialogComponent, {
      data: {
        recordFormGroup: formGroup,
        formMetadata: formMetadata,
        title: 'New Location',
        recordType: SHARED_DATA_TYPES.location,
      },
      panelClass: 'h-position-relative'
    });
    const newLocation = await lastValueFrom(dialogRef.afterClosed());
    if (newLocation) {
      this.locationList.push(newLocation);
    }
  }

  private expandItem(data: AdminSharedData) {
    this.locationList.map((location) => {
      location.expanded = data.id == location.id;
      location.ipFolders.map((ipFolder) => {
        ipFolder.expanded = data.id == ipFolder.id;
        if (data.id == ipFolder.id) {
          location.expanded = true;
        }

        ipFolder.cameras.map((camera) => {
          camera.expanded = data.id == camera.id;
          if (data.id == ipFolder.id) {
            ipFolder.expanded = true;
          }
        })
      })
    });
  }

  public shareAdminData(dataId: string, dataName: string, dataType: number, parentId?: string, children?: IpFolder[] | Camera[], code?: string) {
    this.subjectService.sideNavShares({ id: dataId, name: dataName, type: dataType, parentId: parentId, code: code, children: children });
  }

  public getPhoto(cameraCode: string, folderName: string) {
    this.subjectService.callGetPhoto({ cameraCode: cameraCode, folderName: folderName });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
