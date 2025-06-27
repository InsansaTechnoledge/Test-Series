export const categoryToRoutes = {
  batch: {
      "/create-batch": {
          "methods": ["POST"],
          "roleFeature": "create_batch"
      },
      "/delete-video": {
          "methods": ["POST"],
          "roleFeature": "delete_video"
      },
      "/update-batch/:id": {
          "methods": ["PATCH"],
          "roleFeature": "edit_batch"
      },
      "/delete-batch/:id": {
          "methods": ["DELETE"],
          "roleFeature": "delete_batch"
      }
  },
  coding: {
      "/create": {
          "methods": ["POST"],
          "roleFeature": "create_contest"
      },
      "/:id": {
          "methods": ["DELETE"],
          "roleFeature": "delete_contest"
      },
  },
  exam: {
   
          "/": {
              "methods": ["POST"],
              "roleFeature": "create_exam"
          },
          "/:id": {
              "methods": ["PATCH"],
              "roleFeature": "edit_exam"
          },
          "/:id": {
              "methods": ["DELETE"],
              "roleFeature": "delete_exam"
          },
          "/:id/go-live": {
              "methods": ["PATCH"],
              "roleFeature": "publish_exam"
          },
          "/upload-json": {
              "methods": ["POST"],
              "roleFeature": "create_exam"
          }
     
  },

  student: {
      "/add-student": {
          "methods": ["POST"],
          "roleFeature": "add_student"
      },
      "/bulk-add": {
          "methods": ["POST"],
          "roleFeature": "add_student"
      },
      "/upload-excel": {
          "methods": ["POST"],
          "roleFeature": "add_student"
      },
      "/:id/upload-profile-photo": {
          "methods": ["POST"],
          "roleFeature": "edit_student"
      },
      "/update/:id": {
          "methods": ["PATCH"],
          "roleFeature": "edit_student"
      },
      "/delete/:ids": {
          "methods": ["DELETE"],
          "roleFeature": "delete_student"
      },
      "/change-batch/:id": {
          "methods": ["PATCH"],
          "roleFeature": "edit_student"
      },
      "/update-batch": {
          "methods": ["PATCH"],
          "roleFeature": "edit_student"
      }
  },
  user: {
      "/create": {
          "methods": ["POST"],
          "roleFeature": "create_user"
      },
      "/update": {
          "methods": ["PATCH"],
          "roleFeature": "edit_user"
      },
      "/changePassword": {
          "methods": ["PATCH"],
          "roleFeature": "edit_user"
      },
      "/forgotPassword": {
          "methods": ["PATCH"],
          "roleFeature": "edit_user"
      },
      "/delete/:userId": {
          "methods": ["DELETE"],
          "roleFeature": "delete_user"
      }
  },
  role: {
      "/": {
          "methods": ["POST"],
          "roleFeature": "create_role"
      },
      "/": {
          "methods": ["PATCH"],
          "roleFeature": "edit_role"
      },
      "/:id": {
          "methods": ["DELETE"],
          "roleFeature": "delete_role"
      }
  },
  video: {

      "/upload": {
          "methods": ["POST"],
          "roleFeature": "add_video"
      }
  }


}
