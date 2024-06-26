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
        alert("Ten email jest już w użyciu");
      }
      const tokenData = await response.json();
      const { token } = tokenData;
      Cookies.set("token", token, { expires: 1 });
      alert("Rejestracja zakończona sukcesem");
      router.push("/dashboard");
    } catch (error) {
      alert("Błąd rejestracji");
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
        placeholder="Imie"
        name="firstName"
        required
      />
      <input
        className="border border-black text-black"
        type="lastName"
        placeholder="Nazwisko"
        name="lastName"
        required
      />
      <input
        className="border border-black text-black"
        type="email"
        placeholder="Email"
        name="email"
        required
      />
      <input
        className="border border-black text-black"
        type="password"
        placeholder="Hasło"
        name="password"
        required
      />
      <button
        className="bg-white text-black mt-8 px-4 py-2 border border-black hover:bg-black hover:text-white hover:border-white transition-transform: duration-500 ease-in-out "
        type="submit"
      >
        Zarejestruj
      </button>
    </form>
  );
}
