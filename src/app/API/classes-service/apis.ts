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
    SUSPENDED_LESSON: `${COURSES_SERVICE_ENDPOINTS.LEVELS}/suspendLesson`,
    UNSUSPENDED_LESSON: `${COURSES_SERVICE_ENDPOINTS.LEVELS}/unsuspendLesson`,
};

export const LESSONS_API = {
    GET_EXERCISES_BY_ID: `${COURSES_SERVICE_ENDPOINTS.LESSONS}/getExercisesById`,
    GET_UNSUSPENDED_EXERCISES_BY_ID: `${COURSES_SERVICE_ENDPOINTS.LESSONS}/getUnsuspendedExercisesById`,
    GET_RESULTS_BY_LESSON_AND_USER: `${COURSES_SERVICE_ENDPOINTS.LESSONS}/getResultsByLessonAndUser`,
};

export const EXERCISES_API = {
    GET_RELEVANT_BY_ID: `${COURSES_SERVICE_ENDPOINTS.EXERCISES}/getRelevantByExerciseId`,
    GET_ANSWERS_BY_EXERCISE_ID: `${COURSES_SERVICE_ENDPOINTS.EXERCISES}/getAnswersByExerciseId`,
    GET_RESULT_BY_USER_AND_EXERCISE_ID: `${COURSES_SERVICE_ENDPOINTS.EXERCISES}/getResultByUserAndExerciseId`,
};

export const RESULTS_API = {
    GET_RESULTS_BY_LESSON_AND_USER: `${COURSES_SERVICE_ENDPOINTS.RESULTS}/getResultsByLessonAndUser`,
};
