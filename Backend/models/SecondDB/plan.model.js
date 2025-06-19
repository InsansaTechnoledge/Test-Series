import {Schema,Types} from 'mongoose';
import { connTwo } from '../../database/MongoDB.js';

const PlanSchema= new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    features: [{
        featureId:{
        type: Types.ObjectId,
        ref: 'PlanFeature'
        },
        key: {
            type: String,
            required: true,
            trim: true
        },
        value:{
            type:Schema.Types.Mixed,
            required: true
        }
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: Types.ObjectId,
        ref: 'AdminUser',
    }
}, {
    timestamps: true,
    versionKey: false
});

const Plan=connTwo.model('Plan', PlanSchema);
export default Plan;  