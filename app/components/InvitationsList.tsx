"use client";
import React from "react";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { get } from "http";

function InvitationsList() {
  const [invitations, setInvitations] = useState([]);
  const token = Cookies.get("token");

  const getInvitations = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/invitations/myInvitationsAdmin",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setInvitations(data);
      } else {
        alert("Error: " + response.statusText);
      }
    } catch (error) {
      alert("Error: " + error);
    }
  };

  const handleAccept = async (id: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/invitations/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        alert("Invitation accepted");
        getInvitations();
      } else {
        alert("Error: " + response.statusText);
      }
    } catch (error) {
      alert("Error: " + error);
    }
  };

  const handleDecline = async (id: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/invitations/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        alert("Invitation declined");
        getInvitations();
      } else {
        alert("Error: " + response.statusText);
      }
    } catch (error) {
      alert("Error: " + error);
    }
  };

  useEffect(() => {
    getInvitations();
  }, []);

  return (
    <div>
      <h1 className="text-4xl mt-20">Invitations List</h1>
      <div className="mt-10">
        {invitations.map((invitation: any) => (
          <div
            key={invitation.id}
            className="border border-gray-300 p-4 rounded-md mt-4"
          >
            <p>
              User: {invitation.user.firstName} {invitation.user.lastName} -{" "}
              {invitation.user.email}
            </p>
            <p>Want to join: {invitation.course.name}</p>
            <div className="flex justify-between mt-2">
              <button
                onClick={() => handleAccept(invitation.id)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
              >
                Accept
              </button>
              <button
                onClick={() => handleDecline(invitation.id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2"
              >
                Decline
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InvitationsList;
