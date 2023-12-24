export const uploadFile = async (bucketName: string, file: File): Promise<string> => {
    try {

        const formData = new FormData();
        formData.append('file', file);
        formData.append('bucketName', bucketName);
        console.log("formData", formData);
        const uploadRecordResponse = await fetch(
            'http://localhost:4002/api/files/uploadRecord/', {
            method: 'POST',
            body: formData,
            // headers: {
            //     "Content-Type": "multipart/form-data"
            // }
        }).then((res) => console.log(res))
        console.log("uploadRecordResponse", uploadRecordResponse);
        return 'ok'
        // if (uploadRecordResponse.ok) {
        //     return "ok";
        // }
        // else return 'not ok'
    } catch (error) {
        throw new Error('no good')
    }
}