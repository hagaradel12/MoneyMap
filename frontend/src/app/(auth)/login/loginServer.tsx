import axiosInstance from "@/app/utils/axiosInstance";
import {jwtDecode} from "jwt-decode"; // Import the library

const backend_url = "http://localhost:3000"
const frontend_url = "http://localhost:3001"

interface LoginResponse {
  access_token: string;
  user: {
    email: string;
  };
}

interface DecodedToken {
  email: string;
  exp: number;
}

export const handleLogin = async (email: string, password: string) => {
  try {
    console.log("Attempting login with:", { email, password });

    const response = await axiosInstance.post<LoginResponse>(`${backend_url}/auth/login`, {
      email,
      password,
    });

    if (response.status === 200 || response.status === 201) {
      const { access_token } = response.data;

      if (access_token) {
        // Use jwtDecode from the library
        const decodedToken: DecodedToken = jwtDecode<DecodedToken>(access_token);

        console.log("Decoded token:", decodedToken);

        if (decodedToken.email !== undefined) {
          return {
            success: true,
            token: access_token,
            user: decodedToken,
          };
        } else {
          throw new Error("Invalid token structure");
        }
      } else {
        throw new Error("No access token received");
      }
    } else {
      throw new Error("Login failed. Invalid response.");
    }
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
