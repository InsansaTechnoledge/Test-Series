import { Schema } from "mongoose";
import { connOne } from "../../database/MongoDB.js";


const RoleSchema = new Schema({

})

export const Role = connOne.model('Role' , RoleSchema)
