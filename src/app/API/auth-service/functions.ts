const host = process.env.NEXT_PUBLIC_HOST;

const ROUT = `http://${host}:4000`;

const AUTHENTICATION_SERVICE_ENDPOINT = `${ROUT}/api/auth`;

export const AUTH_API = {
    GET_RECORD_ZIP_PASSWORD: `${AUTHENTICATION_SERVICE_ENDPOINT}/getRecordZipPassword`,
}

export const getZipPassword = async (fileRoute: FileRoute): Promise<number | null> => {
    try {

        const encodedObjectName = encodeURIComponent(fileRoute.objectName);


        const response = await fetch(`
            ${AUTH_API.GET_RECORD_ZIP_PASSWORD}/${fileRoute.mainId}/${fileRoute.subTypeId}/${fileRoute.modelId}/${fileRoute.fileType}/${encodedObjectName}`
            , {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        if (response.ok) {
            const res = await response.json();
            const password = res.zipPassword as number;
            console.log("password", password);
            return password;
        } else return null;
    }
    catch (error) {
        console.error("Error while fetching zip password:", error);
        return null;
    }
}