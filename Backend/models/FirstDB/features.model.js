import  {Schema} from 'mongoose'
import { connOne } from '../../database/MongoDB.js';

const FeaturesSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Feature name is required'],
      trim: true,
      maxlength: [100, 'Feature name cannot exceed 100 characters'],
      minlength: [3, 'Feature name must be at least 3 characters'],
      unique: true
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: ''
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'inactive'],
        message: 'Status must be either active or inactive'
      },
      default: 'active',
      index: true
    },
    category: {
      type:String,
      trim: true,
      maxlength: [100, 'Category cannot exceed 100 characters'],
      default: ''
    }

  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret._id;
        ret.id = doc._id.toString();
        return ret;
      }
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret._id;
        ret.id = doc._id.toString();
        return ret;
      }
    }
  }
);

FeaturesSchema.index({ name: 'text', description: 'text' });


FeaturesSchema.statics = {
  async getActiveFeatures() {
    return this.find({ status: 'active' }).exec();
  },
  
  async findByName(name) {
    return this.findOne({ name }).exec();
  },

  // async activateById(id) {
  //   return this.findByIdAndUpdate(
  //     id,
  //     { status: 'active' },
  //     { new: true }
  //   ).exec();
  // },

  // async deactivateById(id) {
  //   return this.findByIdAndUpdate(
  //     id,
  //     { status: 'inactive' },
  //     { new: true }
  //   ).exec();
  // }
};

FeaturesSchema.methods = {
  // activate() {
  //   this.status = 'active';
  //   return this.save();
  // },
  
  // deactivate() {
  //   this.status = 'inactive';
  //   return this.save();
  // },

  toResponse() {
    const obj = this.toObject();
    obj.id = obj._id.toString();
    delete obj._id;
    delete obj.__v;
    return obj;
  }
};

export const Feature = connOne.model('Feature', FeaturesSchema);

