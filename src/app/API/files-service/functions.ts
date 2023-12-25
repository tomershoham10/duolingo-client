export const uploadFile = async (bucketName: string, files: File | FileList): Promise<string> => {
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
            }).then((res) => console.log(res))
            console.log("uploadRecordResponse", uploadRecordResponse);
            return 'ok'
        } else if (files instanceof FileList) {
            // Handle a FileList
            for (let i = 0; i < files.length; i++) {
                console.log(files[i])
                formData.append('file', files[i]);
            }
            formData.append('bucketName', bucketName);
            console.log("formData", formData);
            const uploadRecordResponse = await fetch(
                'http://localhost:4002/api/files/uploadFilesArray/', {
                method: 'POST',
                body: formData,
            }).then((res) => console.log(res))
            console.log("uploadRecordResponse", uploadRecordResponse);
            return 'ok'
        } else {
            throw new Error('Invalid file type');
        }

        // if (uploadRecordResponse.ok) {
        //     return "ok";
        // }
        // else return 'not ok'
    } catch (error) {
        throw new Error('no good')
    }
}