import { Resource } from "./resource";

export interface BucketContent {
    bucketId?: string;
    name?: string;
    resources?: Resource[];
}