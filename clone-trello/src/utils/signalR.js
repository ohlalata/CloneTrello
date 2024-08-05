import { HubConnectionBuilder } from "@microsoft/signalr";
import EventEmitter from "events";

class SignalREventEmitter extends EventEmitter {}
const signalREventEmitter = new SignalREventEmitter();

const initHubConnection = (userId) => {
  const hubConnection = new HubConnectionBuilder()
    .withUrl(`https://localhost:7201/signalHub?userId=${userId}`)
    .withAutomaticReconnect()
    .build();

  hubConnection
    .start()
    .then(() => {
      console.log("SignalR Connected.");
    })
    .catch((err) => console.error("SignalR Connection Error: ", err));

  hubConnection.on("ReceiveComment", (comment) => {
    console.log("ReceiveComment:", comment);
    signalREventEmitter.emit("ReceiveComment", comment);
  });

  hubConnection.on("ReceiveTotalNotification", (totalCount) => {
    console.log("ReceiveTotalNotification:", totalCount);
    signalREventEmitter.emit("ReceiveTotalNotification", totalCount);
  });

  hubConnection.on("ReceiveActivity", (cardActivity) => {
    console.log("ReceiveActivity", cardActivity);
    signalREventEmitter.emit("ReceiveActivity", cardActivity);
  });

  // hubConnection.on("ReceiveNotification", (notification) => {
  //   console.log("ReceiveNotification:", notification);
  //   signalREventEmitter.emit("ReceiveNotification", notification);
  // });

  return hubConnection;
};

export default {
  initHubConnection,
  signalREventEmitter,
};
