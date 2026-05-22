import React from "react";
import axiosApi from "../axiosConfig/AxiosApi";
import { API_URL } from "../axiosConfig/Api";

const AccountService = {
  getAccountRole: async () => {
    return axiosApi.get(`${API_URL}/api/roles/all`);
  },
  searchAccounts: async (params: any) => {
    return axiosApi.post(`${API_URL}/api/accounts/search`, params);
  },
  createAccount: async (data: any) => {
    return axiosApi.post(`${API_URL}/api/accounts/create`, data);
  },
  updateAccount: async (data: any, id: number) => {
    return axiosApi.put(`${API_URL}/api/accounts/update/${id}`, data);
  },
  deleteAccount: async (id: number) => {
    return axiosApi.delete(`${API_URL}/api/accounts/delete/${id}`);
  },
  getAll: async () => {
    return axiosApi.get(`${API_URL}/api/accounts/all`);
  },
  getAccountById: async (id: number) => {
    return axiosApi.get(`${API_URL}/api/accounts/get-account-id/${id}`);
  },
  updateProfile: async (data: any, id: number) => {
    return axiosApi.post(`${API_URL}/api/accounts/change-profile/${id}`, data);
  },
  changePassword: async (data: any) => {
    return axiosApi.post(`${API_URL}/api/accounts/change-password`, data);
  },
};
export default AccountService;
