import React from 'react';
import { Container, Typography } from '@mui/material';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../Css/researchDevelopment.css'; // Custom CSS for Research and Development component

const ResearchDevelopment = () => {
  return (
    <div className="research-development-container">
      <Container className="my-5">
        <Typography variant="h2" className="text-center mb-4">Research and Development</Typography>
        <ul className="topic-list">
          <li>
            <Typography variant="h5" className="topic-title">Sustainable Construction</Typography>
            <Typography variant="body2" className="topic-text">
            Sustainable construction involves the use of eco-friendly materials and techniques to reduce environmental impact. It focuses on energy efficiency, waste reduction, and renewable resources. Embracing sustainable practices not only benefits the environment but also enhances building durability and occupant comfort.
            </Typography>
          </li>
          <li>
            <Typography variant="h5" className="topic-title">Innovative Materials</Typography>
            <Typography variant="body2" className="topic-text">
            Innovations in construction materials revolutionize the industry by introducing advanced composites, self-healing concrete, and biodegradable options. These materials improve structural integrity, reduce maintenance costs, and promote sustainable building practices. They play a crucial role in modernizing construction methods and achieving long-term durability.
            </Typography>
          </li>
          <li>
            <Typography variant="h5" className="topic-title">Smart Cities</Typography>
            <Typography variant="body2" className="topic-text">
            Smart cities integrate technology to enhance urban living through efficient resource management, enhanced mobility, and improved public services. From IoT-enabled infrastructure to data-driven decision-making, smart city initiatives aim to create safer, more sustainable urban environments. These innovations drive economic growth and improve quality of life for residents.
            </Typography>
          </li>
          <li>
            <Typography variant="h5" className="topic-title">Energy Efficiency</Typography>
            <Typography variant="body2" className="topic-text">
            Energy-efficient construction focuses on reducing energy consumption and carbon footprint. It involves using high-performance building materials, advanced insulation techniques, and renewable energy sources like solar and wind. By optimizing energy use, buildings can achieve lower operating costs, greater comfort, and contribute to global sustainability goals.
            </Typography>
          </li>
        </ul>
      </Container>
    </div>
  );
};

export default ResearchDevelopment;
