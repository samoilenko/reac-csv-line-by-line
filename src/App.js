import React from 'react';
import CsvUpload from './CsvUpload';

function App() {
  const processData = line => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.7) {
          resolve();
        } else {
          reject(new Error('Unprocessable data'));
        }
      }, 1000);
    });
  };

  return <CsvUpload processData={processData}/>
}

export default App;
