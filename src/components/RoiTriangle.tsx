import styled from "styled-components";
import chroma from "chroma-js";
import { intToString, intToStringLongFormat } from "../utils/number";
import { FlexColumn, FlexRow } from "./Flex";
import { Crypto } from "../App";
import { useEffect, useState } from "react";

const Emphasis = styled.strong`
  font-weight: 500;
`;

const RoiExplanation = styled.div`
  position: absolute;
  width: 40%;
  left: 0;
  top: 0;
  text-align: left;

  h1 {
    font-size: 1.4em;
  }
  line-height: 1.8;
`;

const TriangleCellDash = styled.div<{
  buyIndex: number;
  sellIndex: number;
  rows: number;
  direction: "right" | "bottom";
}>`
  position: absolute;
  left: ${({ direction }) => (direction === "right" ? "100%" : "-4px")};
  top: ${({ direction }) => (direction === "bottom" ? "100%" : "-4px")};
  width: ${({ direction, sellIndex, rows }) =>
    direction === "right" ? `calc((100% + 12px) * ${sellIndex});` : 0};
  height: ${({ direction, buyIndex }) =>
    direction === "right" ? 0 : `calc((2em + 4px) * ${buyIndex})`};
  border-right: ${({ direction }) =>
    direction === "bottom" ? "4px solid #002b3f" : 0};
  border-bottom: ${({ direction }) =>
    direction === "right" ? "4px solid #002b3f" : 0};
`;

const TriangleContainer = styled.div`
  position: relative;
  float: left;
  display: block;
  width: 100%;
`;

const TriangleRow = styled.div`
  position: relative;
  float: left;
  width: 100%;
`;

const TriangleCellRowNumber = styled.div<{
  isSelected?: boolean;
}>`
  box-sizing: border-box;
  position: relative;
  float: right;
  width: 50px;
  height: 2em;
  padding: 0.2em;
  line-height: 1.7;
  background-color: white;
  background: ${({ isSelected }) =>
    isSelected ? "#002b3f" : "rgba(255, 255, 255, 0.5)"};
  color: ${({ isSelected }) => (isSelected ? "white" : "#002b3f")};
`;

const TriangleCellColumnNumber = styled.div<{
  rows: number;
  isSelected?: boolean;
}>`
  box-sizing: border-box;
  position: relative;
  float: right;
  width: ${({ rows }) => `calc((100% - 50px) / ${rows});`};
  height: 2em;
  padding: 0.2em;
  line-height: 1.7;
  background-color: white;
  background: ${({ isSelected }) =>
    isSelected ? "#002b3f" : "rgba(255, 255, 255, 0.5)"};
  color: ${({ isSelected }) => (isSelected ? "white" : "#002b3f")};
`;

const getPointOnScale = (roi: number, min: number, max: number) => {
  const normalized = roi <= 0 ? roi / min : roi / max;
  const point = roi <= 0 ? 0.5 - normalized * 0.5 : 0.5 + normalized * 0.5;
  const addition =
    (roi <= 0 ? -1 : 1) *
    (Math.abs(roi) > 500
      ? 0.08
      : Math.abs(roi) > 100
      ? 0.07
      : Math.abs(roi) > 70
      ? 0.04
      : Math.abs(roi) > 50
      ? 0.02
      : 0);
  return Math.min(Math.max(point + addition, 0), 1);
};

const TriangleCell = styled.div<{
  rows: number;
  roi: number;
  maxValue: number;
  minValue: number;
  isSelected?: boolean;
}>`
  box-sizing: border-box;
  position: relative;
  cursor: pointer;
  float: right;
  width: ${({ rows }) => `calc((100% - 50px) / ${rows});`};
  height: 2em;
  padding: ${({ isSelected }) => (isSelected ? "calc(0.2em - 4px)" : "0.2em")};
  line-height: 1.7;
  text-align: center;
  border: ${({ isSelected }) => (isSelected ? "4px solid #002b3f" : 0)};
  box-sizing: border-box;
  background: ${({ roi, maxValue, minValue }) =>
    chroma
      .scale(["#790042", "#e6007e", "#ffffff", "#17e600", "#073d00"])(
        getPointOnScale(roi, minValue, maxValue)
      )
      .hex()};
  color: ${({ roi, maxValue, minValue }) =>
    chroma
      .scale(["#fff", "#fff", "#fff", "#000", "#333", "#fff"])(
        getPointOnScale(roi, minValue, maxValue)
      )
      .hex()};

  z-index: ${({ isSelected }) => (isSelected ? 2 : 1)};
`;

const RoiTriangle = ({
  triangleData,
  crypto,
}: {
  triangleData: Record<number, Record<number, number>>;
  crypto: Crypto;
}) => {
  const [selectedYears, setSelectedYears] = useState<[number, number]>([
    2017, 2019,
  ]);
  const [selectedYearsRoi, setSelectedYearsRoi] = useState<string>(
    intToStringLongFormat(
      triangleData[selectedYears[0]]
        ? triangleData[selectedYears[0]][selectedYears[1]]
        : 0
    )
  );
  useEffect(() => {
    setSelectedYears([2017, 2019]);
  }, [crypto]);
  useEffect(() => {
    setSelectedYearsRoi(
      intToStringLongFormat(triangleData[selectedYears[0]][selectedYears[1]])
    );
  }, [selectedYears]);
  const { maxRoi, minRoi } = Object.entries(triangleData).reduce(
    ({ minRoi, maxRoi }, [_, connectedYears]) => {
      const maxYearlyRoi = Object.values(connectedYears).reduce(
        (maxRoi, roi) => (roi > maxRoi ? roi : maxRoi),
        0
      );
      const minYearlyRoi = Object.values(connectedYears).reduce(
        (minRoi, roi) => (roi < minRoi ? roi : minRoi),
        0
      );
      return {
        maxRoi: maxRoi < maxYearlyRoi ? maxYearlyRoi : maxRoi,
        minRoi: minRoi > minYearlyRoi ? minYearlyRoi : minRoi,
      };
    },
    {
      maxRoi: 0,
      minRoi: 0,
    }
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
    <FlexColumn style={{ position: "relative" }}>
      <RoiExplanation>
        <h1>ROI Triangle</h1>
        <p>
          If you bought {crypto} at the end of{" "}
          <Emphasis>{Number(selectedYears[0]) - 1}</Emphasis> and held it until
          the end of <Emphasis>{Number(selectedYears[1]) - 1}</Emphasis>, your
          portfolio grew by an average of
          <br />{" "}
          <Emphasis style={{ fontSize: "1.4em", color: "#e6007e" }}>
            {selectedYearsRoi} % per year
          </Emphasis>
          .
        </p>
      </RoiExplanation>
      <FlexRow align="end">
        <TriangleCellRowNumber style={{ borderRadius: "4px 4px 0 0 " }}>
          Buy
        </TriangleCellRowNumber>
      </FlexRow>
      <FlexRow>
        <FlexColumn align="end" style={{ minWidth: "4em" }}>
          <TriangleCellColumnNumber
            rows={1}
            style={{ width: "100%", borderRadius: "4px 0 0 4px " }}
          >
            Sell
          </TriangleCellColumnNumber>
        </FlexColumn>
        <TriangleContainer>
          {normalized.reverse().map(({ year: buyYear, data }, buyIndex) => (
            <TriangleRow key={buyYear}>
              <TriangleCellRowNumber
                isSelected={Number(buyYear) === selectedYears[0]}
              >
                {Number(buyYear) - 1}
              </TriangleCellRowNumber>
              {data.reverse().map(({ year: sellYear, roi }, sellIndex) => {
                const isSelected =
                  Number(buyYear) === selectedYears[0] &&
                  Number(sellYear) === selectedYears[1];
                return (
                  <TriangleCell
                    minValue={minRoi}
                    maxValue={maxRoi}
                    key={sellYear}
                    roi={roi}
                    rows={Object.keys(normalized).length}
                    onClick={() =>
                      setSelectedYears([Number(buyYear), Number(sellYear)])
                    }
                    style={{
                      borderTopLeftRadius:
                        sellIndex === data.length - 1 ? 4 : 0,
                    }}
                    isSelected={
                      Number(buyYear) === selectedYears[0] &&
                      Number(sellYear) === selectedYears[1]
                    }
                  >
                    {intToString(roi)} %
                    {isSelected && (
                      <TriangleCellDash
                        rows={Object.keys(normalized).length}
                        buyIndex={Object.keys(normalized).length - buyIndex - 1}
                        sellIndex={sellIndex}
                        direction={"right"}
                      />
                    )}
                    {isSelected && (
                      <TriangleCellDash
                        rows={Object.keys(normalized).length}
                        buyIndex={Object.keys(normalized).length - buyIndex - 1}
                        sellIndex={sellIndex}
                        direction={"bottom"}
                      />
                    )}
                  </TriangleCell>
                );
              })}
            </TriangleRow>
          ))}
          <TriangleRow>
            <TriangleCellRowNumber
              style={{ height: "2em", borderBottomRightRadius: 4 }}
            />
            {normalized.map(({ year }) => (
              <TriangleCellColumnNumber
                key={year}
                rows={Object.keys(normalized).length}
                isSelected={Number(year) === selectedYears[1] - 1}
              >
                {Number(year)}
              </TriangleCellColumnNumber>
            ))}
          </TriangleRow>
        </TriangleContainer>
      </FlexRow>
    </FlexColumn>
  );
};

export default RoiTriangle;
