import { useContext } from "react";

import { AuthContext } from "../context/AuthContext";

// Custom hook to access authentication context
const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;