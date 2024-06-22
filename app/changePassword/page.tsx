"use client";
import React, { FormEvent } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function changePassword() {
  const router = useRouter();
  const token = Cookies.get("token");
  const handleChangePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      currentPassword: formData.get("currentPassword"),
      newPassword: formData.get("newPassword"),
      confirmationPassword: formData.get("confirmationPassword"),
    };
    try {
      const response = await fetch("http://localhost:8080/api/v1/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        alert("Wrong password, please try again");
        //TU TRZEBA TO ZMIENIĆ NA COŚ WYDAJNIEJSZEGO
        window.location.reload();
      } else {
        alert("Password changed successfully");
        router.push("/dashboard");
      }
    } catch (error) {
      alert("Password change failed" + error);
    }
  };

  return (
    <div className="font-mono flex flex-col items-center justify-center min-h-screen">
      <button
        onClick={() => router.back()}
        className="absolute top-0 left-0 bg-white text-black m-8 px-4 py-2 border border-black rounded-md hover:bg-black hover:text-white hover:border-white transition-transform: duration-500 ease-in-out"
      >
        Go back
      </button>
      <h1 className="text-6xl mb-5">Change Password</h1>
      <form
        id="changePasswordForm"
        onSubmit={handleChangePassword}
        className="flex flex-col justify-center items-center gap-4 mt-8"
      >
        <label htmlFor="currentPassword">Current Password</label>
        <input
          className="text-black"
          type="password"
          id="currentPassword"
          name="currentPassword"
        />
        <label htmlFor="newPassword">New Password</label>
        <input
          className="text-black"
          type="password"
          id="newPassword"
          name="newPassword"
        />
        <label htmlFor="confirmationPassword">Confirm New Password</label>
        <input
          className="text-black"
          type="password"
          id="confirmationPassword"
          name="confirmationPassword"
        />
        <button
          type="submit"
          className="bg-white text-black border-2 border-black p-4 mt-2 hover:bg-black hover:text-white hover:border-white"
        >
          Change Password
        </button>
      </form>
    </div>
  );
}
