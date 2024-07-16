import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { db, storage } from '../firebase'; // Import Firebase modules
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import '../Css/UploadAboutImage.css'; // Import your custom CSS for UploadAboutImage styling

const UploadAboutImage = () => {
    const [title, setTitle] = useState('');
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false); // State for tracking upload progress

    // Function to fetch all images from Firestore
    const fetchImages = async () => {
        const imageCollection = collection(db, 'aboutImage');
        const snapshot = await getDocs(imageCollection);
        const imagesData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setImages(imagesData);
    };

    // Fetch images on component mount
    useEffect(() => {
        fetchImages();
    }, []);

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (image) {
            setUploading(true); // Set uploading state to true

            const storageRef = ref(storage, `aboutImages/${image.name}`);
            const uploadTask = uploadBytesResumable(storageRef, image);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    // Progress function
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    setUploadProgress(progress);
                },
                (error) => {
                    // Error function
                    console.error('Error uploading image:', error);
                    setUploading(false); // Reset uploading state on error
                },
                () => {
                    // Complete function
                    getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                        // Save image info to Firestore using addDoc
                        addDoc(collection(db, 'aboutImage'), {
                            title: title,
                            imageUrl: url,
                        })
                            .then((docRef) => {
                                console.log('Image uploaded successfully.');
                                setImageUrl(url);
                                setTitle('');
                                setUploadProgress(0);
                                fetchImages(); // Fetch updated images after upload
                                setUploading(false); // Reset uploading state on success
                            })
                            .catch((error) => {
                                console.error('Error adding image to Firestore:', error);
                                setUploading(false); // Reset uploading state on error
                            });
                    });
                }
            );
        } else {
            alert('Please select an image to upload.');
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, 'aboutImage', id));
            console.log('Document successfully deleted!');
            fetchImages(); // Fetch updated images after deletion
        } catch (error) {
            console.error('Error deleting document:', error);
        }
    };

    return (
        <Container className="upload-about-container my-5">
            <h2 className="text-center mb-4">Upload About Image</h2>
            <Form>
                <Form.Group controlId="formTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control type="text" placeholder="Enter title" value={title} onChange={handleTitleChange} />
                </Form.Group>
                <Form.Group controlId="formImage">
                    <Form.Label>Image</Form.Label>
                    <Form.Control type="file" onChange={handleImageChange} />
                </Form.Group>
                <Button variant="primary" className='mt-2' onClick={handleUpload} disabled={uploading}>
                    {uploading ? (
                        <Spinner animation="border" size="sm" />
                    ) : (
                        'Upload'
                    )}
                </Button>
            </Form>

            {/* Display uploaded images */}
            <Container className="text-center mt-5">
                <h3 className="mb-4">Uploaded Images</h3>
                <div className="d-flex flex-wrap justify-content-center">
                    {images.map((image) => (
                        <Card key={image.id} className="uploaded-image-card m-2">
                            <Card.Img variant="top" src={image.imageUrl} alt="Uploaded" />
                            <Card.Body>
                                <Card.Text>Title: {image.title}</Card.Text>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDelete(image.id)}
                                    disabled={uploading}
                                >
                                    Delete
                                </Button>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            </Container>

            {/* Display upload progress */}
            {uploadProgress > 0 && <p className="upload-progress">Upload Progress: {uploadProgress}%</p>}
        </Container>
    );
};

export default UploadAboutImage;


// import React, { useState, useEffect } from 'react';
// import { Container, Form, Button, Card } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { db, storage } from '../firebase'; // Import Firebase modules
// import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
// import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
// import '../Css/UploadAboutImage.css'; // Import your custom CSS for UploadAboutImage styling

// const UploadAboutImage = () => {
//   const [title, setTitle] = useState('');
//   const [image, setImage] = useState(null);
//   const [imageUrl, setImageUrl] = useState('');
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [images, setImages] = useState([]);

//   // Function to fetch all images from Firestore
//   const fetchImages = async () => {
//     const imageCollection = collection(db, 'aboutImage');
//     const snapshot = await getDocs(imageCollection);
//     const imagesData = snapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data()
//     }));
//     setImages(imagesData);
//   };

//   // Fetch images on component mount
//   useEffect(() => {
//     fetchImages();
//   }, []);

//   const handleTitleChange = (e) => {
//     setTitle(e.target.value);
//   };

//   const handleImageChange = (e) => {
//     if (e.target.files[0]) {
//       setImage(e.target.files[0]);
//     }
//   };

//   const handleUpload = () => {
//     if (image) {
//       const storageRef = ref(storage, `aboutImages/${image.name}`);
//       const uploadTask = uploadBytesResumable(storageRef, image);

//       uploadTask.on(
//         'state_changed',
//         (snapshot) => {
//           // Progress function
//           const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
//           setUploadProgress(progress);
//         },
//         (error) => {
//           // Error function
//           console.error('Error uploading image:', error);
//         },
//         () => {
//           // Complete function
//           getDownloadURL(uploadTask.snapshot.ref).then((url) => {
//             // Save image info to Firestore using addDoc
//             addDoc(collection(db,'aboutImage'), {
//               title: title,
//               imageUrl: url,
//             })
//               .then((docRef) => {
//                 console.log('Image uploaded successfully.');
//                 setImageUrl(url);
//                 setTitle('');
//                 setUploadProgress(0);
//                 fetchImages(); // Fetch updated images after upload
//               })
//               .catch((error) => {
//                 console.error('Error adding image to Firestore:', error);
//               });
//           });
//         }
//       );
//     } else {
//       alert('Please select an image to upload.');
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await deleteDoc(doc(db, 'aboutImage', id));
//       console.log('Document successfully deleted!');
//       fetchImages(); // Fetch updated images after deletion
//     } catch (error) {
//       console.error('Error deleting document:', error);
//     }
//   };

//   return (
//     <Container className="upload-about-container my-5">
//       <h2 className="text-center mb-4">Upload About Image</h2>
//       <Form>
//         <Form.Group controlId="formTitle">
//           <Form.Label>Title</Form.Label>
//           <Form.Control type="text" placeholder="Enter title" value={title} onChange={handleTitleChange} />
//         </Form.Group>
//         <Form.Group controlId="formImage">
//           <Form.Label>Image</Form.Label>
//           <Form.Control type="file" onChange={handleImageChange} />
//         </Form.Group>
//         <Button variant="primary" className='mt-2' onClick={handleUpload}>
//           Upload
//         </Button>
//       </Form>

//       {/* Display uploaded images */}
//       <Container className="mt-5">
//         <h3 className="mb-4">Uploaded Images</h3>
//         <div className="d-flex flex-wrap">
//           {images.map((image) => (
//             <Card key={image.id} className="uploaded-image-card m-2">
//               <Card.Img variant="top" src={image.imageUrl} alt="Uploaded" />
//               <Card.Body>
//                 <Card.Text>Title: {image.title}</Card.Text>
//                 <Button variant="danger" size="sm" onClick={() => handleDelete(image.id)}>
//                   Delete
//                 </Button>
//               </Card.Body>
//             </Card>
//           ))}
//         </div>
//       </Container>

//       {/* Display upload progress */}
//       {uploadProgress > 0 && <p className="upload-progress">Upload Progress: {uploadProgress}%</p>}
//     </Container>
//   );
// };

// export default UploadAboutImage;