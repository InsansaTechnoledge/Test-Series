import {Schema,Types} from 'mongoose';
import { connTwo } from '../../database/MongoDB.js';

const planFeatureSchema = new Schema({
    key:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    name:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    isActive:{
        type:Boolean,
        default:true
    },
    type: {
      type: String,
      required: true,
      enum: ['boolean', 'number'],
    },
    createdBy: {
        type: Types.ObjectId,
        ref: 'AdminUser',
    }
},{
    timestamps: true,
    versionKey: false
});

const PlanFeature=connTwo.model('PlanFeature', planFeatureSchema);
export default PlanFeature;
