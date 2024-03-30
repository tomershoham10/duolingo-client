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

// export const uploadFile = async (bucketName: string, files: File | FileList, metadata: Partial<RecordMetadataType> | Partial<SonogramMetadataType>[]): Promise<UploadedObjectInfo[] | UploadedObjectInfo[][]> => {
export const uploadFile = async (bucketName: string, files: File | File[], metadata: Partial<RecordMetadataType> | Partial<SonogramMetadataType>[]): Promise<UploadedObjectInfo[] | UploadedObjectInfo[][] | null> => {
    try {

        const formData = new FormData();
        if (files instanceof File) {
            // Handle a single File

            formData.append('file', files);
            formData.append('bucketName', bucketName);
            formData.append('metadata', JSON.stringify(metadata));
            console.log("formData", formData);
            const uploadRecordResponse = await fetch(
                'http://localhost:4002/api/files/uploadFile/', {
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
            console.log("formData", formData);
            const uploadSonolistResponse = await fetch(
                'http://localhost:4002/api/files/uploadFilesArray/', {
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
        return null;
    }
}

export const isFileExisted = async (fileName: string, bucketName: string): Promise<boolean> => {
    try {
        const response = await fetch(
            `http://localhost:4002/api/files/isFileExisted/${bucketName}/${fileName}`, {
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

export const getFileMetadataByETag = async (bucketName: string, etag: string): Promise<{
    name: string,
    id: string,
    metadata: Partial<RecordMetadataType> | Partial<SonogramMetadataType>
} | null> => {
    try {
        const response = await fetch(
            `http://localhost:4002/api/files/get-metadata-by-etag/${bucketName}/${etag}`, {
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


export const getAllRecords = async (): Promise<RecordType[]> => {
    try {
        const response = await fetch(
            'http://localhost:4002/api/files/get-files-by-bucket/records', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        if (response.ok) {
            const data = await response.json();
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

export const getFileByName = async (bucketName: string, objectName: string): Promise<any> => {
    try {
        const response = await fetch(
            `http://localhost:4002/api/files/download/${bucketName}/${objectName}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        if (response.ok) {
            // const data = await response;
            console.log('getFileByName', response.blob());
            // const files = data.files;
            return response.blob();
        }
        return [];
    }
    catch (error) {
        console.error(`error getting all records - ${error}`);
        return [];
    }
}

export const getAllSonograms = async (): Promise<SonogramType[] | null> => {
    try {
        const response = await fetch(
            'http://localhost:4002/api/files/get-files-by-bucket/sonograms', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        if (response.ok) {
            const data = await response.json();
            const files = data.files;
            return files;
        }
        return null;
    }
    catch (error) {
        throw new Error(`error getting all records - ${error}`);
    }

}

export const getSonolistByRecordId = async (recordId: string): Promise<string[]> => {
    try {
        const response = await fetch(
            `http://localhost:4002/api/files/get-sonolist-url-by-record-id/${recordId}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        if (response.ok) {
            const data = await response.json();
            const sonolist = data.files as string[];
            console.log('getAllRecords', data);
            return sonolist;
        }
        return [];
    }
    catch (error) {
        throw new Error(`error getting all records - ${error}`);
    }
}