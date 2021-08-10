
export interface Bucket {
    bucketId?: string;
    name?: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
    totalSize?: number;
    numFiles?: number;
    features?: string[];
}