import {Schema} from 'mongoose'
import { connTwo } from '../../database/MongoDB.js';


const certificateTemplateSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    image:{
        type:String,
        required: true
    },
    style:{
        type:String,
        enum:['Academic' , 'Corporate' , 'Minimalist' , 'Custom'],
        default: 'Custom'
    },
    organization_id: {
        type: String,
        required: false, // null for global templates
    },
    is_global: {
        type: Boolean,
        default: true
    }

}, {timestamps: true})

const CertificateTemplate = connTwo.model('CertificateTemplate' , certificateTemplateSchema)

export default CertificateTemplate;