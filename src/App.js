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
import Admin from './components/Admin';
import { auth } from './firebase'; // Import auth from your Firebase configuration
import UploadJob from './components/UploadJob';
import UploadService from './components/UploadService';
import UploadProduct from './components/UploadProduct';
import UploadGallery from './components/UploadGallery';
import UploadResearchDevelopment from './components/UploadResearchDevelopment';
import DetailPage from './components/DetailPage';
import DetailPage2 from './components/DetailPage2';
import ViewBlog from './components/ViewBlog';
import UploadAboutImage from './components/UploadAboutImage';


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
          <Route path="/product/:id/subproduct/:subid" element={<DetailPage />} />
          <Route path="/service/:id/subservice/:subid" element={<DetailPage2 />} />
          <Route path="/research-development" element={<ResearchDevelopment/>} />
          <Route path="/viewBlog" element={<ViewBlog />} />
          <Route path="/carrerPage" element={<CareerPage/>}/>
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/upload-job" element={<UploadJob />} />
          <Route path="/upload-service" element={<UploadService />} />
          <Route path="/upload-product" element={<UploadProduct />} />
          <Route path="/upload-gallery" element={<UploadGallery />} />
          <Route path="/upload-research-development" element={<UploadResearchDevelopment />} />
          <Route path="/upload-aboutImage" element={<UploadAboutImage />} />
        </Routes>
        <Footer auth={auth} />
      </div>
    </Router>
  );
}

export default App;