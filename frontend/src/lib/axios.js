import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "/api",
    withCredentials: true,     // client sends cookies, authorization headers, with requests.
})









// ❌ Without axiosInstance - Every request would look like this:

// axios.post("http://localhost:3000/api/auth/login", data, {
//   withCredentials: true
// });


// Problems:
// Repeating baseURL,
// Easy to forget withCredentials,
// Hard to change later.






// ✅ With axiosInstance - You define it once:

// const axiosInstance = axios.create({
//   baseURL: "...",
//   withCredentials: true
// });


// Then everywhere else:

// axiosInstance.post("/auth/login", data);
// axiosInstance.get("/auth/me");
// axiosInstance.post("/chat/send");





// Common Axios config keys:

// {
//   baseURL,
//   headers,
//   timeout,
//   withCredentials,
//   params,
//   responseType
// }