const host = process.env.NEXT_PUBLIC_HOST;

const ROUT = `http://${host}:8080`;

export const COURSES_SERVICE_ENDPOINTS = {
    COURSES: `${ROUT}/api/courses`,
    EXERCISES: `${ROUT}/api/exercises`,
    LESSONS: `${ROUT}/api/lessons`,
    LEVELS: `${ROUT}/api/levels`,
    RESULTS: `${ROUT}/api/results`,
    SOURCES: `${ROUT}/api/sources`,
    TARGETS: `${ROUT}/api/targets`,
    RELEVANT: `${ROUT}/api/relevant`,
    COUNTRIES: `${ROUT}/api/countries`,
    ORGANIZATIONS: `${ROUT}/api/organizations`,
    UNITS: `${ROUT}/api/units`,
};

export const COURSES_API = {
    GET_COURSE_BY_NAME: `${COURSES_SERVICE_ENDPOINTS.COURSES}/getByName`,
    GET_COURSE_DATA_BY_ID: `${COURSES_SERVICE_ENDPOINTS.COURSES}/getCourseDataById`,
    GET_UNSUSPENDED_UNITS_BY_ID: `${COURSES_SERVICE_ENDPOINTS.COURSES}/getUnsuspendedUnitsById`,
    SUSPENDED_UNITS: `${COURSES_SERVICE_ENDPOINTS.COURSES}/suspendUnit`,
    UNSUSPENDED_UNIT: `${COURSES_SERVICE_ENDPOINTS.COURSES}unsuspendUnit`,
};

export const UNITS_API = {
    GET_LEVELS_BY_ID: `${COURSES_SERVICE_ENDPOINTS.UNITS}/getLevelsById`,
    CREATE_BY_COURSE: `${COURSES_SERVICE_ENDPOINTS.UNITS}/createByCourse`,
    GET_UNSUSPENDED_LEVELS_BY_ID: `${COURSES_SERVICE_ENDPOINTS.UNITS}/getUnsuspendedLevelsById`,
    SUSPENDED_LEVEL: `${COURSES_SERVICE_ENDPOINTS.UNITS}/suspendLevel`,
    UNSUSPENDED_LEVEL: `${COURSES_SERVICE_ENDPOINTS.UNITS}/unsuspendLevel`,
};

export const LEVELS_API = {
    GET_LESSONS_BY_ID: `${COURSES_SERVICE_ENDPOINTS.LEVELS}/getLessonsById`,
    GET_UNSUSPENDED_LESSON_BY_ID: `${COURSES_SERVICE_ENDPOINTS.LEVELS}/getsUnsuspendedLessonsById`,
    ADD_LEVEL_BY_UNIT_ID: `${COURSES_SERVICE_ENDPOINTS.LEVELS}/createByUnit`,
    SUSPENDED_LESSON: `${COURSES_SERVICE_ENDPOINTS.LEVELS}/suspendLesson`,
    UNSUSPENDED_LESSON: `${COURSES_SERVICE_ENDPOINTS.LEVELS}/unsuspendLesson`,
};

export const LESSONS_API = {
    GET_EXERCISES_BY_ID: `${COURSES_SERVICE_ENDPOINTS.LESSONS}/getExercisesById`,
    GET_UNSUSPENDED_EXERCISES_BY_ID: `${COURSES_SERVICE_ENDPOINTS.LESSONS}/getUnsuspendedExercisesById`,
    GET_RESULTS_BY_LESSON_AND_USER: `${COURSES_SERVICE_ENDPOINTS.LESSONS}/getResultsByLessonAndUser`,
    ADD_LESSON_BY_LEVEL_ID: `${COURSES_SERVICE_ENDPOINTS.LESSONS}/createByLevel`,
};

export const EXERCISES_API = {
    FSA: `${COURSES_SERVICE_ENDPOINTS.EXERCISES}/fsa`,
    SPOTRECC: `${COURSES_SERVICE_ENDPOINTS.EXERCISES}/spotrecc`,

    GET_EXERCISES_BY_MODEL_ID: `${COURSES_SERVICE_ENDPOINTS.EXERCISES}/getExercisesByModelId`,
    
    GET_RESULT_BY_USER_AND_EXERCISE_ID: `${COURSES_SERVICE_ENDPOINTS.EXERCISES}/getResultByUserAndExerciseId`,
};

export const FSA_API = {
    GET_RELEVANT_BY_ID: `${EXERCISES_API.FSA}/getRelevantByExerciseId`,
    GET_ANSWERS_BY_EXERCISE_ID: `${EXERCISES_API.FSA}/getAnswersByExerciseId`,
}

export const SPOTRECC_API = {
}

export const RESULTS_API = {
    GET_RESULTS_BY_LESSON_AND_USER: `${COURSES_SERVICE_ENDPOINTS.RESULTS}/getResultsByLessonAndUser`,
};
