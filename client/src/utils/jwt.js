import { jwtDecode } from "jwt-decode";

const decodeToken = async (token) => {
    try {
      if (!token) {
        return null;
      }
      const decoded = jwtDecode(token);
      console.log(decoded);
      return decoded;
    } catch (error) {
      console.log(error);
      return null;
    }
  };


export default decodeToken;