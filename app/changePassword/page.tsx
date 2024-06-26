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
        className="absolute top-0 left-0 bg-white text-black m-8 px-4 py-2 border border-black hover:bg-black hover:text-white hover:border-white transition-transform: duration-500 ease-in-out"
      >
        Wróć
      </button>
      <h1 className="text-6xl mb-5">Zmień hasło</h1>
      <form
        id="changePasswordForm"
        onSubmit={handleChangePassword}
        className="flex flex-col justify-center items-center gap-4 mt-8 min-w-full min-h-full"
      >
        <label htmlFor="currentPassword">Aktualne hasło</label>
        <input
          className="text-black w-1/3"
          type="password"
          id="currentPassword"
          name="currentPassword"
          required
        />
        <label htmlFor="newPassword">Nowe hasło</label>
        <input
          className="text-black w-1/3"
          type="password"
          id="newPassword"
          name="newPassword"
          required
        />
        <label htmlFor="confirmationPassword">Potwierdź nowe hasło</label>
        <input
          className="text-black w-1/3"
          type="password"
          id="confirmationPassword"
          name="confirmationPassword"
          required
        />
        <button
          type="submit"
          className="bg-white w-56 text-center text-black mt-8 px-4 py-2 border border-black hover:bg-black hover:text-white hover:border-white transition-transform: duration-500 ease-in-out"
        >
          Zmień hasło
        </button>
      </form>
    </div>
  );
}
