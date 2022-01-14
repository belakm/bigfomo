import React from "react";
import styled from "styled-components";
import { FlexColumn, FlexRow } from "./Flex";
import Spacer from "./Spacer";

const Header = () => {
  return (
    <FlexRow align="end end">
      <FlexColumn style={{ maxWidth: "12em", paddingRight: 150 }}>
        <h1 style={{ fontSize: "4em" }}>LOGO</h1>
        <Spacer />
        <p>
          Collaboratively administrate empowered markets via plug-and-play
          networks. Dynamically procrastinate B2C users after installed base
          benefits. Dramatically visualize customer directed convergence without
          revolutionary ROI.
        </p>
      </FlexColumn>
    </FlexRow>
  );
};

export default Header;
