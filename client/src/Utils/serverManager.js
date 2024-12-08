// import axios from "axios";

// // Urls
// const API_URL =
//   import.meta.env.VITE_NODE_ENV === "production"
//     ? import.meta.env.VITE_SERVER_URL_PRODUCTION
//     : import.meta.env.VITE_SERVER_URL_DEVELOPMENT;

// // Routes
// const AUTH_ROUTE = import.meta.env.VITE_SERVER_AUTH_ROUTE;
// const CONTEST_ROUTE = import.meta.env.VITE_SERVER_CONTEST_ROUTE;

// axios.defaults.withCredentials = true;

// export const fetchContestById = async (contestId) => {
//   try {
//     const res = await axios.get(`${API_URL}${CONTEST_ROUTE}${contestId}`);

//     const contest = res.data.data;

//     return contest;
//   } catch (error) {
//     console.log(error);
//     throw Error;
//   }
// };
