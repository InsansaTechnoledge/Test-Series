// controllers/ai/bloom.controller.js
// import { validateWithBloomService } from "../../utils/ai/validateWithBloom.service.js";
import { APIError } from "../../utils/ResponseAndError/ApiError.utils.js";
import { APIResponse } from "../../utils/ResponseAndError/ApiResponse.utils.js";
import { validateWithBloomService } from "../../utils/validateWithBloom.js";

export const validateBloom = async (req, res) => {
  try {
    const { questionText, bloomLevel } = req.body || {};
    if (!questionText || !bloomLevel) {
      return new APIError(400, ['questionText and bloomLevel are required']).send(res);
    }

    const result = await validateWithBloomService(questionText, bloomLevel);
    // result => { isValid, matchedLevel, raw }
    return new APIResponse(200, result, 'Bloom validation completed').send(res);

  } catch (e) {
    // If OpenAI returns a status, prefer it
    const status = e?.status || 500;
    return new APIError(status, ['Failed to validate Bloom level', e?.message || '']).send(res);
  }
};
