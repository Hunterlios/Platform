"use client";
import { FormEvent, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import checkToken from "../../lib";

export default function Form() {
  const router = useRouter();

  const tokenValidation = async () => {
    const token = Cookies.get("token");
    try {
      if (token) {
        console.log("token: ", token);
        const validToken = await checkToken(token as string);
        console.log("validToken: ", validToken);
        if (!validToken) {
          Cookies.remove("token");
          window.location.href = "/login";
        } else {
          router.push("/dashboard");
        }
      }
    } catch (error) {
      alert("Login failed" + error);
      Cookies.remove("token");
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    tokenValidation();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
    };
    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/auth/authenticate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const tokenData = await response.json();
      const { token } = tokenData;
      Cookies.set("token", token, { expires: 1 });
      alert("Logowanie zakończone sukcesem");
      router.push("/dashboard");
    } catch (error) {
      alert("Niepoprawne dane logowania");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 mx-auto max-w-md mt-10 font-mono"
    >
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
        className="bg-white text-black mt-8 px-4 py-2 border border-black hover:bg-black hover:text-white hover:border-white transition-transform: duration-500 ease-in-out"
        type="submit"
      >
        Zaloguj
      </button>
    </form>
  );
}
