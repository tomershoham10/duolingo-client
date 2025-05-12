
async function deleteItemById(id: string, api_path: string): Promise<any> {
    try {
        const response = await fetch(
            `${api_path}/${id}`,
            {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );

        return response.status === 201;
    } catch (error: any) {
        throw new Error(`error while addLessonByLevelId: ${error.message}`);
    }
}

export default deleteItemById;

