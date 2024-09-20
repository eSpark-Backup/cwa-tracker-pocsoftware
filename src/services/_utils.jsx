export const baseUrl = "http://localhost:3000";

export const prepareHeaders = (headers) => {
  const token = localStorage.getItem("token");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
};
