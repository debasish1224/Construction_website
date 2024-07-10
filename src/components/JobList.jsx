import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const JobList = ({ jobListUpdated, setJobListUpdated }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editJob, setEditJob] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobsCollection = collection(db, 'jobOpenings');
        const jobsSnapshot = await getDocs(jobsCollection);
        const jobsList = jobsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setJobs(jobsList);
      } catch (error) {
        setError("Error fetching jobs: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [jobListUpdated]); // Trigger fetchJobs whenever jobListUpdated changes

  const handleEdit = (job) => {
    setEditJob(job);
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      const jobDoc = doc(db, 'jobOpenings', editJob.id);
      await updateDoc(jobDoc, {
        title: editJob.title,
        location: editJob.location,
        experience: editJob.experience,
        salary: editJob.salary
      });

      setJobs(jobs.map(job => job.id === editJob.id ? editJob : job));
      setShowModal(false);
      setAlert({ show: true, message: 'Job updated successfully!', variant: 'success' });
    } catch (error) {
      console.error("Error updating job: ", error);
      setAlert({ show: true, message: 'Error updating job!', variant: 'danger' });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'jobOpenings', id));
      setJobs(jobs.filter(job => job.id !== id));
      setAlert({ show: true, message: 'Job deleted successfully!', variant: 'success' });
    } catch (error) {
      console.error("Error deleting job: ", error);
      setAlert({ show: true, message: 'Error deleting job!', variant: 'danger' });
    }
  };

  const handleAlertClose = () => {
    setAlert({ show: false, message: '', variant: '' });
  };

  if (loading) {
    return <Spinner animation="border" className="mt-5" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Container className="my-5">
      <h3 className="text-center mb-4">Job Openings</h3>
      {alert.show && <Alert variant={alert.variant} onClose={handleAlertClose} dismissible className="mt-3">
        {alert.message}
      </Alert>}
      <div className="table-responsive">
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Title</th>
              <th>Location</th>
              <th>Experience</th>
              <th>Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(job => (
              <tr key={job.id}>
                <td>{job.title}</td>
                <td>{job.location}</td>
                <td>{job.experience}</td>
                <td>{job.salary}</td>
                <td>
                  <Button variant="primary" onClick={() => handleEdit(job)} className="mb-2 mr-2">Edit</Button>
                  <Button variant="danger" onClick={() => handleDelete(job.id)} className="mb-2">Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Job</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={editJob?.title || ''}
                onChange={(e) => setEditJob({ ...editJob, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                value={editJob?.location || ''}
                onChange={(e) => setEditJob({ ...editJob, location: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Experience</Form.Label>
              <Form.Control
                type="text"
                value={editJob?.experience || ''}
                onChange={(e) => setEditJob({ ...editJob, experience: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Salary</Form.Label>
              <Form.Control
                type="text"
                value={editJob?.salary || ''}
                onChange={(e) => setEditJob({ ...editJob, salary: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleSave}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default JobList;