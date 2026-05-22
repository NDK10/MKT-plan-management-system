import React from "react";
import axiosApi from "../axiosConfig/AxiosApi";
import { API_URL } from "../axiosConfig/Api";

const AIService = {
  chatAI: async (message: string, files: any[]) => {
    const formData = new FormData();

    formData.append("message", message);

    files.forEach((file) => {
      formData.append("files", file.originFileObj);
    });

    return axiosApi.post(`${API_URL}/api/openai/chat`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default AIService;
