"use client";
import CoursesList from "@/app/components/CoursesList";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function Courses() {
  const [user, setUser] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  });
  const router = useRouter();

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
          router.push("/");
        }
      } catch (error) {
        alert("Error: " + error);
        router.push("/");
      }
    }
  };

  useEffect(() => {
    getUser();
  }, []);
  return user.role ? (
    <div className="flex flex-col justify-center items-center">
      <button
        onClick={() => router.back()}
        className="absolute top-0 left-0 bg-white text-black m-8 px-4 py-2 border border-black hover:bg-black hover:text-white hover:border-white transition-transform: duration-500 ease-in-out"
      >
        Wróć
      </button>
      <CoursesList role={user.role} />
    </div>
  ) : (
    <div className="flex justify-center items-center font-mono min-h-screen">
      <h1 className="text-xl">Loading...</h1>
    </div>
  );
}
