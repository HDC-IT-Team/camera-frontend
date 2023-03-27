import { IpFolder } from "./ip-folder";

export interface Location {
    id: string,
    locationName: string,
    createdAt: string,
    updatedAt: string,
    ipFolders: IpFolder[],
    expanded?: boolean
}