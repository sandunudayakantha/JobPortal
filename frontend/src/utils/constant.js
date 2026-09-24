// Add this to your constants file
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const BASE_URL = import.meta.env.VITE_BACKEND_URL ;
export const USER_API_END_POINT = `${BASE_URL}/v1/user`;
export const JOB_API_END_POINT = `${BASE_URL}/v1/job`;
export const APPLICATION_API_END_POINT = `${BASE_URL}/v1/application`;
export const COMPANY_API_END_POINT = `${BASE_URL}/v1/company`;
export const ATS_RESUME_SCORE_END_POINT = `${BASE_URL}/analyze-resume`;