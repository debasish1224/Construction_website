import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import JobOpeningCard from './JobOpeningCard';
import { db } from '../firebase'; // Import Firestore from Firebase
import { collection, getDocs } from 'firebase/firestore';

const CareerPage = () => {
  const [jobOpenings, setJobOpenings] = useState([]);

  useEffect(() => {
    const fetchJobOpenings = async () => {
      const jobOpeningsCollection = collection(db, 'jobOpenings');
      const jobOpeningsSnapshot = await getDocs(jobOpeningsCollection);
      const jobOpeningsList = jobOpeningsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setJobOpenings(jobOpeningsList);
    };

    fetchJobOpenings();
  }, []);

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">Job Openings</h1>
      <Row>
        {jobOpenings.map(job => (
          <Col key={job.id} md={4} className="mb-4">
            <JobOpeningCard job={job} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default CareerPage;

// import React from 'react';
// import { Container, Row, Col } from 'react-bootstrap';
// import JobOpeningCard from './JobOpeningCard';

// const CareerPage = () => {
//   // Sample job openings data
//   const jobOpenings = [
//     {
//       id: 1,
//       title: 'Construction Project Manager',
//       location: 'Dhanbad, India',
//       experience: 'Experience - 2 years',
//       salary : '3 lakh per annum'
//     },
//     {
//       id: 2,
//       title: 'Civil Engineer',
//       location: 'Jamshedpur, India',
//       experience: 'Experience - 2 years',
//       salary : '3 lakh per annum'
//     },
//     {
//       id: 3,
//       title: 'Architectural Designer',
//       location: 'Ranchi, India',
//       experience: 'Experience - Fresher',
//       salary : '3 lakh per annum'
//     },
//     {
//       id: 4,
//       title: 'Construction Estimator',
//       location: 'Hazaribagh, India',
//       experience: 'Experience - Fresher',
//       salary : '3 lakh per annum'
//     },
//     {
//       id: 5,
//       title: 'Electrical Foreman',
//       location: 'Dumka, India',
//       experience: 'Experience - Fresher',
//       salary : '3 lakh per annum'
//     },
//   ];

//   return (
//     <Container className="my-5">
//       <h1 className="text-center mb-4">Job Openings</h1>
//       <Row>
//         {jobOpenings.map(job => (
//           <Col key={job.id} md={4} className="mb-4">
//             <JobOpeningCard job={job} />
//           </Col>
//         ))}
//       </Row>
//     </Container>
//   );
// };

// export default CareerPage;