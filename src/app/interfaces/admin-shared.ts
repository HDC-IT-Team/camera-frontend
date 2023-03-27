import { Camera } from "./camera";
import { IpFolder } from "./ip-folder";

export const SHARED_DATA_TYPES = {
    location: 1,
    ipFolder: 2,
    camera: 3,
}

export interface AdminSharedData {
    id: string;
    name: string;
    type: number;
    parentId?: string | any;
    code?: string | any;
    children?: IpFolder[] | Camera[] | any;
}