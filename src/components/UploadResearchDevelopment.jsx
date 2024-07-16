import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Table, Modal } from 'react-bootstrap';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase'; // Import Firestore and Storage instances from Firebase
import '../Css/UploadResearchDevelopment.css'; // Custom CSS for UploadResearchDevelopment component

const UploadResearchDevelopment = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [author, setAuthor] = useState('');
    const [date, setDate] = useState('');
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [uploading, setUploading] = useState(false);
    const [topics, setTopics] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editTopicId, setEditTopicId] = useState('');
    const [editImageUrl, setEditImageUrl] = useState('');
    const [newEditImage, setNewEditImage] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTopicId, setDeleteTopicId] = useState('');

    useEffect(() => {
        fetchTopics();
    }, []);

    const fetchTopics = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'researchDevelopmentTopics'));
            const topicsArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTopics(topicsArray);
        } catch (error) {
            console.error('Error fetching topics:', error);
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleNewEditImageChange = (e) => {
        if (e.target.files[0]) {
            setNewEditImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setUploading(true);

            // Upload image to Firebase Storage
            const storageRef = ref(storage, `researchDevelopmentImages/${image.name}`);
            await uploadBytes(storageRef, image);

            // Get the uploaded image URL
            const downloadURL = await getDownloadURL(storageRef);
            setImageUrl(downloadURL);

            // Add data to Firestore
            await addDoc(collection(db, 'researchDevelopmentTopics'), {
                title,
                description,
                author,
                date,
                imageUrl: downloadURL, // Store the image URL in Firestore
            });

            // Reset form fields
            setTitle('');
            setDescription('');
            setAuthor('');
            setDate('');
            setImage(null);
            setImageUrl('');

            // Refresh topics list
            fetchTopics();

            // Handle success or navigate to a different page
            console.log('Research and Development topic uploaded successfully!');
        } catch (error) {
            console.error('Error uploading research development topic:', error);
            // Handle error
        } finally {
            setUploading(false);
        }
    };

    const handleEditModalOpen = (topic) => {
        setEditTopicId(topic.id);
        setEditTitle(topic.title);
        setEditDescription(topic.description);
        setEditImageUrl(topic.imageUrl);
        setNewEditImage(null); // Reset the new image state
        setShowEditModal(true);
    };

    const handleEditModalClose = () => {
        setShowEditModal(false);
        setEditTopicId('');
        setEditTitle('');
        setEditDescription('');
        setEditImageUrl('');
        setNewEditImage(null);
    };

    const handleEditSubmit = async () => {
        try {
            let finalImageUrl = editImageUrl;

            if (newEditImage) {
                // Upload new image to Firebase Storage
                const storageRef = ref(storage, `researchDevelopmentImages/${newEditImage.name}`);
                await uploadBytes(storageRef, newEditImage);
                finalImageUrl = await getDownloadURL(storageRef);
            }

            // Update topic in Firestore
            const topicRef = doc(db, 'researchDevelopmentTopics', editTopicId);
            await updateDoc(topicRef, {
                title: editTitle,
                description: editDescription,
                imageUrl: finalImageUrl,
            });

            // Close modal and refresh topics list
            handleEditModalClose();
            fetchTopics();
        } catch (error) {
            console.error('Error updating topic:', error);
            // Handle error
        }
    };

    const handleDeleteModalOpen = (topicId) => {
        setDeleteTopicId(topicId);
        setShowDeleteModal(true);
    };

    const handleDeleteModalClose = () => {
        setShowDeleteModal(false);
        setDeleteTopicId('');
    };

    const handleDeleteTopic = async () => {
        try {
            // Delete topic from Firestore
            await deleteDoc(doc(db, 'researchDevelopmentTopics', deleteTopicId));

            // Close modal and refresh topics list
            handleDeleteModalClose();
            fetchTopics();
        } catch (error) {
            console.error('Error deleting topic:', error);
            // Handle error
        }
    };

    return (
        <Container className="upload-research-development">
            <h2 className="text-center mb-4">Upload Research Development Topic</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="title">
                    <Form.Label>Title</Form.Label>
                    <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </Form.Group>

                <Form.Group controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" rows={5} value={description} onChange={(e) => setDescription(e.target.value)} required />
                </Form.Group>

                <Form.Group controlId="author">
                    <Form.Label>Author</Form.Label>
                    <Form.Control type="text" value={author} onChange={(e) => setAuthor(e.target.value)} required />
                </Form.Group>

                <Form.Group controlId="date">
                    <Form.Label>Date</Form.Label>
                    <Form.Control type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                </Form.Group>

                <Form.Group controlId="image">
                    <Form.Label>Image</Form.Label>
                    <Form.Control type="file" onChange={handleImageChange} required />
                </Form.Group>

                <Button variant="primary" type="submit" className='mt-2' disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Upload'}
                </Button>
            </Form>

            <hr />

            <h2 className="text-center mb-4">All Research Development Topics</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {topics.map(topic => (
                        <tr key={topic.id}>
                            <td>{topic.title}</td>
                            <td>{topic.author}</td>
                            <td>{topic.date}</td>
                            <td>
                                <Button variant="info" className="mb-2 mr-2" onClick={() => handleEditModalOpen(topic)}>Edit</Button>
                                <Button variant="danger" className='mb-2' onClick={() => handleDeleteModalOpen(topic.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Edit Modal */}
            <Modal show={showEditModal} onHide={handleEditModalClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Research Development Topic</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="editTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} required />
                    </Form.Group>

                    <Form.Group controlId="editDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows={5} value={editDescription} onChange={(e) => setEditDescription(e.target.value)} required />
                    </Form.Group>

                    <Form.Group controlId="editImageUrl">
                    <Form.Label>Current Image</Form.Label>
                    <Form.Control type="file" onChange={handleNewEditImageChange} />
                        <img src={editImageUrl} alt="Current" style={{ marginTop: '10px', width: '100px', height: '100px' }}/>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleEditModalClose}>Close</Button>
                    <Button variant="primary" onClick={handleEditSubmit}>Save Changes</Button>
                </Modal.Footer>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={handleDeleteModalClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this topic?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleDeleteModalClose}>Cancel</Button>
                    <Button variant="danger" onClick={handleDeleteTopic}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default UploadResearchDevelopment;


// import React, { useState, useEffect } from 'react';
// import { Container, Form, Button, Table, Modal } from 'react-bootstrap';
// import { collection, addDoc, getDocs, doc, deleteDoc } from 'firebase/firestore';
// import { ref, uploadBytes,getDownloadURL } from 'firebase/storage';
// import { db, storage } from '../firebase'; // Import Firestore and Storage instances from Firebase
// import '../Css/UploadResearchDevelopment.css'; // Custom CSS for UploadResearchDevelopment component

// const UploadResearchDevelopment = () => {
//     const [title, setTitle] = useState('');
//     const [description, setDescription] = useState('');
//     const [author, setAuthor] = useState('');
//     const [date, setDate] = useState('');
//     const [image, setImage] = useState(null);
//     const [imageUrl, setImageUrl] = useState('');
//     const [uploading, setUploading] = useState(false);
//     const [topics, setTopics] = useState([]);
//     const [showEditModal, setShowEditModal] = useState(false);
//     const [editTitle, setEditTitle] = useState('');
//     const [editDescription, setEditDescription] = useState('');
//     const [editTopicId, setEditTopicId] = useState('');
//     const [editImageUrl, setEditImageUrl] = useState('');
//     const [showDeleteModal, setShowDeleteModal] = useState(false);
//     const [deleteTopicId, setDeleteTopicId] = useState('');

//     useEffect(() => {
//         fetchTopics();
//     }, []);

//     const fetchTopics = async () => {
//         try {
//             const querySnapshot = await getDocs(collection(db, 'researchDevelopmentTopics'));
//             const topicsArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//             setTopics(topicsArray);
//         } catch (error) {
//             console.error('Error fetching topics:', error);
//         }
//     };

//     const handleImageChange = (e) => {
//         if (e.target.files[0]) {
//             setImage(e.target.files[0]);
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
    
//         try {
//             setUploading(true);
    
//             // Upload image to Firebase Storage
//             const storageRef = ref(storage, `researchDevelopmentImages/${image.name}`);
//             await uploadBytes(storageRef, image);
    
//             // Get the uploaded image URL
//             const downloadURL = await getDownloadURL(storageRef); // Await the promise here
//             setImageUrl(downloadURL);
    
//             // Add data to Firestore
//             await addDoc(collection(db, 'researchDevelopmentTopics'), {
//                 title,
//                 description,
//                 author,
//                 date,
//                 imageUrl: downloadURL, // Store the image URL in Firestore
//             });
    
//             // Reset form fields
//             setTitle('');
//             setDescription('');
//             setAuthor('');
//             setDate('');
//             setImage(null);
//             setImageUrl('');
    
//             // Refresh topics list
//             fetchTopics();
    
//             // Handle success or navigate to a different page
//             console.log('Research and Development topic uploaded successfully!');
//         } catch (error) {
//             console.error('Error uploading research development topic:', error);
//             // Handle error
//         } finally {
//             setUploading(false);
//         }
//     };
    

//     const handleEditModalOpen = (topic) => {
//         setEditTopicId(topic.id);
//         setEditTitle(topic.title);
//         setEditDescription(topic.description);
//         setEditImageUrl(topic.imageUrl);
//         setShowEditModal(true);
//     };

//     const handleEditModalClose = () => {
//         setShowEditModal(false);
//         setEditTopicId('');
//         setEditTitle('');
//         setEditDescription('');
//         setEditImageUrl('');
//     };

//     const handleEditSubmit = async () => {
//         try {
//             // Update topic in Firestore
//             const topicRef = doc(db, 'researchDevelopmentTopics', editTopicId);
//             await topicRef.update({
//                 title: editTitle,
//                 description: editDescription,
//                 imageUrl: editImageUrl,
//             });

//             // Close modal and refresh topics list
//             handleEditModalClose();
//             fetchTopics();
//         } catch (error) {
//             console.error('Error updating topic:', error);
//             // Handle error
//         }
//     };

//     const handleDeleteModalOpen = (topicId) => {
//         setDeleteTopicId(topicId);
//         setShowDeleteModal(true);
//     };

//     const handleDeleteModalClose = () => {
//         setShowDeleteModal(false);
//         setDeleteTopicId('');
//     };

//     const handleDeleteTopic = async () => {
//         try {
//             // Delete topic from Firestore
//             await deleteDoc(doc(db, 'researchDevelopmentTopics', deleteTopicId));

//             // Close modal and refresh topics list
//             handleDeleteModalClose();
//             fetchTopics();
//         } catch (error) {
//             console.error('Error deleting topic:', error);
//             // Handle error
//         }
//     };

//     return (
//         <Container className="upload-research-development">
//             <h2 className="text-center mb-4">Upload Research Development Topic</h2>
//             <Form onSubmit={handleSubmit}>
//                 <Form.Group controlId="title">
//                     <Form.Label>Title</Form.Label>
//                     <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
//                 </Form.Group>

//                 <Form.Group controlId="description">
//                     <Form.Label>Description</Form.Label>
//                     <Form.Control as="textarea" rows={5} value={description} onChange={(e) => setDescription(e.target.value)} required />
//                 </Form.Group>

//                 <Form.Group controlId="author">
//                     <Form.Label>Author</Form.Label>
//                     <Form.Control type="text" value={author} onChange={(e) => setAuthor(e.target.value)} required />
//                 </Form.Group>

//                 <Form.Group controlId="date">
//                     <Form.Label>Date</Form.Label>
//                     <Form.Control type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
//                 </Form.Group>

//                 <Form.Group controlId="image">
//                     <Form.Label>Image</Form.Label>
//                     <Form.Control type="file" onChange={handleImageChange} required />
//                 </Form.Group>

//                 <Button variant="primary" type="submit" disabled={uploading}>
//                     {uploading ? 'Uploading...' : 'Upload'}
//                 </Button>
//             </Form>

//             <hr />

//             <h2 className="text-center mb-4">All Research Development Topics</h2>
//             <Table striped bordered hover>
//                 <thead>
//                     <tr>
//                         <th>Title</th>
//                         <th>Author</th>
//                         <th>Date</th>
//                         <th>Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {topics.map(topic => (
//                         <tr key={topic.id}>
//                             <td>{topic.title}</td>
//                             <td>{topic.author}</td>
//                             <td>{topic.date}</td>
//                             <td>
//                                 <Button variant="info" className="mr-2" onClick={() => handleEditModalOpen(topic)}>Edit</Button>
//                                 <Button variant="danger" onClick={() => handleDeleteModalOpen(topic.id)}>Delete</Button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </Table>

//             {/* Edit Modal */}
//             <Modal show={showEditModal} onHide={handleEditModalClose} centered>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Edit Research Development Topic</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <Form.Group controlId="editTitle">
//                         <Form.Label>Title</Form.Label>
//                         <Form.Control type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} required />
//                     </Form.Group>

//                     <Form.Group controlId="editDescription">
//                         <Form.Label>Description</Form.Label>
//                         <Form.Control as="textarea" rows={5} value={editDescription} onChange={(e) => setEditDescription(e.target.value)} required />
//                     </Form.Group>

//                     <Form.Group controlId="editImageUrl">
//                         <Form.Label>Image URL</Form.Label>
//                         <Form.Control type="text" value={editImageUrl} onChange={(e) => setEditImageUrl(e.target.value)} required />
//                     </Form.Group>
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={handleEditModalClose}>Close</Button>
//                     <Button variant="primary" onClick={handleEditSubmit}>Save Changes</Button>
//                 </Modal.Footer>
//             </Modal>

//             {/* Delete Confirmation Modal */}
//             <Modal show={showDeleteModal} onHide={handleDeleteModalClose} centered>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Confirm Deletion</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     Are you sure you want to delete this topic?
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={handleDeleteModalClose}>Cancel</Button>
//                     <Button variant="danger" onClick={handleDeleteTopic}>Delete</Button>
//                 </Modal.Footer>
//             </Modal>
//         </Container>
//     );
// };

// export default UploadResearchDevelopment;