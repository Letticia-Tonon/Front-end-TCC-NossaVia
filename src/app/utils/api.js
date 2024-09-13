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
