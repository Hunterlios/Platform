"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useParams, useRouter } from "next/navigation";

interface File {
  fileName: string;
  downloadURL: string;
  authorId: number;
  fileType: string;
  uploadDate: string;
}

type Student = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};

export default function Task() {
  const params = useParams();
  const token = Cookies.get("token");
  const [task, setTask] = useState({
    id: 0,
    courseName: "",
    date: "",
    deadline: "",
    contents: "",
  });
  const [taskUploaded, setTaskUploaded] = useState(false);

  const [file, setFile] = useState<Array<File>>() as any;
  const [role, setRole] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const [studentsNotSubmitted, setStudentsNotSubmitted] = useState<Student[]>(
    []
  );
  const router = useRouter();

  const getStudents = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      } else {
        console.log("Error: " + response.statusText);
      }
    } catch (error) {
      console.log("Error: " + error);
    }
  };

  const getNotSubmittedStudents = async () => {
    const role = await getUser();

    if (role === "ADMIN") {
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/tasks/myUnsolvedTasksAdmin`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              ContentType: "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log(data, params.task);
          data.forEach((task: any) => {
            if (
              task.taskDTO.id == params.task &&
              studentsNotSubmitted.length == 0 &&
              task.users.length > 0
            ) {
              setStudentsNotSubmitted(task.users);
            }
          });
        } else {
          console.log("Error: " + response.statusText);
        }
      } catch (error) {
        console.log("Error: " + error);
      }
    }
  };

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
          setRole(data.role);
          if (data.role === "ADMIN") {
            await getStudents();
          }
          return data.role;
        } else {
          router.push("/");
        }
      } catch (error) {
        router.push("/");
      }
    }
  };

  const getTask = async (taskId: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/tasks/individualTask/${taskId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setTask(data);
        await getTaskFile();
      } else {
        console.log("Error: " + response.statusText);
      }
    } catch (error) {
      console.log("Error: " + error);
    }
  };

  const getTaskFile = async () => {
    const role = await getUser();
    let response: Response;
    try {
      if (role === "ADMIN") {
        response = await fetch(
          `http://localhost:8080/api/v1/resources/fromTask/${params.task}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setTaskUploaded(true);
            setFile(data);
          } else {
            setTaskUploaded(false);
          }
        } else {
          setTaskUploaded(false);
          console.log("Error: " + response.statusText);
        }
      } else {
        response = await fetch(
          `http://localhost:8080/api/v1/resources/myFromTask/${params.task}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setTaskUploaded(true);
            setFile(data[0]);
          } else {
            setTaskUploaded(false);
          }
        } else {
          setTaskUploaded(false);
          console.log("Error: " + response.statusText);
        }
      }
    } catch (error) {
      setTaskUploaded(false);
      console.log("Error: " + error);
    }
  };

  const handleFileSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get("file");
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/resources/upload/${params.task}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      if (response.ok) {
        alert("Dodano plik");
        window.location.reload();
      } else {
        console.log("Error: " + response.statusText);
      }
    } catch (error) {
      console.log("Error: " + error);
    }
  };

  const handleFileDownload = async (fileIndex: number) => {
    try {
      if (role === "ADMIN") {
        const response = await fetch(
          `http://localhost:8080${file[fileIndex]?.downloadURL}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = file[fileIndex]?.fileName as string;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        } else {
          console.log("Error: " + response.statusText);
        }
      } else {
        const response = await fetch(
          `http://localhost:8080${file?.downloadURL}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = file?.fileName as string;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        } else {
          console.log("Error: " + response.statusText);
        }
      }
    } catch (error) {
      console.log("Error: " + error);
    }
  };

  const handleDeleteFile = async (fileIndex: number) => {
    try {
      if (role === "ADMIN") {
        const response = await fetch(
          `http://localhost:8080/api/v1/resources/${file[fileIndex]?.downloadURL
            .split("/")
            .pop()}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          alert("File deleted " + file[fileIndex]?.fileName);
          window.location.reload();
        } else {
          console.log("Error: " + response.statusText);
        }
      } else {
        const response = await fetch(
          `http://localhost:8080/api/v1/resources/${file?.downloadURL
            .split("/")
            .pop()}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          alert("File deleted " + file?.fileName);
          window.location.reload();
        } else {
          console.log("Error: " + response.statusText);
        }
      }
    } catch (error) {
      console.log("Error: " + error);
    }
  };

  useEffect(() => {
    getTask(params.task as string);
    getNotSubmittedStudents();
  }, []);

  return role === "ADMIN" ? (
    task.courseName ? (
      taskUploaded ? (
        <div className="font-mono flex flex-col min-h-screen justify-center items-center gap-2">
          <button
            onClick={() => router.back()}
            className="absolute top-0 left-0 bg-white text-black m-8 px-4 py-2 border border-black hover:bg-black hover:text-white hover:border-white transition-transform: duration-500 ease-in-out"
          >
            Wróć
          </button>
          <h1 className="text-4xl mb-5">{task.contents}</h1>
          <p className="text-xl">
            Data stworzenia zadania: {new Date(task.date).toLocaleString()}
          </p>
          <p className="text-xl text-red-500">
            Deadline zadania:{" "}
            {new Date(task.deadline)
              .toISOString()
              .split("T")[0]
              .split("-")
              .reverse()
              .join(".") +
              " " +
              new Date(task.deadline).toISOString().split("T")[1].split(".")[0]}
          </p>
          <h2 className="mt-5 mb-2 text-xl">Zadania studentów: </h2>
          <div className="flex flex-col border-2 border-white p-2 gap-2">
            {file.map((f: File) => (
              <div
                key={f.fileName}
                className="grid grid-cols-[1fr,2fr,2fr,1fr] gap-2 items-center text-center border-2 border-white p-2"
              >
                <p>
                  {students.find((s: any) => s.id === f.authorId)?.firstName +
                    " " +
                    students.find((s: any) => s.id === f.authorId)?.lastName}
                </p>
                {new Date(f.uploadDate).getTime() + 120 * 60000 <
                new Date(task.deadline).getTime() ? (
                  <p>{new Date(f.uploadDate).toLocaleString()}</p>
                ) : (
                  <p className="text-red-500">
                    {new Date(f.uploadDate).toLocaleString()}
                  </p>
                )}

                <button
                  className="bg-white text-black p-2 hover:bg-gray-300 transition-transform: duration-500 ease-in-out"
                  onClick={() => handleFileDownload(file.indexOf(f))}
                >
                  {f.fileName}
                </button>
                <button
                  className="bg-red-500 text-black p-2 hover:bg-red-700 transition-transform: duration-500 ease-in-out"
                  onClick={() => handleDeleteFile(file.indexOf(f))}
                >
                  Usuń plik studenta
                </button>
              </div>
            ))}
          </div>
          <div className="mt-20 text-center">
            <h2 className="mb-5 text-xl">Nieoddane zadania:</h2>
            <div>
              {studentsNotSubmitted.length > 0 ? (
                studentsNotSubmitted.map((s: any) => (
                  <div
                    key={s.id}
                    className="grid grid-cols-[1fr,1fr,1fr,1fr] gap-2 items-center text-center border-2 border-white p-2"
                  >
                    <p>
                      {s.firstName} {s.lastName}
                    </p>
                    <p>Brak oddanego zadania</p>
                  </div>
                ))
              ) : (
                <p className="text-center">Brak nieoddanych zadań</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="font-mono flex flex-col min-h-screen justify-center items-center gap-2">
          <button
            onClick={() => router.back()}
            className="absolute top-0 left-0 bg-white text-black m-8 px-4 py-2 border border-black hover:bg-black hover:text-white hover:border-white transition-transform: duration-500 ease-in-out"
          >
            Wróć
          </button>
          <h1 className="text-4xl mb-5">{task.contents}</h1>
          <p className="text-xl">
            Data stworzenia zadania: {new Date(task.date).toLocaleString()}
          </p>
          <p className="text-xl text-red-500">
            Deadline zadania:{" "}
            {new Date(task.deadline)
              .toISOString()
              .split("T")[0]
              .split("-")
              .reverse()
              .join(".") +
              " " +
              new Date(task.deadline).toISOString().split("T")[1].split(".")[0]}
          </p>
          <h2 className="mt-5 mb-2 text-xl">Zadania studentów: </h2>
          <div>
            <p>Brak oddanych zadań</p>
          </div>
          <div className="mt-20 text-center">
            <h2 className="mb-5 text-xl">Nieoddane zadania:</h2>
            <div>
              {studentsNotSubmitted.length > 0 ? (
                studentsNotSubmitted.map((s: any) => (
                  <div
                    key={s.id}
                    className="grid grid-cols-[1fr,1fr,1fr,1fr] gap-2 items-center text-center border-2 border-white p-2"
                  >
                    <p>
                      {s.firstName} {s.lastName}
                    </p>
                    <p>Brak oddanego zadania</p>
                  </div>
                ))
              ) : (
                <p>Brak nieoddanych zadań</p>
              )}
            </div>
          </div>
        </div>
      )
    ) : (
      <div className="flex justify-center items-center font-mono min-h-screen">
        <h1 className="text-2xl">Loading...</h1>
      </div>
    )
  ) : task.courseName ? (
    taskUploaded ? (
      <div className="font-mono flex flex-col min-h-screen justify-center items-center gap-2">
        <button
          onClick={() => router.back()}
          className="absolute top-0 left-0 bg-white text-black m-8 px-4 py-2 border border-black hover:bg-black hover:text-white hover:border-white transition-transform: duration-500 ease-in-out"
        >
          Wróć
        </button>
        <h1 className="text-4xl mb-5">{task.contents}</h1>
        <p className="text-xl">
          Data stworzenia zadania: {new Date(task.date).toLocaleString()}
        </p>
        <p className="text-xl text-red-500">
          Deadline zadania:{" "}
          {new Date(task.deadline)
            .toISOString()
            .split("T")[0]
            .split("-")
            .reverse()
            .join(".") +
            " " +
            new Date(task.deadline).toISOString().split("T")[1].split(".")[0]}
        </p>
        <div className="flex items-center border-2 border-white pl-2">
          <h2 className="mr-2">Dodano zadanie: </h2>
          <button
            className="bg-white text-black p-2 hover:bg-gray-300 transition-transform: duration-500 ease-in-out"
            onClick={() => handleFileDownload(0)}
          >
            {file?.fileName}
          </button>
          <button
            className="bg-red-500 text-black p-2 hover:bg-red-700 transition-transform: duration-500 ease-in-out"
            onClick={() => handleDeleteFile(0)}
          >
            Usuń plik
          </button>
        </div>
      </div>
    ) : (
      <div className="font-mono flex flex-col min-h-screen justify-center items-center gap-2">
        <button
          onClick={() => router.back()}
          className="absolute top-0 left-0 bg-white text-black m-8 px-4 py-2 border border-black hover:bg-black hover:text-white hover:border-white transition-transform: duration-500 ease-in-out"
        >
          Wróć
        </button>
        <h1 className="text-4xl mb-5">{task.contents}</h1>
        <p className="text-xl">
          Data stworzenia zadania: {new Date(task.date).toLocaleString()}
        </p>
        <p className="text-xl text-red-500">
          Deadline zadania:{" "}
          {new Date(task.deadline)
            .toISOString()
            .split("T")[0]
            .split("-")
            .reverse()
            .join(".") +
            " " +
            new Date(task.deadline).toISOString().split("T")[1].split(".")[0]}
        </p>
        <div className="flex items-center border-2 border-white pl-2">
          <h2 className="mr-2">Dodaj zadanie:</h2>
          <form onSubmit={handleFileSubmit}>
            <input type="file" name="file" />
            <button
              className="bg-white text-black p-2 border-l-2 hover:bg-black hover:text-white hover:border-white transition-transform: duration-500 ease-in-out"
              type="submit"
            >
              Dodaj zadanie
            </button>
          </form>
        </div>
      </div>
    )
  ) : (
    <div className="flex justify-center items-center font-mono min-h-screen">
      <h1 className="text-2xl">Loading...</h1>
    </div>
  );
}
