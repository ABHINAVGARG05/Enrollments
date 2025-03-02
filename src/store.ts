import secureLocalStorage from "react-secure-storage";
import { create } from "zustand";
import Cookies from "js-cookie";
import { jwtDecode, JwtPayload  } from "jwt-decode";

interface CustomJwtPayload extends JwtPayload {
  isProfileDone?: boolean; 
}

interface TabStore {
  tabIndex: number;
  setTabIndex: (index: number) => void;
}

export const useTabStore = create<TabStore>((set) => {
  const userDetailsString = secureLocalStorage.getItem("userDetails");
  let initialTabIndex = 0;
  const token = Cookies.get("jwtToken")
  // console.log(token)
  // if (token) {
  //   try {
  //     const decoded = jwtDecode<CustomJwtPayload>(token);
  //     console.log(decoded)
  //     if (decoded?.isProfileDone !== undefined) {
  //       console.log("hii")
  //       if(decoded?.isProfileDone === true) {
  //         console.log("abhi")
  //         initialTabIndex = 1;
  //       }
  //       console.log({initialTabIndex})
  //     }else {
  //       set({ tabIndex: 0 });
  //     }
  //   }catch (error) {
  //     console.error("Error decoding JWT:", error);
  //     initialTabIndex = 0;
  //   }
  // }
  // console.log(userDetailsString)
  // if (userDetailsString) {
  //   // const userDetails = JSON.parse(userDetailsString);
  //   const userProfile = userDetails.isProfileDone;
  //   console.log(userDetails?.isProfileDone)
  //   if (userDetails?.isProfileDone) {
  //     initialTabIndex = 1;
  //   }
  // }

  set({ tabIndex: initialTabIndex });

  return {
    tabIndex: initialTabIndex,
    setTabIndex: (index) => set({ tabIndex: index }),
  };
});
