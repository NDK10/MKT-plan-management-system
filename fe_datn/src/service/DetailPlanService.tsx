import React from "react";
import axiosApi from "../axiosConfig/AxiosApi";
import { API_URL } from "../axiosConfig/Api";

const DetailPlanService = {
  create: async (data: any) => {
    return axiosApi.post(`${API_URL}/api/detail-plans/create`, data);
  },
  update: async (data: any) => {
    return axiosApi.put(`${API_URL}/api/detail-plans/update`, data);
  },
  delete: async (id: number) => {
    return axiosApi.delete(`${API_URL}/api/detail-plans/delete/${id}`);
  },
  search: async (data: any) => {
    return axiosApi.post(`${API_URL}/api/detail-plans/search`, data);
  },
  updateContent: async (data: any) => {
    return axiosApi.post(`${API_URL}/api/detail-plans/update-content`, data);
  },
  updateStatusComplete: async (id: number) => {
    return axiosApi.post(
      `${API_URL}/api/detail-plans/update-status-complete/${id}`,
    );
  },
  approveContent: async (data: any) => {
    return axiosApi.post(`${API_URL}/api/detail-plans/approve-content`, data);
  },
  searchByCalendar: async (data: any) => {
    return axiosApi.post(
      `${API_URL}/api/detail-plans/search-by-calendar`,
      data,
    );
  },
};
export default DetailPlanService;
