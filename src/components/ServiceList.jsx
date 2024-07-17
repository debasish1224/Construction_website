import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import { db, storage } from '../firebase'; // Import Firestore and Storage from Firebase
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const ServiceList = ({ serviceListUpdated, setServiceListUpdated }) => {
  const [services, setServices] = useState([]);
  const [subservices, setSubservices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editService, setEditService] = useState(null);
  const [editSubservice, setEditSubservice] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [newSubImage, setNewSubImage] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const servicesCollection = collection(db, 'services');
        const servicesSnapshot = await getDocs(servicesCollection);
        const servicesList = servicesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setServices(servicesList);
        setLoading(false);
      } catch (error) {
        setError("Error fetching services: " + error.message);
        setLoading(false);
      }
    };

    const fetchSubservices = async () => {
      try {
        const subservicesMap = {};
        const servicesCollection = collection(db, 'services');
        const servicesSnapshot = await getDocs(servicesCollection);

        for (const doc of servicesSnapshot.docs) {
          const serviceId = doc.id;
          const subservicesCollection = collection(db, `services/${serviceId}/subservices`);
          const subservicesSnapshot = await getDocs(subservicesCollection);
          subservicesMap[serviceId] = subservicesSnapshot.docs.map(subdoc => ({
            id: subdoc.id,
            ...subdoc.data()
          }));
        }

        setSubservices(subservicesMap);
      } catch (error) {
        setError("Error fetching subservices: " + error.message);
      }
    };

    fetchServices();
    fetchSubservices();
  }, [serviceListUpdated]);

  const handleEditService = (service) => {
    setEditService(service);
    setShowModal(true);
  };

  const handleEditSubservice = (subservice, serviceId) => {
    setEditSubservice({ ...subservice, serviceId });
    setShowSubModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
    }
  };

  const handleSubImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewSubImage(file);
    }
  };

  const handleSave = async () => {
    try {
      let imageUrl = editService.imageUrl;

      if (newImage) {
        const storageRef = ref(storage, `services/${newImage.name}`);
        await uploadBytes(storageRef, newImage);
        imageUrl = await getDownloadURL(storageRef);
      }

      const serviceDoc = doc(db, 'services', editService.id);
      await updateDoc(serviceDoc, {
        title: editService.title,
        description: editService.description,
        imageUrl
      });

      setServices(services.map(service => service.id === editService.id ? { ...editService, imageUrl } : service));
      setShowModal(false);
      setNewImage(null);
      setAlert({ show: true, message: 'Service updated successfully!', variant: 'success' });
      setServiceListUpdated(true); // Trigger service list update
    } catch (error) {
      console.error("Error updating service: ", error);
      setAlert({ show: true, message: 'Error updating service!', variant: 'danger' });
    }
  };

  const handleSubSave = async () => {
    try {
      let subImageUrl = editSubservice.imageUrl;

      if (newSubImage) {
        const storageRef = ref(storage, `services/${editSubservice.serviceId}/subservices/${newSubImage.name}`);
        await uploadBytes(storageRef, newSubImage);
        subImageUrl = await getDownloadURL(storageRef);
      }

      const subserviceDoc = doc(db, `services/${editSubservice.serviceId}/subservices`, editSubservice.id);
      await updateDoc(subserviceDoc, {
        title: editSubservice.title,
        description: editSubservice.description,
        imageUrl: subImageUrl
      });

      const updatedSubservices = {
        ...subservices,
        [editSubservice.serviceId]: subservices[editSubservice.serviceId].map(subservice =>
          subservice.id === editSubservice.id ? { ...editSubservice, imageUrl: subImageUrl } : subservice
        )
      };

      setSubservices(updatedSubservices);
      setShowSubModal(false);
      setNewSubImage(null);
      setAlert({ show: true, message: 'Subservice updated successfully!', variant: 'success' });
      setServiceListUpdated(true); // Trigger service list update
    } catch (error) {
      console.error("Error updating subservice: ", error);
      setAlert({ show: true, message: 'Error updating subservice!', variant: 'danger' });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'services', id));
      setServices(services.filter(service => service.id !== id));
      setAlert({ show: true, message: 'Service deleted successfully!', variant: 'success' });
      setServiceListUpdated(true); // Trigger service list update
    } catch (error) {
      console.error("Error deleting service: ", error);
      setAlert({ show: true, message: 'Error deleting service!', variant: 'danger' });
    }
  };

  const handleSubDelete = async (serviceId, subserviceId) => {
    try {
      await deleteDoc(doc(db, `services/${serviceId}/subservices`, subserviceId));
      const updatedSubservices = {
        ...subservices,
        [serviceId]: subservices[serviceId].filter(subservice => subservice.id !== subserviceId)
      };
      setSubservices(updatedSubservices);
      setAlert({ show: true, message: 'Subservice deleted successfully!', variant: 'success' });
      setServiceListUpdated(true); // Trigger service list update
    } catch (error) {
      console.error("Error deleting subservice: ", error);
      setAlert({ show: true, message: 'Error deleting subservice!', variant: 'danger' });
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
              <React.Fragment key={service.id}>
                <tr>
                  <td>{service.title}</td>
                  <td>{service.description}</td>
                  <td>
                    <img src={service.imageUrl} alt={service.title} style={{ width: '100px', height: '100px' }} />
                  </td>
                  <td>
                    <Button variant="primary" onClick={() => handleEditService(service)} className="mb-2 mr-2">Edit</Button>
                    <Button variant="danger" onClick={() => handleDelete(service.id)} className="mb-2">Delete</Button>
                  </td>
                </tr>
                {subservices[service.id] && subservices[service.id].map(subservice => (
                  <tr key={subservice.id}>
                    <td  style={{ paddingLeft: '40px' }}>{subservice.title}</td>
                    <td>{`${subservice.description.substring(0, 40)}${subservice.description.length > 40 ? "..." : ""}`}</td>
                    <td>
                      <img src={subservice.imageUrl} alt={subservice.title} style={{ width: '100px', height: '100px' }} />
                    </td>
                    <td>
                      <Button variant="primary" onClick={() => handleEditSubservice(subservice, service.id)} className="mb-2 mr-2">Edit</Button>
                      <Button variant="danger" onClick={() => handleSubDelete(service.id, subservice.id)} className="mb-2">Delete</Button>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
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

      <Modal show={showSubModal} onHide={() => setShowSubModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Subservice</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={editSubservice?.title || ''}
                onChange={(e) => setEditSubservice({ ...editSubservice, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editSubservice?.description || ''}
                onChange={(e) => setEditSubservice({ ...editSubservice, description: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                onChange={handleSubImageChange}
              />
              {editSubservice?.imageUrl && (
                <img src={editSubservice.imageUrl} alt="Current" style={{ marginTop: '10px', width: '100px', height: '100px' }} />
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSubModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleSubSave}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ServiceList;