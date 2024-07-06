import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import Routes from react-router-dom
import 'bootstrap/dist/css/bootstrap.min.css';
import About from './components/about';
import Contact from './components/contact';
import Footer from './components/footer';
import Services from './components/services';
import Home from './components/home';
import Navbar from './components/navbar';
import Products from './components/products';
import ResearchDevelopment from './components/researchDevelopment';
import CareerPage from './components/careerPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <br></br><br></br>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/products" element={<Products />} /> 
          <Route path="/research-development" element={<ResearchDevelopment/>} />
          <Route path="/carrerPage" element={<CareerPage/>}/>
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
