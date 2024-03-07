export const createCourse = async (name: string): Promise<number | null> => {
    try {
        const response = await fetch("http://localhost:8080/api/courses/", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: name })
        });

        return response.status;

    } catch (error) {
        console.error("Error creating a course:", error);
        return null;
    }
}

export const getCourses = async (): Promise<CoursesType[] | null> => {
    try {
        const response = await fetch("http://localhost:8080/api/courses/", {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        console.log('try');
        if (response.ok) {
            const data = await response.json();
            const coursesList = data.courses as CoursesType[];
            console.log("coursesList check", coursesList);
            return coursesList;
        } else {
            console.error("Failed to fetch courses.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching courses:", error);
        return null;
    }
};

export const getCourseByName = async (courseName: string): Promise<CoursesType | null> => {
    try {
        // console.log("courses api - courseName", courseName);
        const response = await fetch(`http://localhost:8080/api/courses/getByName/${courseName}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        // console.log("courses api - response", response);

        if (response.ok) {
            const data = await response.json();
            const course = data.course as CoursesType;
            // console.log("api getCourseByType", course);
            // console.log("courses api - course", data, course);

            localStorage.setItem(
                "courseData",
                JSON.stringify(course),
            );
            // console.log("getCourseByType", course);
            return course;
        } else {
            console.error("Failed to fetch course.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching course:", error);
        return null;
    }
};

export const getUnitsData = async (courseId: string): Promise<UnitType | null> => {
    try {
        // console.log("getUnitsData", courseId);
        const response = await fetch(
            `http://localhost:8080/api/courses/getUnitsById/${courseId}`,
            {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
        if (response.ok) {
            const data = await response.json();
            const resUnits = data.units;
            // console.log("resUnits", resUnits);
            return resUnits
        } else {
            console.error("Failed to fetch course by id.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching courses:", error);
        return null;
    }
};