import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Observable, tap } from "rxjs";
import { environment } from "src/environments/environment";
import { Camera } from "../interfaces/camera";
import { IpFolder } from "../interfaces/ip-folder";
import { Location } from "../interfaces/location";

const API_URL = environment.cameraApiUrl;

@Injectable({
    providedIn: 'root'
})
export class ApiClientService {

    constructor(
        private httpClient: HttpClient,
        private matSnackBar: MatSnackBar,
    ) { }

    public deleteCamera(cameraId: string) {
        const url = `${API_URL}camera/delete/${cameraId}`;
        const request = this.httpClient.delete(url);
        return this.requestHandler(request);
    }

    public deleteIpFolder(ipFolderId: string) {
        const url = `${API_URL}folder/delete/${ipFolderId}`;
        const request = this.httpClient.delete(url);
        return this.requestHandler(request);
    }

    public deleteLocation(locationId: string) {
        const url = `${API_URL}location/delete/${locationId}`;
        const request = this.httpClient.delete(url);
        return this.requestHandler(request);
    }

    public putCamera(camera: Camera) {
        const url = `${API_URL}camera/update/${camera.id}`;
        const body = {
            code: camera.code,
            cameraName: camera.cameraName
        };
        const request = this.httpClient.put(url, body);
        return this.requestHandler(request);
    }

    public putIpFolder(ipFolder: IpFolder) {
        const url = `${API_URL}folder/update/${ipFolder.id}`;
        const body = {
            folderName: ipFolder.folderName
        };
        const request = this.httpClient.put(url, body);
        return this.requestHandler(request);
    }

    public putLocation(location: Location) {
        const url = `${API_URL}location/update/${location.id}`;
        const body = {
            locationName: location.locationName
        };
        const request = this.httpClient.put(url, body);
        return this.requestHandler(request);
    }

    public postCamera(camera: Camera) {
        const url = `${API_URL}camera/create`;
        const body = {
            code: camera.code,
            cameraName: camera.cameraName,
            ipFolderId: camera.ipFolderId
        };
        const request = this.httpClient.post(url, body);
        return this.requestHandler(request);
    }

    public postIpFolder(ipFolder: IpFolder) {
        const url = `${API_URL}folder/create`;
        const body = {
            folderName: ipFolder.folderName,
            locationId: ipFolder.locationId
        };
        const request = this.httpClient.post(url, body);
        return this.requestHandler(request);
    }

    public postLocation(location: Location) {
        const url = `${API_URL}location/create`;
        const body = {
            locationName: location.locationName
        };
        const request = this.httpClient.post(url, body);
        return this.requestHandler(request);
    }

    public getBase64Photo(cameraCode: string, ipFolderName: string) {
        const url = `${API_URL}camera/photo?cameraCode=${cameraCode}&ipFolderName=${ipFolderName}`;
        const request = this.httpClient.get(url);
        return request;
    }

    public getAllLocations() {
        const url = `${API_URL}location/list`;
        const request = this.httpClient.get<Location[]>(url);
        return this.requestHandler(request);
    }

    private requestHandler(req: Observable<any>) {
        return req.pipe(
            tap({
                error: (e) => {
                    if (e instanceof HttpErrorResponse) {
                        if (e.status != 400 && e.status != 401) {
                            this.matSnackBar.open('An error occurred while trying to save the record. Please try again later', 'Ok', {
                                duration: 7000
                            });
                        }
                    }
                }
            })
        )
    }
}
