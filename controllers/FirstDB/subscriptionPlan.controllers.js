import { SubscriptionPlan } from "../../models/FirstDB/subscriptionPlan.model.js";
import { APIResponse } from "../../utils/ResponseAndError/ApiResponse.utils.js";
import { APIError } from '../../utils/ResponseAndError/ApiError.utils.js';

export const addSubscription = async (req, res) => {

    try {
        const subscriptionData = req.body;

        const newPlan = await SubscriptionPlan.create(subscriptionData);

        return new APIResponse(200, newPlan, "new Plan created successfully!").send(res);

    }
    catch (err) {
        console.log(err);
        return new APIError(err?.response?.status || 500, ["Something went wrong while Adding subscription", err.message]).send(res);
    }
}

export const deleteSubscription = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedPlan = await SubscriptionPlan.findByIdAndDelete(id);

        return new APIResponse(200, deletedPlan, "Plan deleted successfully");

    }
    catch (err) {
        console.log(err);
        return new APIError(err?.response?.status || 500, ["Something went wrong while Deleting subscription", err.message]).send(res);
    }
}

export const updateSubscription = async (req, res) => {
    try {
        const { id } = req.params;
        const subscriptionData = req.body;
        const updatedPlan = await SubscriptionPlan.findByIdAndUpdate(id, subscriptionData, {
            new: true
        });

        return new APIResponse(200, updatedPlan, "Plan updated successfully!").send(res);

    }
    catch (err) {
        console.log(err);
        return new APIError(err?.response?.status || 500, ["Something went wrong while Updating subscription", err.message]).send(res);
    }
}

export const getSubscriptionPlans = async (req, res) => {
    try {
        const plans = await SubscriptionPlan.find().populate('features').lean();
        return new APIResponse(200, plans, "Subscription plans fetched successfully").send(res);
    }
    catch (err) {
        console.log(err);
        return new APIError(err?.response?.status || 500, ["Something went wrong while fetching subscriptions", err.message]).send(res);

    }
}

export const getSubscriptionPlanById = async (req, res) => {
    try {
        const { id } = req.params;
        const plan = await SubscriptionPlan.findById(id).populate('features').lean();
        return new APIResponse(200, plan, "Plan fetched successfully!");

    }
    catch (err) {
        console.log(err);
        return new APIError(err?.response?.status || 500, ["Something went wrong while fetching subscriptions", err.message]).send(res);
    }
}

export const getSubscriptionFeaturesByPlanId = async (req, res) => {
    try {
        const { id } = req.params;
        const features = await SubscriptionPlan.findById(id, { features:1}).populate().lean();

        return new APIResponse(200, features, "Plan Features fetched successfully!");

    }
    catch (err) {
        console.log(err);
        return new APIError(err?.response?.status || 500, ["Something went wrong while fetching subscription features", err.message]).send(res);

    }
}

export const addNewFeaturesToPlan = async (req, res) => {
    try {

        const { id } = req.params;
        const { features } = req.body;

        const updatedPlan = await SubscriptionPlan.addFeaturesToPlan(id, features);

        return new APIResponse(200, updatedPlan, "Plan updated").send(res);
    }
    catch (err) {
        return new APIError(err?.response?.status || 500, ["Something went wrong while adding features to subscription", err.message]).send(res);
    }
}

export const removeOldFeaturesFromPlan = async (req, res) => {
    try {

        const { id } = req.params;
        const { features } = req.body;

        const updatedPlan = await SubscriptionPlan.removeFeaturesFromPlan(id, features);

        return new APIResponse(200, updatedPlan, "Plan updated").send(res);
    }
    catch (err) {
        return new APIError(err?.response?.status || 500, ["Something went wrong while removing features from subscription", err.message]).send(res);
    }
}

