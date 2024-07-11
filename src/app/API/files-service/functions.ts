/*
    This file contains a set of functions designed to interact with the file-service API.
    These functions facilitate various file operations such as uploading, downloading,
    and retrieving metadata for files stored in different buckets on the server.
*/

import { decode } from "jsonwebtoken";

export enum BucketsNames {
    RECORDS = 'records',
    IMAGES = 'images'
}

export enum SignatureTypes {
    PASSIVE = 'passive',
    ACTIVE = 'active',
    PASSIVEACTIVE = 'passive and active',
    TORPEDO = 'torpedo',
}

export enum SonarSystem {
    DEMON = 'demon',
    LOFAR = 'lofar'
}

export enum FeaturesList {
    NUMBER_OF_BLADES = "numberOfBlades",
}


const ROUT = 'http://localhost:4002';

const FILES_SERVICE_ENDPOINTS = {
    FILES: `${ROUT}/api/files`,
};

const FILES_API = {
    UPLOAD_FILE: `${FILES_SERVICE_ENDPOINTS.FILES}/uploadFile`,
    IS_FILE_EXISTED: `${FILES_SERVICE_ENDPOINTS.FILES}/isFileExisted`,
    GET_METADATA_BY_ETAG: `${FILES_SERVICE_ENDPOINTS.FILES}/getMetadataByEtag`,
    GET_FILES_BY_BUCKET_NAME: `${FILES_SERVICE_ENDPOINTS.FILES}/getFilesByBucket`,
    GET_FILES_BY_BUCKET_AND_TYPE: `${FILES_SERVICE_ENDPOINTS.FILES}/getFilesByBucketAndType`,
    GET_FILE_BY_NAME: `${FILES_SERVICE_ENDPOINTS.FILES}/getFileByName`,
    GET_FILE_METADATA_MY_NAME: `${FILES_SERVICE_ENDPOINTS.FILES}/getFileMetadataByName`,
    GET_ENCRYPTED_FILE_BY_NAME: `${FILES_SERVICE_ENDPOINTS.FILES}/downloadEncryptedZip`,
    DELETE_FILE: `${FILES_SERVICE_ENDPOINTS.FILES}/delete`,
};



export const uploadFile = async (bucketName: BucketsNames, exerciseType: ExercisesTypes, files: File | File[], metadata: Partial<Metadata>[]): Promise<UploadedObjectInfo[] | UploadedObjectInfo[][] | null> => {
    try {
        const formData = new FormData();
        if (files instanceof File) {
            // Handle a single File

            formData.append('file', files);
            formData.append('bucketName', bucketName);
            formData.append('exerciseType', exerciseType);
            formData.append('metadata', JSON.stringify(metadata));
            console.log("formData", formData);
            const uploadRecordResponse = await fetch(
                FILES_API.UPLOAD_FILE, {
                method: 'POST',
                body: formData,
            })
            if (uploadRecordResponse.ok) {
                const data = await uploadRecordResponse.json();
                const uploadedData = data.uploadedData;
                console.log("uploadRecordResponse", uploadedData);
                return uploadedData;
            } else {
                throw new Error('record - server error');
            }
            // } else if (files instanceof FileList) {
        } else if (Array.isArray(files)) {

            // Handle a FileList
            for (let i = 0; i < files.length; i++) {
                console.log(files[i])
                formData.append('file', files[i]);
            }
            formData.append('bucketName', bucketName);
            formData.append('metadata', JSON.stringify(metadata));
            formData.append('exerciseType', exerciseType);
            console.log("formData", formData);
            const uploadSonolistResponse = await fetch(
                `${FILES_API.UPLOAD_FILE}`, {
                method: 'POST',
                body: formData,
            })
            if (uploadSonolistResponse.ok) {
                const data = await uploadSonolistResponse.json();
                const uploadedData = data.uploadedData;
                console.log("uploadSonolistResponse", uploadedData);
                return uploadedData;
            } else {
                throw new Error('sonolist - server error');
            }
        } else {
            throw new Error('Invalid file type');
        }

    } catch (error: any) {
        console.log(error);
        return null;
    }
}

export const isFileExisted = async (fileName: string, exerciseType: ExercisesTypes, bucketName: BucketsNames): Promise<boolean> => {
    try {
        const response = await fetch(
            `${FILES_API.IS_FILE_EXISTED}/${bucketName}/${exerciseType}/${fileName}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        if (response.ok) {
            const data = await response.json();
            const status = data.status as boolean;
            // console.log('getAllRecords', files);
            return status;
        }
        return false;
    }
    catch (error) {
        throw new Error(`error checking if file existed - ${error}`);
    }
}

export const getFileMetadataByETag = async (bucketName: BucketsNames, etag: string): Promise<{
    name: string,
    id: string,
    metadata: Partial<Metadata>
} | null> => {
    try {
        const response = await fetch(
            `${FILES_API.GET_METADATA_BY_ETAG}/${bucketName}/${etag}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        if (response.ok) {
            const objectInfo = await response.json();
            console.log('getFileMetadataByETag - data', objectInfo);
            // const objectInfo = data.objectInfo;
            return objectInfo;
        }
        return null;
    }
    catch (error) {
        throw new Error(`error getting all records - ${error}`);
    }
}

export const getFileByBucketName = async (bucketName: BucketsNames): Promise<FileType[]> => {
    try {
        const response = await fetch(
            `${FILES_API.GET_FILES_BY_BUCKET_NAME}/${bucketName}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        console.log('getFileByBucketName', response);
        if (response.ok) {
            const data = await response.json();
            console.log('getFileByBucketName', data);
            const files = data.files;
            return files;
        }
        return [];
    }
    catch (error) {
        console.error(`error getting all records - ${error}`);
        return [];
    }
}

export const getFileByBucketAndType = async (bucketName: BucketsNames, exerciseType: ExercisesTypes): Promise<FileType[]> => {
    try {
        const response = await fetch(
            `${FILES_API.GET_FILES_BY_BUCKET_AND_TYPE}/${bucketName}/${exerciseType}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        console.log('getFileByBucketName', response);
        if (response.ok) {
            const data = await response.json();
            console.log('getFileByBucketName', data);
            const files = data.files;
            return files;
        }
        return [];
    }
    catch (error) {
        console.error(`error getting all records - ${error}`);
        return [];
    }
}

export const getFileByName = async (bucketName: BucketsNames, exerciseType: ExercisesTypes, objectName: string): Promise<string | null> => {
    try {
        const response = await fetch(
            `${FILES_API.GET_FILE_BY_NAME}/${bucketName}/${exerciseType}/${objectName}`, {
            method: 'GET',
            credentials: 'include',
        })

        console.log("getFileByName response", response);

        const blob = await response.blob();
        // const blob = await response.blob();
        console.log('getFileByName blob', blob);
        const url = window.URL.createObjectURL(blob);


        return url;
    }
    catch (error) {
        console.error(`error getFileByName - ${error}`);
        return null;
    }
}

export const getEncryptedFileByName = async (bucketName: BucketsNames, exerciseType: ExercisesTypes, objectName: string): Promise<string | null> => {
    try {
        const response = await fetch(
            `${FILES_API.GET_ENCRYPTED_FILE_BY_NAME}/${bucketName}/${exerciseType}/${objectName}`
        )

        console.log("downloadEncryptedZip response", response);
        if (response.status === 200) {
            // console.log("response", response);
            const metadata = response.headers.get(
                "metadata",
            ) as string;

            console.log('metadata', metadata);

            const decodedToken = decode(
                metadata || '',
            );
            console.log('decodedToken', decodedToken);

        }
        const blob = await response.blob();
        // const blob = await response.blob();
        console.log('getEncryptedFileByName blob', blob);
        const url = window.URL.createObjectURL(blob);

        return url;
    }
    catch (error) {
        console.error(`error getFileByName - ${error}`);
        return null;
    }
}

export const getFileMetadataByName = async (bucketName: BucketsNames, exerciseType: ExercisesTypes, objectName: string): Promise<{
    name: string,
    id: string,
    metadata: Partial<Metadata>
} | null> => {
    try {
        console.log('getFileMetadataByName recordId', objectName);
        const response = await fetch(
            `${FILES_API.GET_FILE_METADATA_MY_NAME}/${bucketName}/${exerciseType}/${objectName}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        if (!response.ok) return null;

        const data = await response.json();
        const sonolist = data.sonograms;
        console.log('getSonolistNamesByRecordId sonolist: ', sonolist);
        return sonolist;
    }
    catch (error) {
        console.error(`error getSonolistByRecordId - ${error}`);
        return null;
    }
}

export const deleteFile = async (fileName: string, exerciseType: ExercisesTypes, bucketName: BucketsNames): Promise<boolean> => {
    try {
        const response = await fetch(
            `${FILES_API.DELETE_FILE}/${bucketName}/${exerciseType}/${fileName}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        return response.status === 200;
    } catch (error: any) {
        console.log(error);
        return false;
    }
}