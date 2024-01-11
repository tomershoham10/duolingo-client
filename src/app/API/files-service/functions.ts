export interface UploadedObjectInfo {
    etag: string;
    versionId: string | null;
}

enum Transmissions {
    PASSIVE = 'passive',
    ACTIVE = 'active',
    BOTH = 'both'
}

enum SonarSystem {
    DEMON = 'demon',
    LOFAR = 'lofar'
}

export interface RecordMetadataType {
    record_length: number;
    sonograms_ids: string[];
    difficulty_level: number;
    targets_ids_list: string[];
    operation: string;
    source: string;
    is_in_italy: boolean;
    transmition: Transmissions;
    channels_number: number;
    sonar_system: SonarSystem;
    is_backround_vessels: boolean;
    aux: boolean;
}

export interface SonogramMetadataType {
    targets_ids_list: string[];
    source: string;
    is_in_italy: boolean;
    transmition: Transmissions;
    is_backround_vessels: boolean;
}


export interface RecordType {
    name: string;
    id: string;
    metadata: RecordMetadataType;
}

export interface SonogramType {
    name: string;
    id: string;
    metadata: SonogramMetadataType;
}

export const uploadFile = async (bucketName: string, files: File | FileList): Promise<UploadedObjectInfo[] | UploadedObjectInfo[][]> => {
    try {

        const formData = new FormData();
        if (files instanceof File) {
            // Handle a single File
            const metadata = {
                difficulty_level: 8.5,
                targets_ids_list: ['123a', '1f153'],
                operation: 'op',
                source: '4trgdf',
                is_in_italy: true,
                transmition: 'active',
                channels_number: 2,
                sonar_system: 'lofar',
                is_backround_vessels: false,
                aux: true,
                sonograms_ids: ['asfddaf'],
                record_length: 10
            }
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
        } else if (files instanceof FileList) {
            // Handle a FileList
            for (let i = 0; i < files.length; i++) {
                console.log(files[i])
                formData.append('file', files[i]);
            }
            formData.append('bucketName', bucketName);
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

    } catch (error) {
        throw new Error(`no good ${error}`);
    }
}

export const getAllRecords = async (): Promise<RecordType[] | null> => {
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
            const files = data.files as RecordType[];
            // console.log('getAllRecords', files);
            return files;
        }
        return null;
    }
    catch (error) {
        throw new Error(`error getting all records - ${error}`);
    }
}

export const getSonolistByRecordId = async (recordId: string): Promise<SonogramType[] | null> => {
    try {
        const response = await fetch(
            `http://localhost:4002/api/files/getSonolistByRecordId/${recordId}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        if (response.ok) {
            const data = await response.json();
            const sonolist = data.sonolist as SonogramType[];
            // console.log('getAllRecords', files);
            return sonolist;
        }
        return null;
    }
    catch (error) {
        throw new Error(`error getting all records - ${error}`);
    }
}