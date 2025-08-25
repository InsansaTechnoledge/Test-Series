export const VITE_SECRET_KEY_FOR_CONTEST ='THIS IS SECRET KEY FOR ENCRYPTION'
 
export const VITE_SECRET_KEY_FOR_TESTWINDOW='secret-key-for-encryption'
 
export const VITE_SECRET_KEY_FOR_COUNTDOWN_TIMER='secret-key-for-time-left'
 
export const VITE_PLAN_FEATURE_MAP= `{
  "/institute/batch-list": ["batch_feature"],
  "/institute/certificate-assignment" : ["batch_feature"],
  "/institute/check-logs" : ["batch_feature"],
  "/institute/create-batch": ["batch_feature"],
  "/institute/edit-batch": ["batch_feature"],
  "/institute/batch-details": ["batch_feature"],
  "/institute/student-list": ["student_feature"],
  "/institute/add-student": ["student_feature"],
  "/institute/student-detail": ["student_feature"],
  "/institute/student-edit": ["student_feature"],
  "/institute/create-role-group": ["role_feature"],
  "/institute/create-exam": ["exam_feature"],
  "/institute/result-section": ["exam_feature"],
  "/institute/evaluate-exams" : ["exam_feature"],
  "/institute/create-exam/:examId": ["exam_feature"],
  "/institute/exam-list": ["exam_feature"],
  "/institute/create-user": ["user_feature"], 
  "/institute/user-list": ["user_feature"],
  "/institute/user-detail": ["user_feature"],
  "/institute/user-edit/:id": ["user_feature"],
  "/institute/video-list": ["videoMaterial_feature"],
  "/institute/create-contest": ["coding_feature"],
  "/institute/create-contest/:contestId": ["coding_feature"],
  "/institute/contest-list": ["coding_feature"],
  "/institute/code-create/": ["coding_feature"],
  "/institute/exam-anomaly": ["proctore_feature"],
  "/question-bank": ["questionBank_feature"],
  "/institute/video": ["videoMaterial_feature"],  
  "/institute/video/upload": ["videoMaterial_feature"],
  "/institute/certificate-assignment": ["certification_feature"],

  "/student/upcoming-exams": ["exam_feature"],
  "/student/completed-exams": ["exam_feature"],
  "/student/result/:examId": ["exam_feature"],
  "/student/analysis": ["analysis_feature"],
  "/student/contest/:contestId": ["coding_feature"],
  "/student/code/:contestId": ["coding_feature"],
  "/student/coding-contests": ["coding_feature"],
  "/student/classroom": ["video_feature"],
 

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
 
// export const VITE_API_BASE_URL="https://test-series-1new.onrender.com/api"
export const VITE_API_BASE_URL="http://localhost:8000/api"

export const VITE_ROLE_FEATURE_MAP= `{
  "/institute/batch-list": ["batch:view_batch", "batch:create_batch", "batch:edit_batch"],
  "/institute/create-batch": ["batch:create_batch"],
  "/institute/edit-batch": ["batch:edit_batch"],
  "/institute/batch-details": ["batch:view_batch"],
  
"/institute/student-list": ["student:view_student", "student:add_student", "student:edit_student"],
  "/institute/add-student": ["student:add_student"],
  "/institute/student-detail": ["student:view_student"],
  "/institute/student-edit": ["student:edit_student"],

  "/institute/create-role-group": ["role:create_role","role:edit_role", "role:delete_role"],

  "/institute/create-exam": ["exam:create_exam"],
  "/institute/create-exam/:examId": ["exam:edit_exam"],
  "/institute/exam-list": ["exam:view_exam", "exam:publish_exam", "exam:edit_exam", "exam:delete_exam","exam:create_exam"],
  "/institute/exam-anomaly": ["proctor:monitor_proctored_exam"],

  "/institute/create-user": ["user:create_user"],
  "/institute/user-list": ["user:view_user", "user:edit_user", "user:delete_user","user:create_user"],
  "/institute/user-detail": ["user:view_user"],
  "/institute/user-edit/:id": ["user:edit_user"],

  "/institute/video": ["video:view_video"],
  "/institute/video-list": ["video:view_video", "video:upload_video"],
  "/institute/video/upload": ["video:upload_video"],

  "/institute/certificate-assignment": ["certificate:manage_certificates"],

  "/institute/create-contest": ["code:create_coding_contest"],
  "/institute/create-contest/:contestId": ["code:edit_coding_contest","code:create_coding_contest"],
  "/institute/contest-list": ["code:view_coding_contest", "code:create_coding_contest", "code:edit_coding_contest", "code:delete_coding_contest","code:publish_coding_contest"],

  "/student/upcoming-exams": ["exam:view_exam"],
  "/student/completed-exams": ["exam:view_exam"],
  "/student/result/:examId": ["exam:view_result"],
  "/student/analysis": ["analysis:view_analysis"],

  "/student/contest/:contestId": ["contest:view_contest"],
  "/student/code/:contestId": ["contest:attempt_contest"],
  "/student/coding-contests": ["contest:view_contest"],

  "/student/classroom": ["video:view_video"],

  "actions.createBatch": ["batch:create_batch"],
  "actions.deleteBatch": ["batch:delete_batch"],
  "actions.editBatch": ["batch:edit_batch"],
  "actions.viewBatch": ["batch:view_batch"],
  "actions.editExam": ["exam:edit_exam"],
  "actions.deleteExam": ["exam:delete_exam"],
  "actions.publishExam": ["exam:publish_exam"],
  "actions.createExam": ["exam:create_exam"],
  "actions.createUser": ["user:create_user"],
  "actions.editUser": ["user:edit_user"],
  "actions.deleteUser": ["user:delete_user"],
  "actions.viewUser": ["user:view_user"],
  "actions.addStudent":["student:add_student"],
  "actions.viewStudent": ["student:view_student"],
  "actions.editStudent": ["student:edit_student"],
  "actions.deleteStudent": ["student:delete_student"],
  "actions.createRole": ["role:create_role"],
  "actions.editRole": ["role:edit_role"],
  "actions.deleteRole": ["role:delete_role"],
  "actions.startProctorExam": ["proctor:start_exam"],
  "actions.uploadVideo": ["video:upload_video"],
  "actions.deleteVideo": ["video:delete_video"],
  "actions.deleteContest":["code:delete_coding_contest"],
  "actions.publishContest":["code:publish_coding_contest"],
  "actions.viewReport": ["analysis:view_analysis"]
}`
 export const REACT_APP_GEMINI_API_KEY="AIzaSyCAd5Amk4Z_G20WeQTA8sGhplKgV7yn1Fg"

   // "/institue/qbms": ["exam:create_qb"],