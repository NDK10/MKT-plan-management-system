import React from "react";
import axiosApi from "../axiosConfig/AxiosApi";
import { API_URL } from "../axiosConfig/Api";

const AuthService = {
  signIn: async (email: string, password: string) => {
    return axiosApi.post(`${API_URL}/api/login`, {
      email,
      password,
    });
  },
};
export default AuthService;
