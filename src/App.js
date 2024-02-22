// import logo from './logo.svg';
import "./App.css";
import Header from "./Components/Header";
import Loading from "./Components/Loading";
import Login from "./Components/Login";

function App() {
  console.log("i am inside the app");
  return (
    <>
      <Header />
      <Login />
      {/* <Loading /> */}
      <div className="App">
        <h1 className="app-blue">RReady to build the SimpliMed plus</h1>
      </div>
    </>
  );
}

export default App;
