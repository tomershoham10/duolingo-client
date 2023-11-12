"use client";
import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import useStore from "@/app/store/useStore";
import { usePopupStore } from "@/app/store/stores/usePopupStore";

library.add(faXmark);

const StartLessonPopup: React.FC = () => {
    const selectedPopup = useStore(
        usePopupStore,
        (state) => state.selectedPopup,
    );
    const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;

    return (
        <div>
            {selectedPopup === "START LESSON" ? (
                <div>
                    <p>start lesson</p>
                </div>
            ) : null}
        </div>
    );
};

export default StartLessonPopup;
