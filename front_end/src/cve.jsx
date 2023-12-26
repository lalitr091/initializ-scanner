import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [data, setData] = useState([]);
  const [uniqueLanguages, setUniqueLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("go");
  const [cveCount, setCveCount] = useState(0);
  const [othercve, setother] = useState(0);
  const [ageInHours, setAgeInHours] = useState(0);
  const [size, setSize] = useState('209.77 (MB)');

  useEffect(() => {
    axios.get('http://localhost:8080/vulnerabilities')
      .then(response => {
        const updatedData = response.data.map(item => {
          const firstImage = item.Images[0]; // Take the first image URL
          const second = item.Images[1]; // Take the second image URL
          return {
            ID: item.ID,
            Timestamp: parseTimestamp(item.Timestamp),
            Image: getImageName(firstImage.Image),
            VulnerabilityCount: firstImage.VulnerabilityCount,
            VulnerabilityCount1: second.VulnerabilityCount,
            Size: languageSizes[getImageName(firstImage.Image)] || '',
          };
        });

        setData(updatedData);
        setUniqueLanguages([...new Set(updatedData.map(item => item.Image))]);
              const defaultLanguageData = updatedData.find(item => item.Image.toLowerCase() === 'go');

      // Set the default values based on the data for the default language
      setSelectedLanguage(defaultLanguageData.Image);
      setCveCount(defaultLanguageData.VulnerabilityCount);
      setother(defaultLanguageData.VulnerabilityCount1);
      setSize(defaultLanguageData.Size);
      setAgeInHours(calculateAgeForLanguage([defaultLanguageData]));
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
       
  }, []);

  const handleLanguageClick = (language) => {
    const filteredByLanguage = data.filter(item => item.Image.toLowerCase() === language.toLowerCase());

    const cveCountForLanguage = filteredByLanguage.length > 0 ? filteredByLanguage[0].VulnerabilityCount : 0;
    const cveCountForLanguage1 = filteredByLanguage.length > 0 ? filteredByLanguage[0].VulnerabilityCount1 : 0;
    const sizeForLanguage = filteredByLanguage.length > 0 ? filteredByLanguage[0].Size : '';
    setCveCount(cveCountForLanguage);
    setother(cveCountForLanguage1);
    setSize(sizeForLanguage);

    const ageInHoursForLanguage = calculateAgeForLanguage(filteredByLanguage);
    setAgeInHours(ageInHoursForLanguage);

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
    const [day, month, year, hours, minutes, seconds] = timestamp.split(/[\s-:]+/);
    return new Date(year, month - 1, day, hours, minutes, seconds).getTime();
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

  return (
    <div className="flex flex-col items-center p-8 font-['Inter', sans-serif]">
      <div className="flex flex-wrap justify-center uppercase">
        {uniqueLanguages.map(language => (
          <button
            key={language}
            onClick={() => handleLanguageClick(language)}
            className={`uppercase m-2 p-2 rounded-full cursor-pointer ${selectedLanguage === language ? ' bg-blue-950 text-white' : 'bg-blue-500 text-white'}`}
          >
            <h1>{language}</h1>
          </button>
        ))}
      </div>

      <div className=" w-1/2 py-11 flex flex-wrap justify-center mt-[4rem] bg-[#fff] shadow-[0_8px_16px_rgba(52,67,244,.12)] rounded-md font-[900]">
        {selectedLanguage && (
          <div>
          <h1 className=' font-[20px]'> Initializ Images</h1>
            <div className="m-4 p-6 border rounded w-[100%] bg-[#fff]">
              <table className="table-auto bg-[#fff]">
                <thead>
                  <tr>
                    <th className="px-4 py-2 ">CVEs</th>
                    <th className="px-4 py-2">Age (Hours)</th>
                    <th className="px-4 py-2">Size</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-4 py-2">{cveCount}</td>
                    <td className="border px-4 py-2">{ageInHours}</td>
                    <td className="border px-4 py-2">{size}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <h1 className=' capitalize'>{selectedLanguage}</h1>
            <div className="m-4 p-6 border rounded w-[100%] bg-[#fff]">
              <table className="table-auto bg-[#fff] capitalize">
                <thead>
                  <tr>
                    <th className="px-4 py-2 ">CVEs</th>
                    <th className="px-4 py-2">Age (Hours)</th>
                    <th className="px-4 py-2">Size</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-4 py-2">{othercve}</td>
                    <td className="border px-4 py-2">{ageInHours}</td>
                    <td className="border px-4 py-2">{size}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
