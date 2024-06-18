"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function User() {
  const [user, setUser] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  });
  const getUser = async () => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const response = await fetch(
          "http://localhost:8080/api/v1/users/current",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          alert("Error: " + response.statusText);
        }
      } catch (error) {
        alert("Error: " + error);
      }
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <main className="">
      <h1>
        User: {user.firstName} {user.lastName}
      </h1>
    </main>
  );
}
