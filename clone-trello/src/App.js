import React, { useContext, useEffect } from "react";
import Route from "./router/index";
import "./assets/scss/app.scss";
import Notification from './components/Notification';
import signalR from './utils/signalR'
import { AuthContext } from "./components/authContext";

function App() {
  const { isAuthenticated } = useContext(AuthContext);
  useEffect(() => {
    const userProfile = JSON.parse(localStorage.getItem('userProfile'));
    const userId = userProfile?.data?.id;
    if (userId) {
      signalR.initHubConnection(userId);
    }
  }, [isAuthenticated])

  return (
    <>
      <Route />
      <div className="App">
        <header className="App-header">
          <Notification />
        </header>
      </div>
    </>
  );
}

export default App;
