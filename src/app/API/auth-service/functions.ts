export const getZipPassword = async (recordName: string): Promise<number | null> => {
    try {
        const response = await fetch(`http://localhost:4000/api/auth/getRecordZipPassword/${recordName}`, {
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