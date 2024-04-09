import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './global.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromChildren } from 'react-router-dom'
import { HomePage } from './components/index.ts'
import SensorsPage from './components/Pages/sensors.tsx'
import LogsPage from './components/Pages/logs.tsx'
import StatisticsPage from './components/Pages/statistics.tsx'

const router = createBrowserRouter(
  createRoutesFromChildren(
    <Route path="/" element={<App />} >
      <Route path="home" element={<HomePage />} />
      <Route path="device/:deviceId" element={<SensorsPage />} />
      <Route path="sensor/:sensorId" element={<LogsPage />} />
      <Route path='statistics/:sensorId' element={<StatisticsPage/>} />
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
