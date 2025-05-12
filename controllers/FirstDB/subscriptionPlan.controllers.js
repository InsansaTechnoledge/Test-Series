import { SubscriptionPlan } from "../../models/FirstDB/subscriptionPlan.model";
import { APIResponse } from "../../utils/ResponseAndError/ApiResponse.utils";
import { APIError } from '../../utils/ResponseAndError/ApiError.utils'; 

const addSubscription = async (req,res) => {

    try{
        const subscriptionData = req.body;
        
        const newPlan = await SubscriptionPlan.create(subscriptionData);
        
        if(newPlan){
            return new APIResponse(200, newPlan, "new Plan created successfully!").send(res);
        }
        else{
            return new APIResponse(400, ["Bad Reques"]).send(res);
        }
    }
    catch(err){
        console.log(err);
        return new APIError(500, [err.response.message,"Internal server error"]).send(res);
    }
}