import xlsx from 'xlsx';
import fs from 'fs';
import bcrypt from 'bcrypt';
import Student from '../../models/FirstDB/student.model.js';
import { APIError } from '../../utils/ResponseAndError/ApiError.utils.js';
import { APIResponse } from '../../utils/ResponseAndError/ApiResponse.utils.js';

export const createOneStudent = async (req, res) => {
    try{
        const data = req.body 

        if(!data.name || !data.email || !data.password || !data.gender) return new APIError(401 , 'required data is missing from student').send(res)

        const upload = Student.create(data)

        return new APIResponse(200 , upload , ['sudents created successfully']).send(res)
    } catch(e) {
       new APIError(err?.response?.status || err?.status || 500, ["Something went wrong while creating the user", err.message || ""]).send(res);

    }
}

export const bulkCreateStudents = async (req, res) => {
    try {
      const students = req.body;
  
      if (!Array.isArray(students) || students.length === 0) {
        return new APIError(400, 'No student data provided or invalid format').send(res);
      }
  
      const preparedStudents = await Promise.all(
        students.map(async (student) => {
          if (!student.name || !student.email || !student.password || !student.gender) {
            throw new Error(`Missing fields in student: ${student.email || 'unknown'}`);
          }
  
          const hashedPassword = await bcrypt.hash(student.password, 12);
          return {
            ...student,
            password: hashedPassword
          };
        })
      );
  
      const inserted = await Student.insertMany(preparedStudents);
      return new APIResponse(201, inserted, 'Students uploaded successfully').send(res);
    } catch (err) {
      console.error('Bulk Upload Error:', err);
      new APIError(err?.response?.status || err?.status || 500, ["Something went wrong during bulk upload", err.message || ""]).send(res);
      
    }
};

export const uploadStudentExcel = async (req, res) => {
  try {
    if (!req.file) {
      return new APIError(400, 'No file uploaded').send(res);
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData = xlsx.utils.sheet_to_json(sheet);

    // const students = await Promise.all(
    //   rawData.map(async (s, i) => {
    //     if (!s.name || !s.email || !s.password || !s.gender) {
    //       throw new Error(`Row ${i + 2} is missing required fields`);
    //     }
    //     return {
    //       ...s,
    //       password: await bcrypt.hash(s.password, 10)
    //     };
    //   })
    // );

    const students = await Promise.all(
      rawData.map(async (s, i) => {
        const name = `${s.FirstName || ''} ${s.LastName || ''}`.trim();
        const email = s.Email?.trim();
        const password = s.Password || generateRandomPassword();
        const gender = normalizeGender(s.Gender);
        const phone = normalizePhone(s.PhoneNumber);
        const parentPhone = normalizePhone(s.ParentPhone);
        const parentEmail = s.ParentEmail?.trim();
    
        if (!name || !email || !password || !gender) {
          throw new Error(`Row ${i + 2} is missing required fields`);
        }
    
        return {
          name,
          email,
          gender,
          phone,
          parentPhone,
          parentEmail,
          password: await bcrypt.hash(password, 10)
        };
      })
    );
    
    function normalizeGender(gender) {
      if (!gender) return '';
      const g = gender.toString().trim().toLowerCase();
    
      if (g === 'm' || g === 'male') return 'Male';
      if (g === 'f' || g === 'female') return 'Female';
      if (g === 'o' || g === 'others' || g === 'other') return 'Others';
      
      return ''; 
    }
    
    
    function normalizePhone(p) {
      if (!p) return '';
      const digits = p.toString().replace(/\D/g, '').slice(-10);
      return digits;
    }
    
    function generateRandomPassword() {
      return 'Temp@1234'; 
    }

    const inserted = await Student.insertMany(students);

    // Cleanup file
    fs.unlinkSync(req.file.path);

    return new APIResponse(201, inserted, 'Students uploaded via Excel').send(res);
  } catch (err) {
    console.error('Excel Upload Error:', err);
   new APIError(err?.response?.status || err?.status || 500, ["Something went wrong while uploading the excel", err.message || ""]).send(res);

  }
};

export const getAllStudents = async (req, res) => {
    try{

        const data = await Student.find();

        if(data.length === 0) return new APIError(404, 'no students found').send(res)

        return new APIResponse(200, data , 'Students fetched successfully').send(res);
    } catch (e) {
        new APIError(err?.response?.status || err?.status || 500, ["Something went wrong while fetching list of students", err.message || ""]).send(res);

    }
}

export const uploadProfileImage = async (req , res) => {
    try{

        const { id } = req.params;

        const profilePicUrl = req.file?.path || req.file?.secure_url;

        if (!profilePicUrl) return new APIError(404, 'Profile picture upload failed').send(res);

        const student = await Student.findByIdAndUpdate(id , {profilePhoto: profilePicUrl} , {new: true})

        if (!student) return new APIError(401, 'Student not found').send(res);

        return new APIResponse(200, student, 'Profile pic uploaded successfully').send(res);

    } catch (e) {
       new APIError(err?.response?.status || err?.status || 500, ["Something went wrong while uploading the profile image", err.message || ""]).send(res);

    }
}

export const updateStudent = async (req,res) => {
    try{
        const data = req.body

        const {id} = req.params

        const student = await  Student.findById(id)

        if (!student) return new APIError(401, 'Student not found').send(res);

        const updated = await Student.findByIdAndUpdate(id , {...data} , {new: true})

        return new APIResponse(200, updated , 'student data updated').send(res);

    } catch(e) {
        new APIError(err?.response?.status || err?.status || 500, ["Something went wrong while updating the students", err.message || ""]).send(res);


    }
}

export const deleteStudent = async (req, res) => {
    try{
        const {ids} = req.params;
        const idsArray = ids.split(',');
        if (!ids) return new APIError(401, 'Student ids not found').send(res);
        const student = await  Student.deleteMany({_id: {$in: idsArray}})
        if (!student) return new APIError(401, 'Student not found').send(res);
                return new APIResponse(200, null , 'student data deleted').send(res);


    } catch(err) {
       new APIError(err?.response?.status || err?.status || 500, ["Something went wrong while deleting the students", err.message || ""]).send(res);
       

    }
}

export const changeStudentBatch = async (req, res) => {
    try{

        const {id} = req.params

        const {BatchId} = req.body

        const student = await  Student.findById(id)

        if (!student) return new APIError(401, 'Student not found').send(res);


        const update = await Student.findByIdAndUpdate(id, {batchId: BatchId} , {new: true});

        return new APIResponse(200, update , 'student Batch updated').send(res);

    } catch(e) {
       new APIError(err?.response?.status || err?.status || 500, ["Something went wrong while changing the batch of students", err.message || ""]).send(res);


    }
}

export const getAllStudentOfBatch = async (req, res) => {
  try{

    const {BatchId} = req.params
    const students = await Student.find({batchId : BatchId}).select('-batchId')

    if(students.length === 0) return APIError(403 , 'Students not found').send(res);

    return new APIResponse(200, students , 'fetched all student of this batch').send(res);

  } catch (e) {
    new APIError(err?.response?.status || err?.status || 500, ["Something went wrong while fetching the students of this batch", err.message || ""]).send(res);

  }
}