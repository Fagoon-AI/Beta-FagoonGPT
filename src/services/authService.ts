import { LoginFormValues } from "@/app/login/page";
import { SignupFormValues } from "@/app/signup/page";
import { getCurrentUserData, refreshTokenData } from "@/types/authServiceType";
import axios, { AxiosResponse } from "axios";

const API_BASE_URL = "https://endpoints.fagoondigital.com";

interface SignupResponse {
  access_token: string;
  refresh_token: string;
}

export const signup = async (
  signupUserData: SignupFormValues
): Promise<AxiosResponse<SignupResponse>> => {
  return await axios.post(`${API_BASE_URL}/auth/signup`, signupUserData);
};

export const login = async (credentials: LoginFormValues) => {
  return await axios.post(`${API_BASE_URL}/auth/login`, credentials);
};

export const refreshTokenAPI = async ({ refreshToken }: refreshTokenData) => {
  return await axios.get(`${API_BASE_URL}/auth/refresh`, {
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });
};

export const getCurrentUserAPI = async ({
  accessToken,
}: getCurrentUserData) => {
  return await axios.get(`${API_BASE_URL}/user/current`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
