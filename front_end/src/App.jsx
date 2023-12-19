import { useState } from 'react'
import './App.css'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

function App() {
  const [count, setCount] = useState(0)

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
        <th class="py-2 px-4 border-b">Source</th>
        <th class="py-2 px-4 border-b">Namespace</th>
        <th class="py-2 px-4 border-b">Severity</th>
        <th class="py-2 px-4 border-b">Description</th>
        <th class="py-2 px-4 border-b">Fixes version</th>
        <th class="py-2 px-4 border-b">Fixes state</th>
        <th class="py-2 px-4 border-b">Message</th>
      </tr>
    </thead>
    <tbody>
      {/* <!--  table rows here --> */}
      <tr>
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
      </tr>
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
