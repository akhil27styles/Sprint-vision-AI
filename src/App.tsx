// App.js

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Board from "./components/Board";
import Rag from "./Rag/Rag";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <Header />
        <Board />
        <Rag />
      </div>
    </div>
  );
}

export default App;
