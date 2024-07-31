// import React from "react";
// import * as signalR from "@microsoft/signalr";

// const Connection = new signalR.HubConnectionBuilder()
//   .withUrl("https://localhost:7201/signalHub")
//   .withAutomaticReconnect()
//   .configureLogging(signalR.LogLevel.Information)
//   .build();

// export default Connection;


import React from "react";
import * as signalR from "@microsoft/signalr";

const Connection = new signalR.HubConnectionBuilder()
  .withUrl("https://localhost:7201/signalHub")
  .withAutomaticReconnect()
  .configureLogging(signalR.LogLevel.Information)
  .build();

let initialized = false;

const startConnection = async () => {
  if (!initialized) {
    try {
      await Connection.start();
      console.log("SignalR Connected.");
      initialized = true;
    } catch (err) {
      console.error("SignalR Connection Error: ", err);
    }
  }
};

const stopConnection = async () => {
  if (initialized) {
    try {
      await Connection.stop();
      console.log("SignalR Disconnected.");
      initialized = false;
    } catch (err) {
      console.error("SignalR Disconnection Error: ", err);
    }
  }
};

const onReceiveTotalNotification = (callback) => {
  Connection.on("ReceiveTotalNotification", callback);
};

const offReceiveTotalNotification = () => {
  Connection.off("ReceiveTotalNotification");
};

const invokeReceiveTotalNotification = async (userId) => {
  try {
    const result = await Connection.invoke("ReceiveTotalNotification", userId);
    return result;
  } catch (err) {
    console.error("Error invoking ReceiveTotalNotification:", err);
  }
};

const onReceiveComment = (callback) => {
  Connection.on("ReceiveComment", callback);
};

const offReceiveComment = () => {
  Connection.off("ReceiveComment");
};

export {
  Connection,
  startConnection,
  stopConnection,
  onReceiveTotalNotification,
  offReceiveTotalNotification,
  invokeReceiveTotalNotification,
  onReceiveComment,
  offReceiveComment,
};
