"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CoursesShortList from "../components/CoursesShortList";
import InvitationsList from "../components/InvitationsList";

export default function Dashboard() {
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

  const logOut = () => {
    Cookies.remove("token");
    window.location.href = "/";
  };

  return user.role === "ADMIN" ? (
    <main className="flex min-h-screen flex-col items-center p-24 font-mono">
      <h1 className="text-7xl">Admin Dashboard</h1>
      <div className="flex flex-col gap-2 mt-10 items-center">
        <p className="text-xl">Welcome to your dashboard!</p>
        {user.firstName ? (
          <p className="text-xl">
            You are now logged in as:{" "}
            <Link
              className="hover:cursor-pointer hover:text-red-600"
              href={"/dashboard/user"}
            >
              {user.firstName} {user.lastName}
            </Link>
          </p>
        ) : (
          <p className="text-xl">Loading...</p>
        )}
      </div>
      <button
        onClick={logOut}
        className="bg-white text-black mt-8 px-4 py-2 border border-black rounded-md hover:bg-black hover:text-white hover:border-white transition-transform: duration-500 ease-in-out"
      >
        Log out
      </button>
      <Link
        className="bg-white text-black mt-8 px-4 py-2 border border-black rounded-md hover:bg-black hover:text-white hover:border-white transition-transform: duration-500 ease-in-out"
        href={"/changePassword"}
      >
        Change Password
      </Link>
      <Link
        className="bg-white text-black mt-8 px-4 py-2 border border-black rounded-md hover:bg-black hover:text-white hover:border-white transition-transform: duration-500 ease-in-out"
        href={"/registerAdmin"}
      >
        Register New Admin
      </Link>
      <CoursesShortList role={user.role} />
      <InvitationsList />
    </main>
  ) : (
    <main className="flex min-h-screen flex-col items-center p-24 font-mono">
      <h1 className="text-7xl">User Dashboard</h1>
      <div className="flex flex-col gap-2 mt-10 items-center">
        <p className="text-xl">Welcome to your dashboard!</p>
        {user.firstName ? (
          <p className="text-xl">
            You are now logged in as: {user.firstName} {user.lastName}
          </p>
        ) : (
          <p className="text-xl">Loading...</p>
        )}
      </div>
      <button
        onClick={logOut}
        className="bg-white text-black mt-8 px-4 py-2 border border-black rounded-md hover:bg-black hover:text-white hover:border-white transition-transform: duration-500 ease-in-out"
      >
        Log out
      </button>
      <Link
        className="bg-white text-black mt-8 px-4 py-2 border border-black rounded-md hover:bg-black hover:text-white hover:border-white transition-transform: duration-500 ease-in-out"
        href={"/changePassword"}
      >
        Change Password
      </Link>
      <CoursesShortList role={user.role} />
    </main>
  );
}
