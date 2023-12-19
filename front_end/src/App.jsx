import { useState, useEffect } from 'react'
import './App.css'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from 'axios';

function App() {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0)

  useEffect(() => {
    axios.get('http://localhost:8080/vulnerabilities')
      .then(response => {
        setData(response.data);
        // console.log(response);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);
console.log(data.length)
let verdata=[]

for(let  i =0;i<data.length;i++)
{
  const imageUrl = data[i].Image;
  const parts = imageUrl.split("/"); // Split the string by '/'
  const imageName = parts[parts.length - 1];
  
  if(data[i].Message === "No vulnerabilities found.")
  {
    verdata.push({
      "ID":data[i].Message,
      "DataSource":data[i].Message,
      "Namespace":data[i].Message,
      "Severity":data[i].Message,
      "Fix": data[i].Message,
      "State":data[i].Message,
      "Language":imageName,
      "message":data[i].Message,
      "Source":""
    
    
    })

  }
  if(data[i].Message === "Vulnerability found.")
  {
    verdata.push({
      "ID":data[i].Vulnerability.ID,
      "DataSource":data[i].Vulnerability.DataSource,
      "Namespace":data[i].Vulnerability.Namespace,
      "Severity":data[i].Vulnerability.Severity,
      "Fix": data[i].Vulnerability.Fix.Versions,
      "State":data[i].Vulnerability.Fix.State,
      "Language":imageName,
      "message":data[i].Message,
      "Source":""
    
    
    })

  }
    
  
  
  
//  console.log(data[i])


  
}
  return (
    
    <>
     <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker label="Basic date picker" />
      </DemoContainer>
    </LocalizationProvider>
    <div class="container mx-auto mt-8">
  <table class="min-w-full bg-white border border-gray-300">
    <thead>
      <tr>
        <th class="py-2 px-4 border-b">CVE id</th>
        <th class="py-2 px-4 border-b">Language</th>
        <th class="py-2 px-4 border-b">Data source</th>
        {/* <th class="py-2 px-4 border-b">Source</th> */}
        <th class="py-2 px-4 border-b">Namespace</th>
        <th class="py-2 px-4 border-b">Severity</th>
        <th class="py-2 px-4 border-b">Fixes version</th>
        <th class="py-2 px-4 border-b">Fixes state</th>
        <th class="py-2 px-4 border-b">Message</th>
      </tr>
    </thead>
    <tbody>
      {/* <!--  table rows here --> */}
      {/* <tr>
        <td class="py-2 px-4 border-b">CVE-2023-1234</td>
        <td class="py-2 px-4 border-b">JavaScript</td>
        <td class="py-2 px-4 border-b">Internal</td>
        <td class="py-2 px-4 border-b">GitHub</td>
        <td class="py-2 px-4 border-b">AppNamespace</td>
        <td class="py-2 px-4 border-b">High</td>
        <td class="py-2 px-4 border-b">Security vulnerability description goes here.</td>
        <td class="py-2 px-4 border-b">v1.2.3</td>
        <td class="py-2 px-4 border-b">Fixed</td>
        <td class="py-2 px-4 border-b">Please update to the latest version.</td>
      </tr> */}
      {verdata.map(item => (
              // <tr key={item.id}>
              //   <td className="py-2 px-4 border-b">{item.CVEid}</td>
              //   <td className="py-2 px-4 border-b">{item.Language}</td>
              //   <td className="py-2 px-4 border-b">{item.DataSource}</td>
              //   <td className="py-2 px-4 border-b">{item.Source}</td>
              //   <td className="py-2 px-4 border-b">{item.Namespace}</td>
              //   <td className="py-2 px-4 border-b">{item.Severity}</td>
              //   <td className="py-2 px-4 border-b">{item.Description}</td>
              //   <td className="py-2 px-4 border-b">{item.FixesVersion}</td>
              //   <td className="py-2 px-4 border-b">{item.FixesState}</td>
              //   <td className="py-2 px-4 border-b">{item.Message}</td>
              // </tr>
               <tr key={item.ID}>
               <td className="py-2 px-4 border-b">{item.ID || 'N/A'}</td>
               <td className="py-2 px-4 border-b">{item.Language || 'N/A'}</td>
               <td className="py-2 px-4 border-b">{item.DataSource || 'N/A'}</td>
                 {/* <td className="py-2 px-4 border-b">{item.Source || 'N/A'}</td> */}
               <td className="py-2 px-4 border-b">{item.Namespace || 'N/A'}</td>
               <td className="py-2 px-4 border-b">{item.Severity || 'N/A'}</td>
                 <td className="py-2 px-4 border-b">{item.Fix|| 'N/A'}</td>
                 <td className="py-2 px-4 border-b">{item.State|| 'N/A'}</td>
                 <td className="py-2 px-4 border-b">{item.message|| 'N/A'}</td>
              
            
               {/* Add more cells as needed based on your data structure */}
             </tr>
            ))}
      
      {/* <!-- rows as needed --> */}
    </tbody>
  </table>
  <div class="flex justify-end mt-4">
    <nav class="flex items-center">
      <a href="#" class="py-2 px-4 bg-gray-300 mr-2 rounded">1</a>
      <a href="#" class="py-2 px-4 hover:bg-gray-300 mr-2 rounded">2</a>
      {/* <!-- Add more pages as needed --> */}
    </nav>
  </div>
</div>

    </>
  )
}

export default App
