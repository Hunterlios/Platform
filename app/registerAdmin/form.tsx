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
        "http://localhost:8080/api/v1/auth/registerNewAdmin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        console.log(response.statusText + " " + data.email);
        alert("This email is already in use");
      }
      alert("Register successful");
      //window.location.href = "/dashboard";
      router.push("/dashboard");
    } catch (error) {
      console.log("Register failed", error);
    }
  };
  return (
    <div className="min-w-full min-h-full font-mono">
      <button
        onClick={() => router.back()}
        className="absolute top-0 left-0 bg-white text-black m-8 px-4 py-2 border border-black hover:bg-black hover:text-white hover:border-white transition-transform: duration-500 ease-in-out"
      >
        Wróć
      </button>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 min-h-screen justify-center items-center"
      >
        <h1 className="text-6xl mb-5">Rejestracja Admina</h1>
        <input
          className="border border-black text-black w-1/4"
          type="firstName"
          placeholder="Imie"
          name="firstName"
          required
        />
        <input
          className="border border-black text-black w-1/4"
          type="lastName"
          placeholder="Nazwisko"
          name="lastName"
          required
        />
        <input
          className="border border-black text-black w-1/4"
          type="email"
          placeholder="Email"
          name="email"
          required
        />
        <input
          className="border border-black text-black w-1/4"
          type="password"
          placeholder="Hasło"
          name="password"
          required
        />
        <button
          className="bg-white text-black mt-8 px-4 py-2 border border-black hover:bg-black hover:text-white hover:border-white transition-transform: duration-500 ease-in-out "
          type="submit"
        >
          Zarejestruj admina
        </button>
      </form>
    </div>
  );
}
