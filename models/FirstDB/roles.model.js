import { Schema, Types } from "mongoose";
import { connOne } from "../../database/MongoDB.js";

const RoleSchema = new Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
        minLength: [2, 'Enter a valid name'],
        validate: {
            validator: function (v) {
                return /^[a-zA-Z ]+$/.test(v);
            },
            message: 'Name should contain only alphabets and spaces',
        }
    },
    features: {
        type: [{type: Types.ObjectId, ref: 'Feature'}],
        required: [true, 'Features are required'],
        default: []
    },
    organizationId: {
        type: Types.ObjectId,
        ref: 'Organization',
        required: [true, 'Organization id is required']
    }
},{
    timestamps: true
})

export const Role = connOne.model('Role' , RoleSchema)
