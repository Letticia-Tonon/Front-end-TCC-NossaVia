const URL = process.env.EXPO_PUBLIC_BASE_URL;

export const post = async (endpoint, data) => {
  const response = await fetch(`${URL}/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response;
};
