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
        <h1 className="text-6xl mb-5">Logowanie</h1>
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
          className="bg-white text-black mt-8 px-4 py-2 border border-black hover:bg-black hover:text-white hover:border-white transition-transform: duration-500 ease-in-out"
          type="submit"
        >
          Zaloguj
        </button>
      </form>
    </div>
  );
}
