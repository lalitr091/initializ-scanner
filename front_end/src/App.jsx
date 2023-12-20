import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('go'); // Set "go" as the default language
  const [cveCount, setCveCount] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:8080/vulnerabilities')
      .then(response => {
        setData(response.data);
        setFilteredData(response.data);
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

    // Count the number of CVEs for the selected language
    const cveCountForLanguage = filteredByLanguage.filter(item => item.Message === 'Vulnerability found.').length;
    setCveCount(cveCountForLanguage);

    setFilteredData(filteredByLanguage);
    setSelectedLanguage(language);
  };

  const getImageName = (imageUrl) => {
    const parts = imageUrl.split("/");
    return parts[parts.length - 1];
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
            className={`m-2 px-4 py-2 uppercase text-blue-500 border border-blue-500 rounded-[5.5rem] cursor-pointer ${selectedLanguage === language ? ' bg-blue-950 text-white' : ''}`}
          >
            {language}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap justify-center mt-[4rem] bg-[#fff] shadow-[0_8px_16px_rgba(52,67,244,.12)] rounded-md">
        {selectedLanguage && (
          <div className="m-4 p-6 border rounded w-[100%] bg-[#fff]">
            <table className="table-auto bg-[#fff]">
              <thead>
                <tr>
                  <th className="px-4 py-2 ">CVEs</th>
                  <th className="px-4 py-2">Size</th>
                  <th className="px-4 py-2">Age</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2">{cveCount}</td>
                  <td className="border px-4 py-2">{languageSizes[selectedLanguage] || 'N/A'}</td>
                  <td className="border px-4 py-2">{new Date(Date.now() - 86400000 * 30).toDateString()}</td>
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
