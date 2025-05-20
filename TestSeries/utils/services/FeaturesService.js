import api from "./api";

export const fetchFeatures = async () => {
    try {
      const response = await api.get('/v1/feature/all-feature');
  
      const features = response.data?.data;
  
      if (!Array.isArray(features)) {
        console.error("Expected array in response.data.data, got:", features);
        return [];
      }
  
      return features;
    } catch (error) {
      console.error("Error fetching features:", error);
      return [];
    }
  };
  
  