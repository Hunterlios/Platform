"use client";
import React from "react";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

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
        console.log("Error: " + response.statusText);
      }
    } catch (error) {
      console.log("Error: " + error);
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
        console.log("Error: " + response.statusText);
      }
    } catch (error) {
      console.log("Error: " + error);
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
        console.log("Error: " + response.statusText);
      }
    } catch (error) {
      console.log("Error: " + error);
    }
  };

  useEffect(() => {
    getInvitations();
  }, []);

  return invitations.length > 0 ? (
    <div>
      <h1 className="text-4xl mt-20">Prośby o dodanie do kursu</h1>
      <div className="mt-10">
        {invitations.map((invitation: any) => (
          <div key={invitation.id} className="border border-gray-300 p-4 mt-4">
            <p>
              Użytkownik: {invitation.user.firstName} {invitation.user.lastName}{" "}
              - {invitation.user.email}
            </p>
            <p>Kurs: {invitation.course.name}</p>
            <div className="flex justify-between mt-2">
              <button
                onClick={() => handleAccept(invitation.id)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-2"
              >
                Zaakceptuj
              </button>
              <button
                onClick={() => handleDecline(invitation.id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 mt-2"
              >
                Odmów
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : null;
}

export default InvitationsList;
