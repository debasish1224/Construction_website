import React, { useState } from 'react';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import JobList from './JobList';

const UploadJob = () => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('');
  const [salary, setSalary] = useState('');
  const [skillLevel, setSkillLevel] = useState('skilled');
  // const [alert, setAlert] = useState('');
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
  const [uploading, setUploading] = useState(false);

  const [jobListUpdated, setJobListUpdated] = useState(false);

  const handleAlertClose = () => {
    setAlert({ show: false, message: '', variant: '' });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title || !location || !experience || !salary || !skillLevel) {
      setAlert('All fields are required');
      return;
    }
    try {
      setUploading(true);
      await addDoc(collection(db, 'jobOpenings'), {
        title,
        location,
        experience,
        salary,
        skillLevel,
      });
      // setAlert('Job uploaded successfully!');
      setAlert({ show: true, message: 'Job uploaded successfully!', variant: 'success' });
      setTitle('');
      setLocation('');
      setExperience('');
      setSalary('');
      setSkillLevel('skilled');
      setJobListUpdated(true);
    } catch (error) {
      console.error("Error adding document: ", error);
      setAlert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Upload Job</h2>
      {alert.show && <Alert variant={alert.variant} onClose={handleAlertClose} dismissible className="mt-3">
        {alert.message}
      </Alert>}
      <Form onSubmit={handleUpload}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter job title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Location</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter job location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Experience</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter required experience"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Salary</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter salary"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Skill Level</Form.Label>
          <Form.Control
            as="select"
            value={skillLevel}
            onChange={(e) => setSkillLevel(e.target.value)}
          >
            <option value="skilled">Skilled</option>
            <option value="non-skilled">Non-skilled</option>
          </Form.Control>
        </Form.Group>

        <Button variant="primary" type="submit" disabled={uploading}>
          {uploading ? (
            <Spinner animation="border" size="sm" role="status" aria-hidden="true" />
          ) : (
            'Upload'
          )}
        </Button>
      </Form>

      {/* Display JobList component below the form */}
      <JobList jobListUpdated={jobListUpdated} setJobListUpdated={setJobListUpdated} />
    </Container>
  );
};

export default UploadJob;


// import React, { useState } from 'react';
// import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
// import { db } from '../firebase'; // Import Firestore from Firebase
// import { collection, addDoc } from 'firebase/firestore';
// import JobList from './JobList'; // Import JobList component

// const UploadJob = () => {
//   const [title, setTitle] = useState('');
//   const [location, setLocation] = useState('');
//   const [experience, setExperience] = useState('');
//   const [salary, setSalary] = useState('');
//   const [alert, setAlert] = useState('');
//   const [uploading, setUploading] = useState(false);


//   // State to trigger job list update
//   const [jobListUpdated, setJobListUpdated] = useState(false);

//   const handleUpload = async (e) => {
//     e.preventDefault();
//     if (!title || !location || !experience || !salary) {
//       setAlert('All fields are required');
//       return;
//     }
//     try {
//       setUploading(true);
//       await addDoc(collection(db, 'jobOpenings'), {
//         title,
//         location,
//         experience,
//         salary,
//       });
//       setAlert('Job uploaded successfully!');
//       setTitle('');
//       setLocation('');
//       setExperience('');
//       setSalary('');
//       setJobListUpdated(true); // Trigger job list update
//     } catch (error) {
//       console.error("Error adding document: ", error);
//       setAlert('Upload failed');
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <Container className="my-5">
//       <h2 className="text-center mb-4">Upload Job</h2>
//       {alert && <Alert variant="danger">{alert}</Alert>}
//       <Form onSubmit={handleUpload}>
//         <Form.Group className="mb-3">
//           <Form.Label>Title</Form.Label>
//           <Form.Control
//             type="text"
//             placeholder="Enter job title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//           />
//         </Form.Group>

//         <Form.Group className="mb-3">
//           <Form.Label>Location</Form.Label>
//           <Form.Control
//             type="text"
//             placeholder="Enter job location"
//             value={location}
//             onChange={(e) => setLocation(e.target.value)}
//           />
//         </Form.Group>

//         <Form.Group className="mb-3">
//           <Form.Label>Experience</Form.Label>
//           <Form.Control
//             type="text"
//             placeholder="Enter required experience"
//             value={experience}
//             onChange={(e) => setExperience(e.target.value)}
//           />
//         </Form.Group>

//         <Form.Group className="mb-3">
//           <Form.Label>Salary</Form.Label>
//           <Form.Control
//             type="text"
//             placeholder="Enter salary"
//             value={salary}
//             onChange={(e) => setSalary(e.target.value)}
//           />
//         </Form.Group>

//         <Button variant="primary" type="submit" disabled={uploading}>
//           {uploading ? (
//             <Spinner animation="border" size="sm" role="status" aria-hidden="true" />
//           ) : (
//             'Upload'
//           )}
//         </Button>
//       </Form>

//       {/* Display JobList component below the form */}
//       <JobList jobListUpdated={jobListUpdated} setJobListUpdated={setJobListUpdated} />
//     </Container>
//   );
// };

// export default UploadJob;