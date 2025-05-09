import {  Schema } from "mongoose";
import { connOne } from "../../database/MongoDB";

const FeaturesSchema = new Schema({

})

export const Feature = connOne.model('Feature' , FeaturesSchema)