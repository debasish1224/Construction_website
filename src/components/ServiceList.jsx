import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import { db, storage } from '../firebase'; // Import Firestore and Storage from Firebase
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import necessary methods from Firebase Storage

const ServiceList = ({ serviceListUpdated, setServiceListUpdated }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editService, setEditService] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesCollection = collection(db, 'service');
        const servicesSnapshot = await getDocs(servicesCollection);
        const servicesList = servicesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setServices(servicesList);
      } catch (error) {
        setError("Error fetching services: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [serviceListUpdated]); // Trigger fetchServices whenever serviceListUpdated changes

  const handleEdit = (service) => {
    setEditService(service);
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
    }
  };

  const handleSave = async () => {
    try {
      let imageUrl = editService.imageUrl;

      if (newImage) {
        const storageRef = ref(storage, `images/${newImage.name}`);
        await uploadBytes(storageRef, newImage);
        imageUrl = await getDownloadURL(storageRef);
      }

      const serviceDoc = doc(db, 'service', editService.id);
      await updateDoc(serviceDoc, {
        title: editService.title,
        description: editService.description,
        imageUrl
      });

      setServices(services.map(service => service.id === editService.id ? { ...editService, imageUrl } : service));
      setShowModal(false);
      setNewImage(null);
      setAlert({ show: true, message: 'Service updated successfully!', variant: 'success' });
      // setServiceListUpdated(true); // Trigger service list update
    } catch (error) {
      console.error("Error updating service: ", error);
      setAlert({ show: true, message: 'Error updating service!', variant: 'danger' });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'service', id));
      setServices(services.filter(service => service.id !== id));
      setAlert({ show: true, message: 'Service deleted successfully!', variant: 'success' });
      // setServiceListUpdated(true); // Trigger service list update
    } catch (error) {
      console.error("Error deleting service: ", error);
      setAlert({ show: true, message: 'Error deleting service!', variant: 'danger' });
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
      <h3 className="text-center mb-4">Service Details</h3>
      {alert.show && <Alert variant={alert.variant} onClose={handleAlertClose} dismissible className="mt-3">
        {alert.message}
      </Alert>}
      <div className="table-responsive">
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map(service => (
              <tr key={service.id}>
                <td>{service.title}</td>
                <td>{`${service.description.substring(0, 40)}${service.description.length > 40 ? "..." : ""}`}</td>
                <td>
                  <img src={service.imageUrl} alt={service.title} style={{ width: '100px', height: '100px' }} />
                </td>
                <td>
                  <Button variant="primary" onClick={() => handleEdit(service)} className="mb-2 mr-2">Edit</Button>
                  <Button variant="danger" onClick={() => handleDelete(service.id)} className="mb-2">Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={editService?.title || ''}
                onChange={(e) => setEditService({ ...editService, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editService?.description || ''}
                onChange={(e) => setEditService({ ...editService, description: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                onChange={handleImageChange}
              />
              {editService?.imageUrl && (
                <img src={editService.imageUrl} alt="Current" style={{ marginTop: '10px', width: '100px', height: '100px' }} />
              )}
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

export default ServiceList;