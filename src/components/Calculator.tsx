import { useEffect, useState } from "react";
import styled from "styled-components";
import { Crypto } from "../App";
import { BitcoinRoi, EthereumRoi, RippleRoi } from "../data/roiData";
import { intToString, intToStringLongFormat } from "../utils/number";
import CalculatorChart from "./CalculatorChart";
import Dropdown from "./Dropdown";
import { DateTime } from "luxon";
import Input from "./Input";

const CalculatorSentence = styled.div`
  display: inline-block;
  line-height: 1.8;
`;

const FinalValue = styled.span`
  color: #e6007e;
  font-size: 1.2em;
  font-weight: 500;
`;

interface CalculatorProps {
  crypto: Crypto;
}

export interface Datapoint {
  x: number;
  y: number;
}

const getRoi = (monthlyDeposit: number, numberOfMonths: number, rate: number) =>
  monthlyDeposit * ((Math.pow(1 + rate, numberOfMonths) - 1) / rate);

const getInvestmentAndInterestDatasets = (
  numberOfYears: number,
  investment: number,
  monthlyAverageInterest: number
) => {
  let investments: Datapoint[] = [];
  let interest: Datapoint[] = [];
  const dateNow = DateTime.now();
  for (let i = 0; i < numberOfYears * 12; i++) {
    const date = dateNow.plus({ months: i }).toMillis();
    investments = [
      ...investments,
      {
        x: date,
        y: (i + 1) * investment,
      },
    ];
    interest = [
      ...interest,
      {
        x: date,
        y: getRoi(investment, i + 1, monthlyAverageInterest) - investments[i].y,
      },
    ];
  }
  return { interest, investments };
};

const Calculator = ({ crypto }: CalculatorProps) => {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(100);
  const [numberOfYears, setNumberOfYears] = useState<number>(1);
  const [yearlyAverages, setYearlyAvarages] = useState<number>(1);
  const [finalValue, setFinalValue] = useState<number>(0);
  const [monthlyInvestmentsSet, setMonthlyInvestmentsSet] = useState<
    Datapoint[]
  >([]);
  const [monthlyInterestSet, setMonthlyInterestSet] = useState<Datapoint[]>([]);
  const rates: Record<Crypto, Record<number, number>> = {
    Bitcoin: BitcoinRoi,
    Ethereum: EthereumRoi,
    Ripple: RippleRoi,
  };

  useEffect(() => {
    const finalValue = getRoi(
      monthlyInvestment,
      numberOfYears * 12,
      Math.pow(1 + rates[crypto][yearlyAverages], 1 / 12) - 1
    );
    setFinalValue(finalValue);
    const { interest, investments } = getInvestmentAndInterestDatasets(
      numberOfYears,
      monthlyInvestment,
      Math.pow(1 + rates[crypto][yearlyAverages], 1 / 12) - 1
    );
    setMonthlyInterestSet(interest);
    setMonthlyInvestmentsSet(investments);
  }, [monthlyInvestment, numberOfYears, yearlyAverages, crypto]);

  return (
    <div>
      <CalculatorSentence>
        If you would invest{" "}
        <Input
          maxWidth={8}
          type="number"
          value={monthlyInvestment}
          onChange={({ target: { value } }) =>
            setMonthlyInvestment(Number(value))
          }
        />{" "}
        € each month for{" "}
        <Input
          type="number"
          value={numberOfYears}
          onChange={({ target: { value } }) => setNumberOfYears(Number(value))}
        />{" "}
        year(s),
        <br /> and the market would behave like in the{" "}
        <Dropdown
          options={[
            { value: 1, label: "last year" },
            { value: 2, label: "last 2 years" },
            { value: 3, label: "last 3 years" },
            { value: 5, label: "last 5 years" },
          ]}
          onChange={(value) => setYearlyAvarages(Number(value))}
          initialValue={yearlyAverages}
        />{" "}
        you would have{" "}
        <FinalValue>{intToStringLongFormat(finalValue)} €</FinalValue>.
      </CalculatorSentence>
      <CalculatorChart
        monthlyInterest={monthlyInterestSet}
        monthlyInvesting={monthlyInvestmentsSet}
      />
    </div>
  );
};

export default Calculator;
