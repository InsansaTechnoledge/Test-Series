import { Schema, Types } from "mongoose";
import { connOne } from "../../database/MongoDB.js";
import bcrypt from 'bcrypt';
import validator from 'validator';

const batchSchema = new Schema({
    previousBatch: {
        type:[String],
        default: []
    },
    currentBatch: {
        type: String,
        required: [true, 'current batch is required'],
        trim: true
    }    
},
{_id: false }
);

const studentSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'name is required'],
        minLength: [2, 'enter a valid name'],
        validate: {
            validator: function (v) {
                return /^[a-zA-Z ]+$/.test(v);
            },
            message: 'Name should contain only alphabets and spaces',
        }
    },
    profilePhoto: {
        type: String,
        default: function () {
            return `https://ui-avatars.com/api/?name=${encodeURIComponent(this.name)}&background=random`;
          }
    },
    email: {
        type: String,
        unique: [true, "Email already exists"],
        minLength: [10, 'Enter a valid email'],
        trim: true,
        required: true,
        lowercase: true,
        maxLength: [60, 'email length exeeds '],
        validate: {
            validator: function (v) {
                return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
            },
            message: 'Please enter a valid email address',
        },
    },
    password: {
        type: String,
        select: false, // Exclude password from queries
        trim: true,
        validate: {
            validator: function (value) {
                return validator.isStrongPassword(value, {
                    minLength: 8,
                    minLowercase: 1,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 1,
                });
            },
            message:
                'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.',
        },
        required: true
    },
    organizationId: {
        type: Types.ObjectId,
        ref: "Organization",
        required: [true, 'Student should belong to any organization']
    },
    phone: {
        type: Number,
        unique: [true, 'Phone number already exists'],
        // validate: {
        //     validator: function (v) {
        //         return /^[6-9]\d{9}$/.test(v); // Indian mobile number format
        //     },
        //     message: 'Please enter a valid 10-digit phone number',
        // },
    },
    parentPhone: {
        type: Number,
        // validate: {
        //     validator: function (v) {
        //         return /^[6-9]\d{9}$/.test(v);
        //     },
        //     message: 'Please enter a valid 10-digit parent phone number',
        // },
    },
    parentEmail: {
        type: String,
        minLength: [10, 'Enter a valid email'],
        trim: true,
        lowercase: true,
        maxLength: [60, 'email length exeeds '],
        validate: {
            validator: function (v) {
                return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
            },
            message: 'Please enter a valid email address',
        },
    },
    batch: {
        type: batchSchema,
    },
    // StudentId: {
    //     type: String,
    //     required: [true, "Student ID is required"],
    //     unique: [true, "Student ID must be unique"]
    // },
    gender:{
        type:String,
        enum:['Male', 'Female' , 'Other'],
        required: true
    } 
}, {
    timestamps: true
});

studentSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next;
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = bcrypt.hash(this.password, salt);
    } catch (err) {
        next(err);
    }
});

studentSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const Student = connOne.model('Student', studentSchema);
export default Student;