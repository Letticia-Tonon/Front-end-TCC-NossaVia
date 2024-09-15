const URL = process.env.EXPO_PUBLIC_BASE_URL;
import AsyncStorage from "@react-native-async-storage/async-storage";

export const post = async (endpoint, data, authorization = false) => {
  let token = "";
  if (authorization) {
    token = await AsyncStorage.getItem("token");
  }
  const response = await fetch(`${URL}/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authorization ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(data),
  });
  return response;
};

export const get = async (endpoint, authorization = false) => {
  let token;
  if (authorization) {
    token = await AsyncStorage.getItem("token");
  }
  const response = await fetch(`${URL}/${endpoint}`, {
    method: "GET",
    headers: {
      Authorization: authorization ? `Bearer ${token}` : "",
    },
  });
  return response;
};

export const put = async (endpoint, data, authorization = false) => {
  let token;
  if (authorization) {
    token = await AsyncStorage.getItem("token");
  }
  const response = await fetch(`${URL}/${endpoint}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: authorization ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(data),
  });
  return response;
};

export const del = async (endpoint, authorization = false) => {
  let token;
  if (authorization) {
    token = await AsyncStorage.getItem("token");
  }
  const response = await fetch(`${URL}/${endpoint}`, {
    method: "DELETE",
    headers: {
      Authorization: authorization ? `Bearer ${token}` : "",
    },
  });
  return response;
};