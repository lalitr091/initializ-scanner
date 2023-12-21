// ... (Previous imports and state definitions remain unchanged)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
const App = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('go');
  const [cveCount, setCveCount] = useState(0);
  const [ageInHours, setAgeInHours] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:8080/vulnerabilities')
      .then(response => {
        const updatedData = response.data.map(item => {
          const [day, month, year, hours, minutes, seconds] = item.Timestamp.split(/[\s-:]+/);
          const timestamp = new Date(year, month - 1, day, hours, minutes, seconds).getTime();
          
          return {
            ...item,
            Timestamp: timestamp,
          };
        });

        setData(updatedData);
        setFilteredData(updatedData);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleLanguageClick = (language) => {
    const lowercaseLanguage = language.toLowerCase();
    const filteredByLanguage = data.filter(item => {
      const lowercaseImageName = getImageName(item.Image).toLowerCase();
      return lowercaseImageName.includes(lowercaseLanguage);
    });

    const cveCountForLanguage = filteredByLanguage.filter(item => item.Message === 'Vulnerability found.').length;
    setCveCount(cveCountForLanguage);

    const ageInHoursForLanguage = calculateAgeForLanguage(filteredByLanguage);
    setAgeInHours(ageInHoursForLanguage);

    setFilteredData(filteredByLanguage);
    setSelectedLanguage(language);
  };

  const getImageName = (imageUrl) => {
    const parts = imageUrl.split("/");
    return parts[parts.length - 1];
  };

  const calculateAgeForLanguage = (filteredByLanguage) => {
    const latestTimestamp = filteredByLanguage.reduce((latest, item) => {
      return item.Timestamp > latest ? item.Timestamp : latest;
    }, 0);

    const currentTimestamp = Date.now();
    const ageInHours = Math.floor((currentTimestamp - latestTimestamp) / (1000 * 60 * 60));
    return ageInHours;
  };

  const parseTimestamp = (timestamp) => {
    const parts = timestamp.split(" ");
    const dateParts = parts[0].split("-");
    const timeParts = parts[1].split(":");
    const year = parseInt(dateParts[2], 10);
    const month = parseInt(dateParts[1], 10) - 1;
    const day = parseInt(dateParts[0], 10);
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
    const seconds = parseInt(timeParts[2], 10);

    return new Date(year, month, day, hours, minutes, seconds).getTime();
  };

  const languageSizes = {
    'aws-cli': '43.74 (MB)',
    'dotnet': '20.48 (MB)',
    'node': '46.49 (MB)',
    'go': '209.77 (MB)',
    'java': '89.10 (MB)',
    'python': '20.96 (MB)',
    'typescript': '52.37 (MB)',
    'kubectl': '16.53 (MB)',
    'ruby': '17.45 (MB)',
    'php': '9.57 (MB)',
    'wolfi-base': '5.82 (MB)',
  };

  const uniqueLanguages = [...new Set(data.map(item => getImageName(item.Image)))];

  return (
    <div className="flex flex-col items-center p-8 font-['Inter', sans-serif]">
      <div className="flex flex-wrap justify-center">
        {uniqueLanguages.map(language => (
          <button
            key={language}
            onClick={() => handleLanguageClick(language)}
            className={`m-2 px-4 py-2 uppercase font-[800] text-blue-500 border border-blue-500 rounded-[5.5rem] cursor-pointer ${selectedLanguage === language ? ' bg-blue-950 text-white' : ''}`}
          >
            {language}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap justify-center mt-[4rem] bg-[#fff] shadow-[0_8px_16px_rgba(52,67,244,.12)] rounded-md font-[700]">
        {selectedLanguage && (
          <div className="m-4 p-6 border rounded w-[100%] bg-[#fff]">
            <table className="table-auto bg-[#fff]">
              <thead>
                <tr>
                  <th className="px-4 py-2 ">CVEs</th>
                  <th className="px-4 py-2">Size</th>
                  <th className="px-4 py-2">Age (Hours)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2">{cveCount}</td>
                  <td className="border px-4 py-2">{languageSizes[selectedLanguage] || 'N/A'}</td>
                  <td className="border px-4 py-2">{ageInHours || 'N/A'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
