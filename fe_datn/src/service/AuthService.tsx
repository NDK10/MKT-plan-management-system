import React from "react";
import axiosApi from "../axiosConfig/AxiosApi";

const AuthService = {
  signIn: async (email: string, password: string) => {
    return axiosApi.post("http://localhost:8063/api/login", {
      email,
      password,
    });
  },
};
export default AuthService;
