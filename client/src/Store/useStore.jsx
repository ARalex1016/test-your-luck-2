import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

// Store
const useStore = create((set) => ({
  user: null,
  contest: null,
  isAuthenticated: false,
  isCheckingAuth: false,
  isLoading: false,
  error: null,

  signup: async (userData) => {
    set({ isLoading: true });

    try {
      const res = await axiosInstance.post("/auth/signup", userData);

      //   Success
      set({ user: res.data.data, isAuthenticated: true, error: null });
      return res;
    } catch (error) {
      // Error
      set({
        error: error.response.data.message,
        isAuthenticated: false,
      });

      throw Error(error.response.data.message);
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (userData) => {
    set({ isLoading: true });

    try {
      const res = await axiosInstance.post("/auth/login", userData);

      //   Success
      set({ user: res.data.data, isAuthenticated: true, error: null });
      return res;
    } catch (error) {
      // Error
      set({
        error: error.response.data.message,
        isAuthenticated: false,
      });

      throw Error(error.response.data.message);
    } finally {
      set({ isLoading: false });
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true });

    try {
      const res = await axiosInstance.post("/auth/check-auth");

      //   Success
      set({ user: res.data.data, isAuthenticated: true, error: null });
    } catch (error) {
      // Error

      set({
        user: null,
        error: error.response.data.message,
        isAuthenticated: false,
      });

      throw Error;
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });

    try {
      const res = await axiosInstance.post("/auth/logout");

      if (import.meta.env.VITE_NODE_ENV === "development") {
        localStorage.clear("authToken");
      }

      //   Success
      set({ user: res.data.data, isAuthenticated: false, error: null });
    } catch (error) {
      // Error
      console.log(error);

      set({
        error: error.response.data.message,
      });

      throw Error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (profile) => {
    set({ isLoading: true });

    try {
      const res = await axiosInstance.patch("/user/updateProfile", {
        profileUrl: profile,
      });

      set({ user: res.data.data });
      return res.data;
    } catch (error) {
      throw Error(error.response.data.message);
    } finally {
      set({ isLoading: false });
    }
  },

  getAllContest: async () => {
    set({ isLoading: true });

    try {
      const res = await axiosInstance.get("/contest");

      //   Success
      set({ contest: res.data.data, error: null });
    } catch (error) {
      set({
        error: error.response.data.message,
      });
      throw Error;
    } finally {
      set({ isLoading: false });
    }
  },

  getContest: async (contestId) => {
    try {
      const res = await axiosInstance.get(`/contest/${contestId}`);

      return res.data.data;
    } catch (error) {
      throw Error(error.response.data.message);
    }
  },

  createContest: async (contestDetails) => {
    set({ isLoading: true });

    try {
      const res = await axiosInstance.post("/contest", contestDetails);

      return res.data;
    } catch (error) {
      throw Error(error.response.data.message);
    } finally {
      set({ isLoading: false });
    }
  },

  getTicketById: async (ticketId) => {
    try {
      const res = await axiosInstance.get(`/ticket/${ticketId}`);

      return res.data.data;
    } catch (error) {
      throw Error(error.response.data.message);
    }
  },

  participateContest: async (amount, contestId) => {
    try {
      const res = await axiosInstance.post(
        `/contest/${contestId}/participate`,
        { amount }
      );

      return res.data;
    } catch (error) {
      throw Error(error.response.data.message);
    }
  },

  exchangeCoin: async (coins, contestId) => {
    try {
      const res = await axiosInstance.post(
        `/contest/${contestId}/exchange-coin`,
        { coins }
      );

      return res.data;
    } catch (error) {
      throw Error(error.response.data.message);
    }
  },

  getReferrals: async () => {
    try {
      const res = await axiosInstance.get("/user/getReferrals");

      return res.data.data;
    } catch (error) {
      throw Error(error.response.data.message);
    }
  },
}));

export default useStore;
