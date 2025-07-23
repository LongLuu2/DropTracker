import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Tool from './pages/Tool'; ;

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path ="/" element={<Home />} />
        <Route path ="/ownerTools" element ={<Tool/>} />
      </Routes>
    
    </BrowserRouter>

  )
}

export default App
