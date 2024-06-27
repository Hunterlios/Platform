import jwt from "jsonwebtoken";

const checkToken = async (token: string) => {
  let email = "";
  if (token) {
    try {
      const decodedToken = jwt.decode(token as string) as { sub: string };
      email = decodedToken.sub;
      const response = await fetch(
        `http://localhost:8080/api/v1/users/email/${email}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      return false;
    }
  }
};

export default checkToken;
