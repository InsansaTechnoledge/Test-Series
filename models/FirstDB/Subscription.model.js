import { Schema } from "mongoose";
import { connOne } from "../../database/MongoDB.js";

const subscriptionSchema =  new Schema({

})

export const Subscription =  connOne.model('Subscription' , subscriptionSchema)
