import React from "react";
import * as signalR from "@microsoft/signalr";

const Connection = new signalR.HubConnectionBuilder()
  .withUrl("https://localhost:7201/signalHub")
  .withAutomaticReconnect()
  .configureLogging(signalR.LogLevel.Information)
  .build();

export default Connection;
