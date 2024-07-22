import React, { useEffect } from "react";
import Route from "./router/index";
import "./assets/scss/app.scss";
import Notification from './components/Notification';

function App() {
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
