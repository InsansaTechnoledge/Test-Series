import api from "./api";

export const fetchFeatures = async () => {
      const response = await api.get('/v1/feature/all-feature');
  
      const features = response.data;
  
      return features;
    
  };
  
  