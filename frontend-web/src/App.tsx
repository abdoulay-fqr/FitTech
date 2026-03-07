import React from 'react';
import logo from './logo.svg';
import './App.css';
import Button from './components/Button';

function App() {
  return (
    // Fond gris clair comme sur la photo
    <div >
      
      <Button 
  label="Contact Us" 
  variant="primary" 
  size="full"
  className="bg-[#1D2125] text-white hover:bg-black rounded-lg" 
/>
    </div>
  );
}

export default App;
