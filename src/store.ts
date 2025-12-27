import secureLocalStorage from "react-secure-storage";
import { create } from "zustand";
import Cookies from "js-cookie";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface CustomJwtPayload extends JwtPayload {
  isProfileDone?: boolean;
}

interface TabStore {
  tabIndex: number;
  setTabIndex: (index: number) => void;
}

const getInitialTabIndex = (): number => {
  try {
    // 1. Check JWT Token first (most reliable)
    const token = Cookies.get("jwtToken");
    if (token) {
      const decoded = jwtDecode<CustomJwtPayload>(token);
      if (decoded?.isProfileDone) {
        return 1;
      }
    }

    // 2. Check Local Storage (fallback)
    const userDetailsString = secureLocalStorage.getItem("userDetails");
    if (userDetailsString && typeof userDetailsString === "string") {
      const userDetails = JSON.parse(userDetailsString);
      // Handle inconsistent API response structure
      const isProfileDone = userDetails?.isProfileDone || userDetails?.data?.isProfileDone;
      if (isProfileDone) {
        return 1;
      }
    }
  } catch (error) {
    console.error("Error determining initial tab index:", error);
  }
  
  return 0;
};

export const useTabStore = create<TabStore>((set) => ({
  tabIndex: getInitialTabIndex(),
  setTabIndex: (index) => set({ tabIndex: index }),
}));
