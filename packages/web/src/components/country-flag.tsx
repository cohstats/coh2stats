import React from "react";

// @ts-ignore
import ReactCountryFlagLib from "react-country-flag";

// Wrapper to ensure type compatibility with React 19
const ReactCountryFlag = ReactCountryFlagLib as React.FC<any>;

interface IProps {
  countryCode: string | any;
  style?: Record<string, any>;
}
export const CountryFlag: React.FC<IProps> = ({ countryCode, style }) => {
  const finalStyle = {
    ...{
      width: "1.5em",
      height: "1.5em",
      paddingRight: 5,
    },
    ...style,
  };

  return (
    <ReactCountryFlag countryCode={countryCode} svg style={finalStyle} title={countryCode} />
  );
};
