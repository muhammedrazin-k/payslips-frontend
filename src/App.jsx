import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import EmployeeList from './pages/EmployeeList'
import PaySlip from './pages/PaySlip'
import AddEmployee from './pages/AddEmployee'
import Header from './components/Header'
import Emp from './pages/Emp'
import EditEmployee from './pages/EditEmployee'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <BrowserRouter>
          <Header />
          <Routes>

            <Route path='/' element={<EmployeeList />} />
            <Route path='/add' element={<AddEmployee />} />
            <Route path='/payslip' element={<PaySlip />} />
            <Route path='/employee/:id' element={<Emp />} />
            <Route path='/edit/:id' element={<EditEmployee />} />

          </Routes>

        </BrowserRouter>
      </div>
    </>
  )
}

export default App
