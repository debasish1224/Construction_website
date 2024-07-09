import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { db, storage, auth } from '../firebase'; // Import Firestore, Storage, and Auth from Firebase
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import ContactList from './ContactList';
import ServiceList from './ServiceList'; // Import ServiceList component
import ProductList from './ProductList';

const Admin = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [category, setCategory] = useState('product');
    const [alert, setAlert] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [authenticated, setAuthenticated] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [viewApplications, setViewApplications] = useState(false);
    const [showServices, setShowServices] = useState(false);
    const [showProducts, setShowProducts] = useState(false);
    const [applications, setApplications] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                if (!auth.currentUser) {
                    setAuthenticated(false);
                    navigate('/');
                }
            } catch (error) {
                console.error('Authentication check error:', error);
            }
        };

        checkAuth();
    }, [navigate]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(file);
                setImageUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!title || !description || !image) {
            setAlert('All fields are required');
            return;
        }
        try {
            setUploading(true);
            const storageRef = ref(storage, `images/${image.name}`);
            await uploadBytes(storageRef, image);
            const imageUrl = await getDownloadURL(storageRef);

            const docRef = await addDoc(collection(db, category), {
                title,
                description,
                imageUrl,
            });

            setAlert('Upload successful!');
            setTitle('');
            setDescription('');
            setImage(null);
            setImageUrl('');
        } catch (error) {
            console.error("Error adding document: ", error);
            setAlert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setAuthenticated(false);
            navigate('/');
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const fetchApplications = async () => {
        try {
            const applicationsCollection = collection(db, 'applications');
            const applicationsSnapshot = await getDocs(applicationsCollection);
            const applicationsList = applicationsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setApplications(applicationsList);
        } catch (error) {
            console.error("Error fetching applications: ", error);
        }
    };

    const [showContacts, setShowContacts] = useState(false);

    const handleToggleContacts = () => {
        setShowContacts(!showContacts);
    };

    const handleToggleServices = () => {
        setShowServices(!showServices);
    };
    const toggleProducts = () => {
        setShowProducts(!showProducts)
    };

    if (!authenticated) {
        return null;
    }

    return (
        <Container className="my-5">
            <h2 className="text-center mb-4">Admin Page</h2>
            {alert && <Alert variant="danger">{alert}</Alert>}
            <div style={{ width: '100%', textAlign: 'end' }}>
                <Button
                    variant="danger"
                    onClick={handleLogout}
                    className="mb-3"
                    style={{ marginLeft: 'auto' }}
                >
                    Logout
                </Button>
            </div>
            <div style={{ width: '100%', textAlign: 'end' }}>
                <Button
                    variant="info"
                    onClick={() => {
                        fetchApplications();
                        setViewApplications(!viewApplications);
                    }}
                    className="mb-3"
                    style={{ marginLeft: 'auto' }}
                >
                    {viewApplications ? "Hide Applications" : "View Applications"}
                </Button>
            </div>
            {viewApplications && <ApplicationList applications={applications} />}
            <div style={{ width: '100%', textAlign: 'end' }}>
                <Button variant="warning" onClick={handleToggleContacts} className='mb-3'>
                    {showContacts ? 'Hide Contact Details' : 'View Contact Details'}
                </Button>
            </div>
            {showContacts && <ContactList />}
            <div style={{ width: '100%', textAlign: 'end' }}>
                <Button variant="primary" onClick={handleToggleServices} className="mb-3">
                    {showServices ? 'Hide Services' : 'View Services'}
                </Button>
            </div>
            {showServices && <ServiceList />}
            <div style={{ width: '100%', textAlign: 'end' }}>
                <Button variant='dark' onClick={toggleProducts} className="mb-3">
                    {showProducts ? 'Hide Products' : 'Show Products'}
                </Button>
            </div>
            {showProducts && <ProductList />}
            <div style={{ width: '100%', textAlign: 'end' }}>
                <Button
                    variant="success"
                    onClick={() => navigate('/upload-job')}
                    className="mb-3"
                    style={{ marginLeft: 'auto' }}
                >
                    Upload Job
                </Button>
            </div>

            <Form onSubmit={handleUpload}>
                <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Enter description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Image</Form.Label>
                    <Form.Control
                        type="file"
                        onChange={handleImageChange}
                    />
                    {imageUrl && (
                        <img src={imageUrl} alt="Preview" style={{ marginTop: '10px', width: '200px', height: '200px', textAlign: 'center' }} />
                    )}
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Control
                        as="select"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="product">Product</option>
                        <option value="service">Service</option>
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
        </Container>
    );
};

const ApplicationList = ({ applications }) => (
    <Container className="mt-4 mb-2">
        <h3>Job Applications</h3>
        {applications.length === 0 ? (
            <p>No applications found.</p>
        ) : (
            <ul className="list-unstyled">
                {applications.map(app => (
                    <li key={app.id} className="mb-3">
                        <Container fluid>
                            <Row className="border p-3 rounded">
                                <Col xs={12} md={6} lg={4}>
                                    <h5 className='text-success'>Job Title: {app.jobTitle}</h5>
                                </Col>
                                <Col xs={12} md={6} lg={4}>
                                    <strong className='text-danger'>Applicant Name: {app.firstName} {app.lastName}</strong>
                                </Col>
                                <Col xs={12} md={6} lg={4}>
                                    <strong>Email: {app.email}</strong>
                                </Col>
                                <Col xs={12} md={6} lg={4}>
                                    <strong>Phone: {app.phone}</strong>
                                </Col>
                                <Col xs={12} md={6} lg={4}>
                                    <strong>Address: {app.address}</strong>
                                </Col>
                                <Col xs={12} md={6} lg={4}>
                                    <strong>
                                        Resume:
                                        <Button
                                            className='ml-1'
                                            variant="primary"
                                            href={app.resumeUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            View Resume
                                        </Button>
                                    </strong>
                                </Col>
                            </Row>
                        </Container>
                    </li>
                ))}
            </ul>
        )}
    </Container>
);
export default Admin;

// import React, { useState, useEffect } from 'react';
// import { Container, Form, Button, Alert,Spinner } from 'react-bootstrap';
// import { db, storage } from '../firebase'; // Import Firestore and Storage from Firebase
// import { collection, addDoc } from 'firebase/firestore';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { auth } from '../firebase'; // Assuming auth is correctly set up in your firebase.js file
// import { signOut } from 'firebase/auth';
// import { useNavigate } from 'react-router-dom';


// const Admin = () => {
//     const [title, setTitle] = useState('');
//     const [description, setDescription] = useState('');
//     const [image, setImage] = useState(null);
//     const [category, setCategory] = useState('product');
//     const [alert, setAlert] = useState('');
//     const [imageUrl, setImageUrl] = useState('');
//     const [authenticated, setAuthenticated] = useState(true); // Track authentication status
//     const [uploading, setUploading] = useState(false); // State for tracking upload status
//     const navigate = useNavigate();

//     useEffect(() => {
//         // Check if user is authenticated
//         const checkAuth = async () => {
//             try {
//                 // You can check auth state here and set authenticated state accordingly
//                 // For example, if auth.currentUser is null, setAuthenticated(false)
//                 if (!auth.currentUser) {
//                     setAuthenticated(false);
//                     navigate('/'); // Redirect to home or login page if not authenticated
//                 }
//             } catch (error) {
//                 console.error('Authentication check error:', error);
//             }
//         };

//         checkAuth();
//     }, []);

//     // Function to handle image selection and preview
//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 setImage(file);
//                 setImageUrl(reader.result);
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     const handleUpload = async (e) => {
//         e.preventDefault();
//         if (!title || !description || !image) {
//             setAlert('All fields are required');
//             return;
//         }
//         try {
//             setUploading(true); // Start uploading, set loading state
//             const storageRef = ref(storage, `images/${image.name}`);
//             await uploadBytes(storageRef, image);
//             const imageUrl = await getDownloadURL(storageRef);

//             const docRef = await addDoc(collection(db, category), {
//                 title,
//                 description,
//                 imageUrl,
//             });

//             setAlert('Upload successful!');
//             setTitle('');
//             setDescription('');
//             setImage(null);
//             setImageUrl('');
//         } catch (error) {
//             console.error("Error adding document: ", error);
//             setAlert('Upload failed');
//         } finally {
//             setUploading(false); // Upload complete, set loading state to false
//         }
//     };
//     const handleLogout = async () => {
//         try {
//             await signOut(auth);
//             setAuthenticated(false); // Set authenticated state to false
//             navigate('/'); // Redirect to home or login page after logout
//         } catch (error) {
//             console.error("Logout error:", error);
//         }
//     };

//     if (!authenticated) {
//         return null; // Or display a message indicating unauthorized access
//     }

//     return (
//         <Container className="my-5">
//             <h2 className="text-center mb-4">Admin Page</h2>
//             {alert && <Alert variant="danger">{alert}</Alert>}
//             <div style={{ width: '100%', textAlign: 'end' }}>
//                 <Button
//                     variant="success"
//                     onClick={handleLogout}
//                     className="mb-3"
//                     style={{ marginLeft: 'auto' }} // Inline style to push the button to the right
//                 >
//                     Logout
//                 </Button>
//             </div>

//             <Form onSubmit={handleUpload}>
//                 <Form.Group className="mb-3">
//                     <Form.Label>Title</Form.Label>
//                     <Form.Control
//                         type="text"
//                         placeholder="Enter title"
//                         value={title}
//                         onChange={(e) => setTitle(e.target.value)}
//                     />
//                 </Form.Group>

//                 <Form.Group className="mb-3">
//                     <Form.Label>Description</Form.Label>
//                     <Form.Control
//                         as="textarea"
//                         rows={3}
//                         placeholder="Enter description"
//                         value={description}
//                         onChange={(e) => setDescription(e.target.value)}
//                     />
//                 </Form.Group>

//                 <Form.Group className="mb-3">
//                     <Form.Label>Image</Form.Label>
//                     <Form.Control
//                         type="file"
//                         onChange={handleImageChange}
//                     />
//                     {imageUrl && (
//                         <img src={imageUrl} alt="Preview" style={{ marginTop: '10px', width: '200px', height: '200px', textAlign: 'center' }} />
//                     )}
//                 </Form.Group>

//                 <Form.Group className="mb-3">
//                     <Form.Label>Category</Form.Label>
//                     <Form.Control
//                         as="select"
//                         value={category}
//                         onChange={(e) => setCategory(e.target.value)}
//                     >
//                         <option value="product">Product</option>
//                         <option value="service">Service</option>
//                     </Form.Control>
//                 </Form.Group>

//                 <Button variant="primary" type="submit" disabled={uploading}>
//                     {uploading ? (
//                         <Spinner animation="border" size="sm" role="status" aria-hidden="true" />
//                     ) : (
//                         'Upload'
//                     )}
//                 </Button>

//             </Form>
//         </Container>
//     );
// };

// export default Admin;