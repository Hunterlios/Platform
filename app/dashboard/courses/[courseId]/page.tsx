"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function CourseId({ params }: { params: { courseId: string } }) {
  const token = Cookies.get("token");
  const [course, setCourse] = useState({
    id: 0,
    name: "",
    author: {
      id: 0,
      firstName: "",
      lastName: "",
      email: "",
    },
  });
  const [needInvite, setNeedInvite] = useState(true);
  const router = useRouter();

  const getUser = async () => {
    if (token) {
      try {
        const response = await fetch(
          "http://localhost:8080/api/v1/users/current",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          return data.role;
        } else {
          alert("Error: " + response.statusText);
          router.push("/");
        }
      } catch (error) {
        alert("Error: " + error);
        router.push("/");
      }
    }
  };

  const checkIfUserInCourse = async (courseId: string) => {
    const role = await getUser();
    if (token && role !== "ADMIN") {
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/courses/myCourses`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          const courseIds = data.map((course: any) => course.id);
          if (courseIds.includes(Number(courseId))) {
            console.log("User is in course");
            setNeedInvite(false);
          } else {
            console.log("User is not in course");
            setNeedInvite(true);
          }
        } else {
          alert("Error: " + response.statusText);
        }
      } catch (error) {
        alert("Error: " + error);
      }
    } else if (token && role === "ADMIN") {
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/courses/myCoursesAdmin`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          const courseIds = data.map((course: any) => course.id);
          if (courseIds.includes(Number(courseId))) {
            console.log("User is in course");
            setNeedInvite(false);
          } else {
            console.log("User is not in course");
            setNeedInvite(true);
          }
        } else {
          alert("Error: " + response.statusText);
        }
      } catch (error) {
        alert("Error: " + error);
      }
    }
  };

  /* const checkIfInvitationSent = async (courseId: string) => {
    if (token) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/invitations/myInvitations`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          const courseIds = data.map((invitation: any) => invitation.course.id);
          if (courseIds.includes(Number(courseId))) {
            alert("User already sent invitation to course");
            router.push("/dashboard/courses");
          } else {
            console.log("User did not send invitation to course");
            setNeedInvite(true);
          }
        } else {
          alert("Error: " + response.statusText);
        }
      } catch (error) {
        alert("Error: " + error);
      }
    }
   };*/

  const getCourseInfo = async (courseId: string) => {
    if (token) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/courses/${courseId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          await response.json().then((data) => {
            setCourse(data);
          });
        } else {
          alert("Error: " + response.statusText);
        }
      } catch (error) {
        alert("Error: " + error);
      }
    }
  };

  const handleJoinCourse = async (courseId: string) => {
    const role = await getUser();
    if (token && role !== "ADMIN") {
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/invitations/join/${courseId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          console.log("User send invitation to course");
          router.push("/dashboard");
        } else {
          alert("Error: " + response.statusText);
        }
      } catch (error) {
        alert("Error: " + error);
      }
    } else if (token && role === "ADMIN") {
      alert("Admin cannot join course");
      router.push("/dashboard");
    }
  };

  useEffect(() => {
    checkIfUserInCourse(params.courseId);
    getCourseInfo(params.courseId);
  }, []);

  return course.id ? (
    needInvite ? (
      <div className="flex flex-col gap-2 justify-center items-center min-h-screen font-mono">
        <button
          onClick={() => router.back()}
          className="absolute top-0 left-0 bg-white text-black m-8 px-4 py-2 border border-black rounded-md hover:bg-black hover:text-white hover:border-white transition-transform: duration-500 ease-in-out"
        >
          Go back
        </button>
        <h1 className="text-4xl">Course: {course?.name}</h1>
        <h2 className="text-lg mt-5">
          Author: {course?.author.firstName} {course?.author.lastName}
        </h2>
        <button
          className="bg-white text-black mt-5 px-4 py-2 border border-black rounded-md hover:bg-black hover:text-white hover:border-white transition-transform: duration-500 ease-in-out"
          onClick={() => handleJoinCourse(String(course?.id))}
        >
          Join Course
        </button>
      </div>
    ) : (
      <div className="flex flex-col gap-2 justify-center items-center min-h-screen font-mono">
        <button
          onClick={() => router.back()}
          className="absolute top-0 left-0 bg-white text-black m-8 px-4 py-2 border border-black rounded-md hover:bg-black hover:text-white hover:border-white transition-transform: duration-500 ease-in-out"
        >
          Go back
        </button>
        <h1 className=" text-4xl">Course: {course?.name}</h1>
      </div>
    )
  ) : (
    <div className="flex flex-col gap-2 justify-center items-center min-h-screen font-mono">
      <h1 className="text-4xl">Loading...</h1>
    </div>
  );
}
