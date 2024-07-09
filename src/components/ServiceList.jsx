import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase'; // Import storage from firebase
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import necessary methods from firebase storage
import { Container, Table, Spinner, Alert, Button, Form, Modal } from 'react-bootstrap';

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editService, setEditService] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newImage, setNewImage] = useState(null);

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
  }, []);

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
    } catch (error) {
      console.error("Error updating service: ", error);
    }
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Container>
      <h3>Service Details</h3>
      <Table striped bordered hover>
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
              <td>{service.description}</td>
              <td>
                <img src={service.imageUrl} alt={service.title} style={{ width: '100px', height: '100px' }} />
              </td>
              <td>
                <Button variant="primary" onClick={() => handleEdit(service)}>Edit</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

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



// import React, { useState, useEffect } from 'react';
// import { db } from '../firebase';
// import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
// import { Container, Table, Spinner, Alert, Button, Form, Modal } from 'react-bootstrap';

// const ServiceList = () => {
//   const [services, setServices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editService, setEditService] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     const fetchServices = async () => {
//       try {
//         const servicesCollection = collection(db, 'service');
//         const servicesSnapshot = await getDocs(servicesCollection);
//         const servicesList = servicesSnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data()
//         }));
//         setServices(servicesList);
//       } catch (error) {
//         setError("Error fetching services: " + error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchServices();
//   }, []);

//   const handleEdit = (service) => {
//     setEditService(service);
//     setShowModal(true);
//   };

//   const handleSave = async () => {
//     try {
//       const serviceDoc = doc(db, 'service', editService.id);
//       await updateDoc(serviceDoc, {
//         title: editService.title,
//         description: editService.description
//       });
//       setServices(services.map(service => service.id === editService.id ? editService : service));
//       setShowModal(false);
//     } catch (error) {
//       console.error("Error updating service: ", error);
//     }
//   };

//   if (loading) {
//     return <Spinner animation="border" />;
//   }

//   if (error) {
//     return <Alert variant="danger">{error}</Alert>;
//   }

//   return (
//     <Container>
//       <h3>Service Details</h3>
//       <Table striped bordered hover>
//         <thead>
//           <tr>
//             <th>Title</th>
//             <th>Description</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {services.map(service => (
//             <tr key={service.id}>
//               <td>{service.title}</td>
//               <td>{service.description}</td>
//               <td>
//                 <Button variant="primary" onClick={() => handleEdit(service)}>Edit</Button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>

//       <Modal show={showModal} onHide={() => setShowModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Edit Service</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group>
//               <Form.Label>Title</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={editService?.title || ''}
//                 onChange={(e) => setEditService({ ...editService, title: e.target.value })}
//               />
//             </Form.Group>
//             <Form.Group>
//               <Form.Label>Description</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={3}
//                 value={editService?.description || ''}
//                 onChange={(e) => setEditService({ ...editService, description: e.target.value })}
//               />
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
//           <Button variant="primary" onClick={handleSave}>Save Changes</Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// };

// export default ServiceList;