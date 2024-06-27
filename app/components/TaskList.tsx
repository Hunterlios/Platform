import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { get } from "http";

function TaskList(params: { courseId: number; role: string }) {
  const [tasks, setTasks] = useState([]);
  const token = Cookies.get("token");

  const getTasks = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/tasks/course/${params.courseId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        console.log("Error: " + response.statusText);
      }
    } catch (error) {
      console.log("Error: " + error);
    }
  };

  const handleDeleteTask = async (taskId: number, isIndividual: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/tasks`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskId: taskId, isIndividual: isIndividual }),
      });
      if (response.ok) {
        getTasks();
      } else {
        alert("Usuń najpierw wszystkie pliki związane z tym zadaniem!");
      }
    } catch (error) {
      alert("Usuń najpierw wszystkie pliki związane z tym zadaniem!");
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  return tasks.length != 0 ? (
    params.role === "ADMIN" ? (
      <div className="border-white border-2 min-w-[50%] p-5">
        <ul>
          {tasks.map((task: any) => (
            <li
              key={task.id}
              className="flex justify-between border-b-2 items-center border-white mb-2 "
            >
              <Link
                className="py-2 w-full hover:bg-gray-200 transition-transform: duration-500 ease-in-out hover:text-black"
                href={`./${params.courseId}/${task.id}`}
              >
                <span>
                  {task.contents} -{" "}
                  {new Date(task.deadline)
                    .toISOString()
                    .split("T")[0]
                    .split("-")
                    .reverse()
                    .join(".") +
                    " " +
                    new Date(task.deadline)
                      .toISOString()
                      .split("T")[1]
                      .split(".")[0]}
                </span>
              </Link>
              <button
                className="bg-red-500 w-1/5 text-white px-2 py-2 hover:bg-red-700 transition-transform: duration-500 ease-in-out"
                onClick={() => handleDeleteTask(task.id, 1)}
              >
                Usuń zadanie
              </button>
            </li>
          ))}
        </ul>
      </div>
    ) : (
      <div className="border-white border-2 min-w-[50%] p-5">
        <ul>
          {tasks.map((task: any) => (
            <li
              key={task.id}
              className="flex justify-between border-b-2 items-center border-white mb-2 hover:bg-gray-200 transition-transform: duration-500 ease-in-out hover:text-black"
            >
              <Link className="" href={`./${params.courseId}/${task.id}`}>
                {task.contents} -{" "}
                {new Date(task.deadline)
                  .toISOString()
                  .split("T")[0]
                  .split("-")
                  .reverse()
                  .join(".") +
                  " " +
                  new Date(task.deadline)
                    .toISOString()
                    .split("T")[1]
                    .split(".")[0]}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )
  ) : (
    <div className="mt-5">
      <h1 className="text-lg">Brak zadań</h1>
    </div>
  );
}

export default TaskList;
