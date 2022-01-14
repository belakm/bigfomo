import React from "react";
import logo from "./logo.svg";
import "./App.css";
import RoiTriangle from "./components/RoiTriangle";
import styled from "styled-components";
import Header from "./components/Header";
import triangleData from "./data/triangleData";

const Wrapper = styled.div`
  position: relative;
  padding: 2em 2em;
  min-height: 100vh;
  background: #030322;
  color: white;
  box-sizing: border-box;
`;

function App() {
  return (
    <div className="App">
      <Wrapper>
        <Header></Header>
        <RoiTriangle triangleData={triangleData} />
      </Wrapper>
    </div>
  );
}

export default App;
