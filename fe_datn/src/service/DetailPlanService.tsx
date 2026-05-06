import React from "react";
import axiosApi from "../axiosConfig/AxiosApi";

const DetailPlanService = {
  create: async (data: any) => {
    return axiosApi.post("http://localhost:8063/api/detail-plans/create", data);
  },
  update: async (data: any) => {
    return axiosApi.put(`http://localhost:8063/api/detail-plans/update`, data);
  },
  delete: async (id: number) => {
    return axiosApi.delete(
      `http://localhost:8063/api/detail-plans/delete/${id}`,
    );
  },
  search: async (data: any) => {
    return axiosApi.post("http://localhost:8063/api/detail-plans/search", data);
  },
  updateContent: async (data: any) => {
    return axiosApi.post(
      `http://localhost:8063/api/detail-plans/update-content`,
      data,
    );
  },
  updateStatusComplete: async (id: number) => {
    return axiosApi.post(
      `http://localhost:8063/api/detail-plans/update-status-complete/${id}`,
    );
  },
  approveContent: async (data: any) => {
    return axiosApi.post(
      `http://localhost:8063/api/detail-plans/approve-content`,
      data,
    );
  },
  searchByCalendar: async (data: any) => {
    return axiosApi.post(
      "http://localhost:8063/api/detail-plans/search-by-calendar",
      data,
    );
  },
};
export default DetailPlanService;
