import { Schema, Types } from "mongoose";
import { connOne } from "../../database/MongoDB.js";

const subscriptionPlanSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Plan name is required'],
      trim: true,
      maxlength: [50, 'Plan name cannot exceed 50 characters'],
      unique: true,
      index: true
    },
    features: [
      {
        type: Types.ObjectId,
        ref: 'Feature',
        required: true,
        validate: {
          validator: async function(featureIds) {
            
            const featureCount = await connOne.model('Feature').countDocuments({
              _id: { $in: featureIds },
              status: 'active' // Only allow active features
            });
            return featureCount === featureIds.length;
          },
          message: 'One or more features are invalid or inactive'
        }
      }
    ],
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
      set: (v) => parseFloat(v.toFixed(2)) 
    },
    validity: {
        type: Number,
        required: [true, 'Validity period is required'],
        min: [1, 'Validity must be at least 1 day'],
        description: 'Duration in days'
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    },
    maxUsers: {
      type: Number,
      min: [1, 'Must allow at least 1 user'],
      default: 1
    },
    metadata: {
      displayOrder: { type: Number, default: 0 },
      popular: { type: Boolean, default: false },
      recommended: { type: Boolean, default: false }
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

subscriptionPlanSchema.virtual('featureDetails', {
  ref: 'Feature',
  localField: 'features',
  foreignField: '_id',
  justOne: false
});

subscriptionPlanSchema.virtual('expiryDate').get(function() {
    const date = new Date();
    date.setDate(date.getDate() + this.validity);
    return date;
});

subscriptionPlanSchema.virtual('formattedValidity').get(function() {
    if (this.validity === 1) return '1 day';
    if (this.validity < 30) return `${this.validity} days`;
    if (this.validity === 30) return '1 month';
    if (this.validity < 365) return `${Math.round(this.validity/30)} months`;
    if (this.validity === 365) return '1 year';
    return `${Math.round(this.validity/365)} years`;
});

// Indexes
subscriptionPlanSchema.index({ name: 'text', description: 'text' });
subscriptionPlanSchema.index({ 'metadata.popular': 1, 'metadata.recommended': 1 });

// Static methods
subscriptionPlanSchema.statics = {
  async createWithFeatures(planData, featureIds) {
    const plan = new this(planData);
    plan.features = featureIds;
    await plan.save();
    return plan.populate('features');
  },

  async getPlansWithFeatures(filter = {}) {
    return this.find(filter)
      .populate('features', 'name description status')
      .sort({ 'metadata.displayOrder': 1, price: 1 });
  },

  async findByIdWithFeatures(id) {
    return this.findById(id)
      .populate('features', 'name description status');
  },

  async addFeaturesToPlan(planId, featureIds) {
    return this.findByIdAndUpdate(
      planId,
      { $addToSet: { features: { $each: featureIds } } },
      { new: true }
    ).populate('features');
  },

  async removeFeaturesFromPlan(planId, featureIds) {
    return this.findByIdAndUpdate(
      planId,
      { $pull: { features: { $in: featureIds } } },
      { new: true }
    ).populate('features');
  }
};

// Instance methods
subscriptionPlanSchema.methods = {
  async getFeatureNames() {
    await this.populate('features');
    return this.features.map(f => f.name);
  },

  async hasFeature(featureId) {
    return this.features.some(id => id.equals(featureId));
  },

  async syncFeatures(newFeatureIds) {
    this.features = newFeatureIds;
    await this.save();
    return this.populate('features');
  },

  toJSONWithFeatures() {
    const obj = this.toObject();
    if (this.featureDetails) {
      obj.features = this.featureDetails.map(f => ({
        id: f._id.toString(),
        name: f.name,
        description: f.description
      }));
    }
    return obj;
  }
};

// Hooks
subscriptionPlanSchema.pre('save', async function(next) {
  if (this.isModified('features')) {
    const Feature = connOne.model('Feature');
    const validFeatures = await Feature.find({
      _id: { $in: this.features },
      status: 'active'
    });
    
    if (validFeatures.length !== this.features.length) {
      throw new Error('Cannot add inactive or non-existent features');
    }
  }
  next();
});

subscriptionPlanSchema.post('save', async function(doc) {
  // Update feature references if needed
  await doc.populate('features').execPopulate();
});

export const SubscriptionPlan = connOne.model('SubscriptionPlan', subscriptionPlanSchema);