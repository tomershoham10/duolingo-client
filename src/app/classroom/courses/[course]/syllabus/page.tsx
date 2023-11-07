"use client";
import { useState, useEffect } from "react";
import { useCourseStore } from "@/app/store/stores/useCourseStore";
import { useUserStore } from "@/app/store/stores/useUserStore";
import useStore from "@/app/store/useStore";
import Button, { Color } from "@/app/components/Button/page";
import { usePopupStore } from "@/app/store/stores/usePopupStore";
import { AlertSizes, useAlertStore } from "@/app/store/stores/useAlertStore";
import AdminUnit from "@/app/components/UnitSection/AdminUnit/page";

const Syllabus: React.FC = () => {
    const courseId = useStore(useCourseStore, (state) => state.courseId);

    const userRole = useStore(useUserStore, (state) => state.userRole);

    const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;

    const addAlert = useAlertStore.getState().addAlert;

    const [unitsIds, setUnitsIds] = useState<string[]>([]);
    // console.log("unitsIds", unitsIds);

    useEffect(() => {
        if (courseId) {
            // console.log("syllabus1", courseId);
            getUnits();
        }
    }, [courseId]);

    const AddUnit = async () => {
        try {
            if (courseId === undefined) {
                addAlert("Error starting the course", AlertSizes.small);
                return;
            }
            const response = await fetch(
                "http://localhost:8080/api/units/createByCourse",
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        unitData: { levels: [] },
                        courseId: courseId,
                    }),
                },
            );

            if (response.status === 200) {
                getUnits();
            }

            // console.log(response);
        } catch (err) {
            console.log(err);
        }
    };

    const getUnits = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/courses/${courseId}`,
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
                const course = data.course;
                const unitsIdsList = course.units;
                // console.log("syllabus2", unitsIdsList);
                setUnitsIds(unitsIdsList);
            } else {
                console.error("Failed to fetch course by id.");
                return [];
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
            return [];
        }
    };

    return (
        <div className="w-full h-full overflow-y-auto mx-1">
            {unitsIds ? (
                unitsIds.length > 0 ? (
                    <AdminUnit />
                ) : (
                    <div className="">0 units</div>
                )
            ) : (
                <div className="w-full flex flex-col justify-start h-full">
                    <span className="text-2xl flex-none text-duoGray-darkest font-extrabold">
                        0 units
                    </span>
                    <Button
                        label={"START COURSE"}
                        color={Color.blue}
                        onClick={() => {
                            AddUnit();
                        }}
                        style={
                            "w-44 flex-none mt-[] mx-auto flex justify-center items-cetnter"
                        }
                    />
                </div>
            )}
        </div>
    );
};

export default Syllabus;
