import * as React from 'react';

interface Settings {
  notification: boolean;
  pathToLogFile: string;
  streamerMode: boolean;
  variant: 'topCenter' | 'left';
  useTray: boolean;
  openInBrowser: boolean;
  updateInterval: number;
}

const App = () => {

  return (
    <>
      <h1>Hello from Settings!</h1>
    </>
  );
};

export default App;
