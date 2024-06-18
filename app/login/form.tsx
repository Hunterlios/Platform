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
    // test walidacji losowego tokenu - działa - DO USUNIĘCIA
    // Cookies.set(
    //   "token",
    //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    //   { expires: 1 }
    // );
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
      alert("Login successful");
      router.push("/dashboard");
    } catch (error) {
      alert("Login failed " + error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 mx-auto max-w-md mt-10"
    >
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
      <button type="submit">Login</button>
    </form>
  );
}
