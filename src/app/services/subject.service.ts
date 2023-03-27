import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { AdminSharedData } from "../interfaces/admin-shared";
import { Camera } from "../interfaces/camera";
import { IpFolder } from "../interfaces/ip-folder";

@Injectable({
    providedIn: 'root'
})
export class SubjectService {
    private getPhotoSub: BehaviorSubject<any>;
    public getPhotoObs: Observable<any>;

    private adminGuestSub: BehaviorSubject<boolean>;
    public adminGuestObs: Observable<boolean>;

    private sideNavDataSub: BehaviorSubject<AdminSharedData | any>;
    public sideNavDataObs: Observable<AdminSharedData | any>;

    private adminSharedDataSub: BehaviorSubject<AdminSharedData | any>;
    public adminSharedDataObs: Observable<AdminSharedData | any>;

    private recordSub: BehaviorSubject<IpFolder | Camera | any>;
    public recordObs: Observable<IpFolder | Camera | any>;

    private recordDeletedSub: BehaviorSubject<{ recordId: string, recordType: number } | any>;
    public recordDeletedObs: Observable<{ recordId: string, recordType: number } | any>;

    constructor() {
        this.getPhotoSub = new BehaviorSubject(null);
        this.getPhotoObs = this.getPhotoSub.asObservable();

        this.adminGuestSub = new BehaviorSubject(false);
        this.adminGuestObs = this.adminGuestSub.asObservable();

        this.sideNavDataSub = new BehaviorSubject(null);
        this.sideNavDataObs = this.sideNavDataSub.asObservable();

        this.adminSharedDataSub = new BehaviorSubject(null);
        this.adminSharedDataObs = this.adminSharedDataSub.asObservable();

        this.recordSub = new BehaviorSubject(null);
        this.recordObs = this.recordSub.asObservable();

        this.recordDeletedSub = new BehaviorSubject(null);
        this.recordDeletedObs = this.recordDeletedSub.asObservable();
    }

    public recordDeleted(data: { recordId: string, recordType: number }) {
        this.recordDeletedSub.next(data);
    }

    public recordSaved(record: IpFolder | Camera) {
        this.recordSub.next(record);
    }

    public sideNavShares(adminShared: AdminSharedData) {
        this.sideNavDataSub.next(adminShared);
    }

    public adminShares(adminShared: AdminSharedData) {
        this.adminSharedDataSub.next(adminShared);
    }

    public isAdminGuest(isAdmin: boolean) {
        this.adminGuestSub.next(isAdmin);
    }

    public callGetPhoto(photoParams: { cameraCode: string; folderName: string }) {
        this.getPhotoSub.next(photoParams);
    }
}