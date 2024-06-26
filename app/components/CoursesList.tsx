"use client";
import { useState, useEffect, FormEvent } from "react";
import Cookies from "js-cookie";
import Link from "next/link";

function CoursesList({ role }: { role: string }) {
  const [courses, setCourses] = useState([]);
  const token = Cookies.get("token");
  const isAdmin: boolean = role === "ADMIN" ? true : false;

  const getCurses = async () => {
    let response: Response;
    try {
      if (isAdmin) {
        console.log("isAdmin: ", isAdmin);
        response = await fetch(
          "http://localhost:8080/api/v1/courses/myCoursesAdmin",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        response = await fetch("http://localhost:8080/api/v1/courses", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      } else {
        console.log("Error: " + response.statusText);
      }
    } catch (error) {
      console.log("Error: " + error);
    }
  };

  const handleAddCourse = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch("http://localhost:8080/api/v1/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.get("courseName"),
        }),
      });
      if (response.ok) {
        console.log("Course added");
        getCurses();
      } else {
        console.log("Error: " + response.statusText);
      }
    } catch (error) {
      console.log("Error: " + error);
    }
  };

  const deleteCourse = async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/courses/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        console.log("Course deleted");
        getCurses();
      } else {
        console.log("Error: " + response.statusText);
      }
    } catch (error) {
      console.log("Error: " + error);
    }
  };

  useEffect(() => {
    getCurses();
  }, []);

  return isAdmin ? (
    <div className="w-2/3 flex flex-col justify-center item-center">
      <h1 className="text-center my-5 text-4xl">Kursy</h1>
      <form
        id="changePasswordForm"
        onSubmit={handleAddCourse}
        className="flex justify-center items-center gap-4 mt-8 w-2/3 m-auto"
      >
        <input
          type="text"
          className="min-w-[60%] mb-5 p-2 text-black"
          placeholder="Nazwa kursu"
          id="courseName"
          name="courseName"
          maxLength={50}
          required
        />
        <button className="bg-red-500 text-white p-2 w-full mb-5" type="submit">
          Dodaj kurs
        </button>
      </form>

      <ul className="w-2/3 m-auto">
        {courses.map((course: any) => (
          <li
            className="border-b-2 border-white border-opacity-50 mb-3 flex justify-between items-center hover:bg-gray-200 transition-transform: duration-500 ease-in-out hover:text-black"
            key={course.id}
          >
            <Link href={`/dashboard/courses/${course.id}`}>
              {course.name} - {course.author.firstName} {course.author.lastName}
            </Link>

            <button
              className="bg-red-500 text-white px-2 py-2 ml-5"
              onClick={() => deleteCourse(course.id)}
            >
              Usuń kurs
            </button>
          </li>
        ))}
      </ul>
    </div>
  ) : (
    <div className="w-80 flex flex-col justify-center item-center">
      <h1 className="text-center my-5 text-4xl">Kursy</h1>
      <ul>
        {courses.map((course: any) => (
          <li
            className="border-b-2 border-white border-opacity-50 mb-3"
            key={course.id}
          >
            <Link
              href={`/dashboard/courses/${course.id}`}
              className="flex justify-between hover:text-red-600"
            >
              <span className="font-bold">{course.name}</span>
              <span>
                {course.author.firstName} {course.author.lastName}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CoursesList;
