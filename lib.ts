import jwt from "jsonwebtoken";

const checkToken = async (token: string) => {
  let email = "";
  if (token) {
    try {
      const decodedToken = jwt.decode(token as string) as { sub: string };
      email = decodedToken.sub;
      console.log("email: ", email);
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
        console.log("Wrong user, please log in again");
        return false;
      } else {
        console.log("User verified");
        return true;
      }
    } catch (error) {
      console.log("Login failed" + error);
      return false;
    }
  }
};

export default checkToken;
