import React, { useState } from 'react';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import { db, storage } from '../firebase'; // Import Firestore and Storage from Firebase
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const SkilledJobApplicationForm = ({ job, onClose }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [alert, setAlert] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate form fields
    if (!firstName || !lastName || !email || !phone || !address || !resumeFile) {
      setAlert('All fields are required');
      return;
    }

    setUploading(true); // Start uploading, set loading state

    try {
      // Upload resume file to Firebase Storage
      const storageRef = ref(storage, `resumes/${resumeFile.name}`);
      await uploadBytes(storageRef, resumeFile);
      const resumeUrl = await getDownloadURL(storageRef);

      // Add application data to Firestore
      const docRef = await addDoc(collection(db, 'applications'), {
        firstName,
        lastName,
        email,
        phone,
        address,
        resumeUrl,
        jobId: job.id,
        jobTitle: job.title,
        jobType: 'skilled',
      });

      console.log('Application submitted successfully with ID: ', docRef.id);
      setAlert('Application submitted successfully...');
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setResumeFile('');
      // onClose(); // Close modal after submission
    } catch (error) {
      console.error('Error submitting application: ', error);
      setAlert('Error submitting application');
    } finally {
      setUploading(false); // Upload complete, set loading state to false
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {alert && <Alert variant="danger">{alert}</Alert>}
      <Form.Group controlId="firstName">
        <Form.Label>First Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter your First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="lastName">
        <Form.Label>Last Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter your Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="email">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="phone">
        <Form.Label>Phone number</Form.Label>
        <Form.Control
          type="tel"
          placeholder="Enter your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="address">
        <Form.Label>Address</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter your Address detail"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="resume">
        <Form.Label>Upload Resume</Form.Label>
        <Form.Control
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          required
        />
      </Form.Group>

      <Button variant="primary" type="submit" className="d-block mx-auto mt-2" disabled={uploading}>
        {uploading ? (
          <Spinner animation="border" size="sm" role="status" aria-hidden="true" />
        ) : (
          'Submit Application'
        )}
      </Button>
    </Form>
  );
};

export default SkilledJobApplicationForm;




// import React, { useState } from 'react';
// import { Form, Button, Spinner, Alert } from 'react-bootstrap';
// import { db, storage } from '../firebase'; // Import Firestore and Storage from Firebase
// import { collection, addDoc } from 'firebase/firestore';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// const JobApplicationForm = ({ job, onClose }) => {
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [email, setEmail] = useState('');
//   const [phone, setPhone] = useState('');
//   const [address, setAddress] = useState('');
//   const [resumeFile, setResumeFile] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [alert, setAlert] = useState('');

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     // Validate form fields
//     if (!firstName || !lastName || !email || !phone || !address || !resumeFile) {
//       setAlert('All fields are required');
//       return;
//     }

//     setUploading(true); // Start uploading, set loading state

//     try {
//       // Upload resume file to Firebase Storage
//       const storageRef = ref(storage, `resumes/${resumeFile.name}`);
//       await uploadBytes(storageRef, resumeFile);
//       const resumeUrl = await getDownloadURL(storageRef);

//       // Add application data to Firestore
//       const docRef = await addDoc(collection(db, 'applications'), {
//         firstName,
//         lastName,
//         email,
//         phone,
//         address,
//         resumeUrl, // Store resume URL instead of file object
//         jobId: job.id,
//         jobTitle: job.title,
//       });

//       console.log('Application submitted successfully with ID: ', docRef.id);
//       setAlert('Application submitted successfully...');
//       setFirstName('');
//       setLastName('');
//       setEmail('');
//       setPhone('');
//       setAddress('');
//       setResumeFile('');
//       // onClose(); // Close modal after submission
//     } catch (error) {
//       console.error('Error submitting application: ', error);
//       setAlert('Error submitting application');
//     } finally {
//       setUploading(false); // Upload complete, set loading state to false
//     }
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setResumeFile(file);
//     }
//   };

//   return (
//     <Form onSubmit={handleSubmit}>
//       {alert && <Alert variant="danger">{alert}</Alert>}
//       <Form.Group controlId="firstName">
//         <Form.Label>First Name</Form.Label>
//         <Form.Control
//           type="text"
//           placeholder="Enter your First name"
//           value={firstName}
//           onChange={(e) => setFirstName(e.target.value)}
//           required
//         />
//       </Form.Group>

//       <Form.Group controlId="lastName">
//         <Form.Label>Last Name</Form.Label>
//         <Form.Control
//           type="text"
//           placeholder="Enter your Last name"
//           value={lastName}
//           onChange={(e) => setLastName(e.target.value)}
//           required
//         />
//       </Form.Group>

//       <Form.Group controlId="email">
//         <Form.Label>Email address</Form.Label>
//         <Form.Control
//           type="email"
//           placeholder="Enter your email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//       </Form.Group>

//       <Form.Group controlId="phone">
//         <Form.Label>Phone number</Form.Label>
//         <Form.Control
//           type="tel"
//           placeholder="Enter your phone number"
//           value={phone}
//           onChange={(e) => setPhone(e.target.value)}
//           required
//         />
//       </Form.Group>

//       <Form.Group controlId="address">
//         <Form.Label>Address</Form.Label>
//         <Form.Control
//           type="text"
//           placeholder="Enter your Address detail"
//           value={address}
//           onChange={(e) => setAddress(e.target.value)}
//           required
//         />
//       </Form.Group>

//       <Form.Group controlId="resume">
//         <Form.Label>Upload Resume</Form.Label>
//         <Form.Control
//           type="file"
//           accept=".pdf,.doc,.docx"
//           onChange={handleFileChange}
//           required
//         />
//       </Form.Group>

//       <Button variant="primary" type="submit" className="d-block mx-auto mt-2" disabled={uploading}>
//         {uploading ? (
//           <Spinner animation="border" size="sm" role="status" aria-hidden="true" />
//         ) : (
//           'Submit Application'
//         )}
//       </Button>
//     </Form>
//   );
// };

// export default JobApplicationForm;
