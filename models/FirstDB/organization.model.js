import {Schema} from 'mongoose'
import { connOne } from "../../database/MongoDB.js";


const OrganizationSchema = new Schema({

})
    
export const Organization =  connOne.model('Organization' , OrganizationSchema)


