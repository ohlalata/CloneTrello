import React from "react";
import * as signalR from "@microsoft/signalr";

const Connection = new signalR.HubConnectionBuilder()
  .withUrl("http://127.0.0.1:5500/signalHub")
  .withAutomaticReconnect()
  .configureLogging(signalR.LogLevel.Information)
  .build();

export default Connection;
