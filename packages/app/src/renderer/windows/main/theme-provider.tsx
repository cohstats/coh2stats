import React, { ReactChild, ReactChildren, lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import { selectSettings } from "../../../redux/slice";

const AppDark = lazy(() => import("../../utils/theme-dark"));
const AppLight = lazy(() => import("../../utils/theme-light"));

interface IProps {
  children: ReactChild | ReactChildren;
}

const ThemeProvider: React.FC<IProps> = ({ children }): JSX.Element => {
  const settings = useSelector(selectSettings);

  //TODO: Finish the settings
  console.log(settings);
  console.log(settings.theme === "dark");

  const isDark = true;

  return (
    <>
      <Suspense fallback={<span />}>{isDark ? <AppDark /> : <AppLight />}</Suspense>
      {children}
    </>
  );
};

export default ThemeProvider;
