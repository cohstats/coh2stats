import React, { ReactChild, ReactChildren, lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import { selectSettings } from "../../../redux/slice";

const ThemeDark = lazy(() => import("../../utils/theme-dark"));
const ThemeLight = lazy(() => import("../../utils/theme-light"));

interface IProps {
  children: ReactChild | ReactChildren;
}

const ThemeProvider: React.FC<IProps> = ({ children }): JSX.Element => {
  const settings = useSelector(selectSettings);

  console.log("THEME", settings.theme)

  return (
    <>
      <Suspense fallback={<span />}>{settings.theme === "dark" ? <ThemeDark /> : <ThemeLight />}</Suspense>
      {children}
    </>
  );
};

export default ThemeProvider;
