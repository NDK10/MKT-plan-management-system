import React from "react";
import axiosApi from "../axiosConfig/AxiosApi";

const CampaignService = {
  create: async (data: any) => {
    return axiosApi.post("http://localhost:8063/api/campaigns", data);
  },
};
export default CampaignService;
