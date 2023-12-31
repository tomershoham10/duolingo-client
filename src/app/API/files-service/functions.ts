export interface UploadedObjectInfo {
    etag: string;
    versionId: string | null;
}

export const uploadFile = async (bucketName: string, files: File | FileList): Promise<UploadedObjectInfo[] | UploadedObjectInfo[][    ]> => {
    try {

        const formData = new FormData();
        if (files instanceof File) {
            // Handle a single File
            formData.append('file', files);
            formData.append('bucketName', bucketName);
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