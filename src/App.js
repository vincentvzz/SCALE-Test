import logo from './logo.svg';
import './App.css';
import Tag from "./components/tag";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Tag></Tag>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
