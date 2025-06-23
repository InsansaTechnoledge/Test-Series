export const VITE_SECRET_KEY_FOR_CONTEST ='THIS IS SECRET KEY FOR ENCRYPTION'
 
export const VITE_SECRET_KEY_FOR_TESTWINDOW='secret-key-for-encryption'
 
export const VITE_SECRET_KEY_FOR_COUNTDOWN_TIMER='secret-key-for-time-left'
 
export const VITE_PLAN_FEATURE_MAP= `{
  "/institute/batch-list": ["batch_feature"],
  "/institute/create-batch": ["batch_feature"],
  "/institute/edit-batch": ["batch_feature"],
  "/institute/batch-details": ["batch_feature"],
  "/institute/student-list": ["student_feature"],
  "/institute/add-student": ["student_feature"],
  "/institute/student-detail": ["student_feature"],
  "/institute/student-edit": ["student_feature"],
  "/institute/create-role-group": ["role_feature"],
  "/institute/create-exam": ["exam_feature"],
  "/institute/create-exam/:examId": ["exam_feature"],
  "/institute/exam-list": ["exam_feature"],
  "/institute/create-user": ["user_feature"],
  "/institute/user-list": ["user_feature"],
  "/institute/user-detail": ["user_feature"],
  "/institute/user-edit/:id": ["user_feature"],
  "/institute/video": ["videoMaterial_feature"],
  "/institute/video-list": ["videoMaterial_feature"],
  "/institute/create-contest": ["coding_feature"],
  "/institute/create-contest/:contestId": ["coding_feature"],
  "/institute/contest-list": ["coding_feature"],
  "/institute/code-create": ["coding_feature"],
  "/student/upcoming-exams": ["exam_feature"],
  "/student/completed-exams": ["exam_feature"],
  "/student/result/:examId": ["exam_feature"],
  "/student/analysis": ["analysis_feature"],
  "/student/contest/:contestId": ["coding_feature"],
  "/student/code/:contestId": ["coding_feature"],
  "/student/coding-contests": ["coding_feature"],
  "/student/classroom": ["videoMaterial_feature"],
  "/video": ["videoMaterial_feature"],
  "/video/upload": ["videoMaterial_feature"],
  "/certificate-creation": ["analysis_feature"],
 
  "actions.createBatch": ["batch_feature"],
  "actions.addStudent": ["student_feature"],
  "actions.createRole": ["role_feature"],
  "actions.createExam": ["exam_feature"],
  "actions.assignExam": ["exam_feature"],
  "actions.createUser": ["user_feature"],
  "actions.startProctorExam": ["proctore_feature"],
  "actions.createContest": ["coding_feature"],
  "actions.uploadVideo": ["videoMaterial_feature"],
  "actions.viewReport": ["analysis_feature"]
}`
 
export const VITE_API_BASE_URL="https://test-series-1new.onrender.com/api"
//  VITE_API_BASE_URL="http://localhost:8000/api"