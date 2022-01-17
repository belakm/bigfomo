import styled from "styled-components";
import { Crypto } from "../App";
import Dropdown from "./Dropdown";
import { FlexColumn, FlexRow } from "./Flex";
import Spacer from "./Spacer";

const Wrapper = styled.div`
  box-sizing: border-box;
  width: 640px;
`;
interface HeaderProps {
  crypto: Crypto;
  setSelectedCrypto: (input: Crypto) => void;
}

const Header = ({ crypto, setSelectedCrypto }: HeaderProps) => {
  return (
    <FlexColumn align="start center">
      <Wrapper style={{ width: "640" }}>
        <h1 style={{ fontSize: "6em", color: "#E6007E", fontWeight: 500 }}>
          <small style={{ fontSize: ".5em" }}>the</small> BIG FOMO
        </h1>
        <Spacer />
        <p style={{ color: "grey" }}>
          Visualizing the staggering ROI of crypto.
        </p>
        <Spacer />
        <Spacer />
        <Spacer />
        <FlexRow align="center center">
          <span style={{ paddingRight: ".5em" }}>Im interested in</span>
          <Dropdown
            initialValue={crypto.toString()}
            options={[
              { value: "Bitcoin", label: "Bitcoin" },
              { value: "Ethereum", label: "Ethereum" },
              { value: "Ripple", label: "Ripple" },
            ]}
            onChange={(value) => setSelectedCrypto(value as Crypto)}
          />
        </FlexRow>
      </Wrapper>
    </FlexColumn>
  );
};

export default Header;
