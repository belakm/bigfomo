import "./App.css";
import RoiTriangle from "./components/RoiTriangle";
import styled from "styled-components";
import Header from "./components/Header";
import { BitcoinData, EthereumData, RippleData } from "./data/triangleData";
import Calculator from "./components/Calculator";
import { useState } from "react";

const Wrapper = styled.div`
  margin: 0 auto;
  max-width: 1200px;
  padding: 2em 2em;
  box-sizing: border-box;
`;

const ColorSection = styled.div<{ color: string; fontColor?: string }>`
  background-color: ${({ color }) => color};
  color: ${({ fontColor }) => (fontColor ? fontColor : "inherit")};
`;

export type Crypto = "Bitcoin" | "Ethereum" | "Ripple";

function App() {
  const [crypto, setSelectedCrypto] = useState<Crypto>("Bitcoin");
  const data = {
    Bitcoin: BitcoinData,
    Ethereum: EthereumData,
    Ripple: RippleData,
  };
  return (
    <div className="App">
      <Wrapper>
        <Header crypto={crypto} setSelectedCrypto={setSelectedCrypto} />
      </Wrapper>
      <ColorSection color="#D8ECF2">
        <Wrapper>
          <RoiTriangle crypto={crypto} triangleData={data[crypto]} />
        </Wrapper>
      </ColorSection>
      <Wrapper>
        <Calculator crypto={crypto} />
      </Wrapper>
    </div>
  );
}

export default App;
