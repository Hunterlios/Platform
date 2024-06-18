"use client";
import { FormEvent } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function Form() {
  const router = useRouter();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      password: formData.get("password"),
    };
    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        alert("This email is already in use");
      }
      const tokenData = await response.json();
      const { token } = tokenData;
      Cookies.set("token", token, { expires: 1 });
      alert("Register successful");
      //window.location.href = "/dashboard";
      router.push("/dashboard");
    } catch (error) {
      console.log("Register failed", error);
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 mx-auto max-w-md mt-10 font-mono"
    >
      <input
        className="border border-black text-black"
        type="firstName"
        placeholder="firstName"
        name="firstName"
      />
      <input
        className="border border-black text-black"
        type="lastName"
        placeholder="lastName"
        name="lastName"
      />
      <input
        className="border border-black text-black"
        type="email"
        placeholder="email"
        name="email"
      />
      <input
        className="border border-black text-black"
        type="password"
        placeholder="password"
        name="password"
      />
      <button
        className="bg-white text-black mt-8 px-4 py-2 border border-black rounded-md hover:bg-black hover:text-white hover:border-white transition-transform: duration-500 ease-in-out "
        type="submit"
      >
        Register
      </button>
    </form>
  );
}
