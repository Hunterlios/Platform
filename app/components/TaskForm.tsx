"use client";
import React, { FormEvent } from "react";
import Cookies from "js-cookie";

function TaskForm(params: { courseId: number; role: string }) {
  const token = Cookies.get("token");

  const handleSumbit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const task = {
      contents: formData.get("contents"),
      deadline: formData.get("deadline"),
      courseId: formData.get("courseId"),
    };

    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/tasks/createIndividualTask",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(task),
        }
      );
      if (response.ok) {
        window.location.reload();
      } else {
        console.log("Error: " + response.statusText);
      }
    } catch (error) {
      console.log("Error: " + error);
    }
  };

  return params.role === "ADMIN" ? (
    <div className="m-5 w-[20%] font-mono">
      <h2 className="text-center text-2xl mb-5">Stwórz zadanie</h2>
      <form
        onSubmit={handleSumbit}
        className="flex flex-col justify-between h-32"
      >
        <input
          className="text-black"
          type="text"
          name="contents"
          placeholder="Zadanie"
          required
          maxLength={50}
        />
        <input
          required
          className="text-black"
          type="datetime-local"
          name="deadline"
        />
        <input type="hidden" name="courseId" value={params.courseId} />
        <button
          className="bg-white text-black mt-4 px-4 py-2 border border-black hover:bg-black hover:text-white hover:border-white transition-transform: duration-500 ease-in-out"
          type="submit"
        >
          Dodaj zadanie
        </button>
      </form>
    </div>
  ) : null;
}

export default TaskForm;
