export const categoryToRoutes = {
    batch: {
      "/create-batch": {
        POST: { roleFeature: "create_batch" }
      },
      "/delete-video": {
        POST: { roleFeature: "delete_video" }
      },
      "/update-batch/:id": {
        PATCH: { roleFeature: "edit_batch" }
      },
      "/delete-batch/:id": {
        DELETE: { roleFeature: "delete_batch" }
      }
    },
    coding: {
      "/create": {
        POST: { roleFeature: "create_contest" }
      },
      "/:id": {
        DELETE: { roleFeature: "delete_contest" }
      }
    },
    exam: {
      "/": {
        POST: { roleFeature: "create_exam" }
      },
      "/:id": {
        PATCH: { roleFeature: "edit_exam" },
        DELETE: { roleFeature: "delete_exam" }
      },
      "/:id/go-live": {
        PATCH: { roleFeature: "publish_exam" }
      },
      "/upload-json": {
        POST: { roleFeature: "create_exam" }
      }
    },
    student: {
      "/add-student": {
        POST: { roleFeature: "add_student" }
      },
      "/bulk-add": {
        POST: { roleFeature: "add_student" }
      },
      "/upload-excel": {
        POST: { roleFeature: "add_student" }
      },
      "/:id/upload-profile-photo": {
        POST: { roleFeature: "edit_student" }
      },
      "/update/:id": {
        PATCH: { roleFeature: "edit_student" }
      },
      "/delete/:ids": {
        DELETE: { roleFeature: "delete_student" }
      },
      "/change-batch/:id": {
        PATCH: { roleFeature: "edit_student" }
      },
      "/update-batch": {
        PATCH: { roleFeature: "edit_student" }
      }
    },
    user: {
      "/create": {
        POST: { roleFeature: "create_user" }
      },
      "/update": {
        PATCH: { roleFeature: "edit_user" }
      },
      "/changePassword": {
        PATCH: { roleFeature: "edit_user" }
      },
      "/forgotPassword": {
        PATCH: { roleFeature: "edit_user" }
      },
      "/delete/:userId": {
        DELETE: { roleFeature: "delete_user" }
      }
    },
    role: {
      "/": {
        POST: { roleFeature: "create_role" },
        PATCH: { roleFeature: "edit_role" }
      },
      "/:id": {
        DELETE: { roleFeature: "delete_role" }
      }
    },
    video: {
      "/upload": {
        POST: { roleFeature: "add_video" }
      }
    }
  };