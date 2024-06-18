import { useState, useEffect } from "react";
import Cookies from "js-cookie";

function Users() {
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    try {
      const token = Cookies.get("token");
      const response = await fetch("http://localhost:8080/api/v1/users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        alert("Error: " + response.statusText);
      }
    } catch (error) {
      alert("Error: " + error);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(`http://localhost:8080/api/v1/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        alert("User deleted");
        getUsers();
      } else {
        alert("Error: " + response.statusText);
      }
    } catch (error) {
      alert("Error: " + error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="text-4xl mt-10">
      <h1 className="text-center mb-5">Users List</h1>
      <ul className="text-lg">
        {users.map((user: any) => (
          <li
            className="border-b-2 border-white border-opacity-50 mb-3 flex justify-between items-center"
            key={user.id}
          >
            {user.id}
            {")"} {user.firstName} {user.lastName} - {user.email}
            <button
              className="ml-5 mb-2 bg-red-500 text-white px-2 py-2"
              onClick={() => deleteUser(user.id)}
            >
              DELETE
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Users;
