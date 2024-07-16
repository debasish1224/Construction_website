import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Tabs, Tab } from 'react-bootstrap';
import JobOpeningCard from './JobOpeningCard';
import { db } from '../firebase'; // Import Firestore from Firebase
import { collection, getDocs } from 'firebase/firestore';

const CareerPage = () => {
  const [jobOpenings, setJobOpenings] = useState([]);
  const [skilledJobs, setSkilledJobs] = useState([]);
  const [nonSkilledJobs, setNonSkilledJobs] = useState([]);

  useEffect(() => {
    const fetchJobOpenings = async () => {
      const jobOpeningsCollection = collection(db, 'jobOpenings');
      const jobOpeningsSnapshot = await getDocs(jobOpeningsCollection);
      const jobOpeningsList = jobOpeningsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setJobOpenings(jobOpeningsList);

      // Filter jobs into skilled and non-skilled categories
      const skilledJobsList = jobOpeningsList.filter(job => job.skillLevel === 'skilled');
      const nonSkilledJobsList = jobOpeningsList.filter(job => job.skillLevel === 'non-skilled');
      setSkilledJobs(skilledJobsList);
      setNonSkilledJobs(nonSkilledJobsList);
    };

    fetchJobOpenings();
  }, []);

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">We are Hiring</h1>

      <Tabs defaultActiveKey="all" id="jobs-tabs" className="mb-4">
        <Tab eventKey="all" title={<span style={{ color: 'blue' }}>All Jobs</span>}>
          <Row>
            {jobOpenings.map(job => (
              <Col key={job.id} md={4} className="mb-4">
                <JobOpeningCard job={job} />
              </Col>
            ))}
          </Row>
        </Tab>
        <Tab eventKey="skilled" title={<span style={{ color: 'green' }}>Skilled Jobs</span>}>
          <Row>
            {skilledJobs.map(job => (
              <Col key={job.id} md={4} className="mb-4">
                <JobOpeningCard job={job} />
              </Col>
            ))}
          </Row>
        </Tab>
        <Tab eventKey="non-skilled" title={<span style={{ color: 'red' }}>Non-skilled Jobs</span>}>
          <Row>
            {nonSkilledJobs.map(job => (
              <Col key={job.id} md={4} className="mb-4">
                <JobOpeningCard job={job} />
              </Col>
            ))}
          </Row>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default CareerPage;



// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col } from 'react-bootstrap';
// import JobOpeningCard from './JobOpeningCard';
// import { db } from '../firebase'; // Import Firestore from Firebase
// import { collection, getDocs } from 'firebase/firestore';

// const CareerPage = () => {
//   const [jobOpenings, setJobOpenings] = useState([]);

//   useEffect(() => {
//     const fetchJobOpenings = async () => {
//       const jobOpeningsCollection = collection(db, 'jobOpenings');
//       const jobOpeningsSnapshot = await getDocs(jobOpeningsCollection);
//       const jobOpeningsList = jobOpeningsSnapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));
//       setJobOpenings(jobOpeningsList);
//     };

//     fetchJobOpenings();
//   }, []);

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