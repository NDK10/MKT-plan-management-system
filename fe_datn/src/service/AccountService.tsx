import React from "react";
import axiosApi from "../axiosConfig/AxiosApi";

const AccountService = {
  getAccountRole: async () => {
    return axiosApi.get("http://localhost:8063/api/roles/all");
  },
  searchAccounts: async (params: any) => {
    return axiosApi.post("http://localhost:8063/api/accounts/search", params);
  },
  createAccount: async (data: any) => {
    return axiosApi.post("http://localhost:8063/api/accounts/create", data);
  },
  updateAccount: async (data: any, id: number) => {
    return axiosApi.put(
      `http://localhost:8063/api/accounts/update/${id}`,
      data,
    );
  },
  deleteAccount: async (id: number) => {
    return axiosApi.delete(`http://localhost:8063/api/accounts/delete/${id}`);
  },
  getAll: async () => {
    return axiosApi.get("http://localhost:8063/api/accounts/all");
  },
};
export default AccountService;
