import { Schema, Types } from "mongoose";
import { connOne } from "../../database/MongoDB.js";
import bcrypt from 'bcrypt';
import validator from 'validator';

const userSchema = new Schema({

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
  },
  roleId: {
    type: Types.ObjectId,
    ref: 'Role'
  },
  organizationId: {
    type: Types.ObjectId,
    ref: 'Organization'
  },
  batch: {
    type: [String],
    required: [true, 'Batch does not exists'],
    default: []
  },
  //id which is given by the organization
  userId: {
    type: String,
    required: [true, 'UserId is required']
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Others'],
    required: true
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next;
  try {
    this.password = await this.hashPassword(this.password);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.hashPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

const User = connOne.model('User', userSchema);
export default User;