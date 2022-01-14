import React from "react";
import styled from "styled-components";
import chroma from "chroma-js";
import { intToString } from "../utils/number";
import { FlexColumn, FlexRow } from "./Flex";

const AxisExplanation = styled.div`
  position: relative;
  width: 50px;
  > span {
    position: absolute;
    top: 50%;
    width: 250px;
    transform: rotate(270deg) translateY(-125px);
    transform-origin: 50% 50%;
  }
`;

const TriangleContainer = styled.div`
  position: relative;
  float: left;
  display: block;
  width: calc(100% - 50px);
`;

const TriangleRow = styled.div`
  position: relative;
  float: left;
  width: 100%;
`;

const TriangleCellRowNumber = styled.div`
  box-sizing: border-box;
  position: relative;
  float: right;
  width: 50px;
  height: 5em;
  padding: 0.2em;
  line-height: 5em;
`;

const TriangleCellColumnNumber = styled.div<{
  rows: number;
}>`
  box-sizing: border-box;
  position: relative;
  float: right;
  width: ${({ rows }) => `calc((100% - 50px) / ${rows});`};
  height: 2em;
  padding: 0.2em;
  line-height: 2em;
`;

const TriangleCell = styled.div<{
  rows: number;
  roi: number;
  maxValue: number;
}>`
  box-sizing: border-box;
  position: relative;
  float: right;
  width: ${({ rows }) => `calc((100% - 50px) / ${rows});`};
  height: 5em;
  padding: 0.2em;
  line-height: 5em;
  text-align: center;
  background: ${({ roi, maxValue }) =>
    chroma
      .scale(["#3d0000", "#ff0000", "#ffffff", "#00ff00", "#006d24"])(
        roi / maxValue + 0.5
      )
      .hex()};
  color: ${({ roi, maxValue }) =>
    chroma
      .scale(["#fff", "#fff", "#333", "#333", "#fff"])(roi / maxValue + 0.5)
      .hex()};
`;

const RoiTriangle = ({
  triangleData,
}: {
  triangleData: Record<number, Record<number, number>>;
}) => {
  const maxRoi = Object.entries(triangleData).reduce(
    (maxRoi, [_, connectedYears]) => {
      const maxYearlyRoi = Object.values(connectedYears).reduce(
        (maxRoi, roi) => (maxRoi < roi ? roi : maxRoi),
        0
      );
      return maxRoi < maxYearlyRoi ? maxYearlyRoi : maxRoi;
    },
    0
  );

  const normalized = Object.entries(triangleData).map(
    ([year, connectedYears]) => ({
      year,
      data: Object.entries(connectedYears).map(([year, roi]) => ({
        year,
        roi,
      })),
    })
  );
  return (
    <FlexColumn>
      <FlexRow align="end">
        <TriangleCellRowNumber style={{ marginRight: 50 }}>
          Buy
        </TriangleCellRowNumber>
      </FlexRow>
      <FlexRow>
        <FlexColumn align="end" style={{ minWidth: "4em" }}>
          <TriangleCellColumnNumber rows={1}>Sell</TriangleCellColumnNumber>
        </FlexColumn>
        <TriangleContainer>
          {normalized.reverse().map(({ year, data }) => (
            <TriangleRow key={year}>
              <TriangleCellRowNumber>{year}</TriangleCellRowNumber>
              {data.reverse().map(({ year, roi }) => (
                <TriangleCell
                  maxValue={maxRoi}
                  key={year}
                  roi={roi}
                  rows={Object.keys(normalized).length}
                >
                  {intToString(roi)} %
                </TriangleCell>
              ))}
            </TriangleRow>
          ))}
          <TriangleRow>
            <TriangleCellRowNumber style={{ height: "2em" }} />
            {normalized.map(({ year }) => (
              <TriangleCellColumnNumber rows={Object.keys(normalized).length}>
                {Number(year) + 1}
              </TriangleCellColumnNumber>
            ))}
          </TriangleRow>
        </TriangleContainer>
        <AxisExplanation>
          <span>Investment holding period in years</span>
        </AxisExplanation>
      </FlexRow>
    </FlexColumn>
  );
};

export default RoiTriangle;
