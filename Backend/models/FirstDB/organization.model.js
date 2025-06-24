import {Schema , Types } from 'mongoose'
import validator from 'validator';
import bcrypt from 'bcrypt';
import { connOne } from '../../database/MongoDB.js';
import { getTotalBatches } from '../../controllers/SupabaseDB/batch.controllers.js';


const addressSchema = new Schema({
  line1: {
    type: String,
    required: true,
    trim: true,
  },
  line2: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    trim: true,
  },
  pincode: {
    type: String,
    required: true,
    match: /^[0-9]{5,6}$/ // pincode validation
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: false
    }
  }
}, {
  _id: false
});

const subscriptionSchema = new Schema({
    plan: { 
        type: Types.ObjectId, 
        ref: 'SubscriptionPlan'  
    },
    startDate: { 
        type: Date 
    },
    endDate: { 
        type: Date 
    },
    status: { 
        type: String, 
        enum: ['active', 'cancelled', 'trialing', 'inactive'], 
        default: 'trialing' 
    }
},
{
    _id: false
});


const youtubeInfoSchema=new Schema({
user:{
    googleId: { type: String, required: true },
    name: { type: String, required: true },
    profilePhoto: { type: String, required: true },
    email: { type: String, required: true, unique: true}

},
  tokens:{

      accessToken: { type: String, required: true },
      refreshToken: { type: String, required: true },
      expiry: { type: Date, required: true },
    
  }

},
{_id: false});

const OrganizationSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: [3 , 'name shall be length 3 (minimum) '],
        maxlength: [32, 'maximum lenght exeeds (32)'],
        unique: [true, 'institute by this name already exists'],
        trim: true,
    },
    email: {
        type: String,
        unique: [true, 'Email already exists'],
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        minLength: [10, 'Enter a valid email'],
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
            select: false, 
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
      phone: {
        type: String,
        trim: true,
        validate: {
          validator: function (v) {
            return /^(\+\d{1,3}[- ]?)?\d{10}$/.test(v); // +91-9876543210 or 9876543210
          },
          message: props => `${props.value} is not a valid phone number!`
        },
        maxlength: 15,
        minlength: 10
      },
      logoUrl: {
        type: String,
        default: function () {
          return `https://ui-avatars.com/api/?name=${encodeURIComponent(this.name)}&background=random`;
        }
      },
      address : addressSchema,
      website:{
        type: String
      },
      active:{
        type: Boolean,
        default: true
      },
      subscription: subscriptionSchema,
      youtubeInfo: youtubeInfoSchema,
      planPurchased:{
        type: Types.ObjectId,
        ref: 'Plan'
      },
      
totalExams: {
        type: Number,
        default: 0,
      },
}, 
{
    timestamps: true
})

OrganizationSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next;
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    next(err);
  }
});

OrganizationSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

OrganizationSchema.virtual('totalStudents',{
  ref: 'Student',
  localField: '_id',
  foreignField: 'organizationId',
  count: true
});

OrganizationSchema.virtual('totalUsers',{
  ref: 'User',
  localField: '_id',
  foreignField: 'organizationId',
  count: true
});

OrganizationSchema.virtual('totalRoleGroups',{
  ref: 'Role',
  localField: '_id',
  foreignField: 'organizationId',
  count: true
})


OrganizationSchema.methods.getFullMetadata = async function () {
  await this.populate('totalStudents totalUsers totalRoleGroups');

  const totalBatches = await getTotalBatches(this._id.toString());

  return {
    totalStudents: this.totalStudents ?? 0,
    totalUsers: this.totalUsers ?? 0,
    totalBatches: totalBatches ?? 0,
    totalExams: this.totalExams ?? 0,
    totalRoleGroups: this.totalRoleGroups ?? 0
  };
};


OrganizationSchema.set('toObject', { virtuals: true });
OrganizationSchema.set('toJSON', { virtuals: true });


export const Organization = connOne.model('Organization' , OrganizationSchema)

