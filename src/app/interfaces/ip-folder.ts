import { Camera } from "./camera";

export interface IpFolder {
    id: string,
    folderName: string,
    createdAt: string,
    updatedAt: string,
    locationId: string,
    cameras: Camera[],
    expanded?: boolean
}