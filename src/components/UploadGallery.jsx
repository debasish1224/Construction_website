import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Row, Col, ProgressBar, Card } from 'react-bootstrap';
import { db, storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

const UploadGallery = () => {
    const [title, setTitle] = useState('');
    const [type, setType] = useState('image');
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [galleryItems, setGalleryItems] = useState([]);

    useEffect(() => {
        fetchGalleryItems();
    }, []);

    const fetchGalleryItems = async () => {
        try {
            const galleryCollection = collection(db, 'gallery');
            const gallerySnapshot = await getDocs(galleryCollection);
            const galleryList = gallerySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setGalleryItems(galleryList);
        } catch (error) {
            console.error('Error fetching gallery items:', error);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        const storageRef = ref(storage, `gallery/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgress(prog);
            },
            (error) => {
                console.error('Upload error: ', error);
                setUploading(false);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
                    await addDoc(collection(db, 'gallery'), {
                        title,
                        type,
                        url,
                    });
                    setUploading(false);
                    setTitle('');
                    setFile(null);
                    setProgress(0);
                    fetchGalleryItems();
                });
            }
        );
    };

    const handleDelete = async (id, url) => {
        try {
            await deleteDoc(doc(db, 'gallery', id));
            const storageRef = ref(storage, url);
            await deleteObject(storageRef);
            fetchGalleryItems();
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    return (
        <Container className="my-5">
            <h2 className="text-center mb-4">Upload to Gallery</h2>
            <Form onSubmit={handleUpload}>
                <Form.Group as={Row} className="mb-3" controlId="formTitle">
                    <Form.Label column sm={2}>
                        Title
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control
                            type="text"
                            placeholder="Enter title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="formType">
                    <Form.Label column sm={2}>
                        Type
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control
                            as="select"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value="image">Image</option>
                            <option value="video">Video</option>
                        </Form.Control>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="formFile">
                    <Form.Label column sm={2}>
                        File
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control
                            type="file"
                            onChange={handleFileChange}
                            required
                            accept={type === 'image' ? 'image/*' : 'video/*'}
                        />
                    </Col>
                </Form.Group>

                {uploading && (
                    <Row className="mb-3">
                        <Col sm={{ span: 10, offset: 2 }}>
                            <ProgressBar now={progress} label={`${progress}%`} />
                        </Col>
                    </Row>
                )}

                <Row>
                    <Col sm={{ span: 10, offset: 2 }}>
                        <Button variant="primary" type="submit" disabled={uploading}>
                            {uploading ? 'Uploading...' : 'Upload'}
                        </Button>
                    </Col>
                </Row>
            </Form>

            <h3 className="text-center mt-5 mb-4">Gallery Items</h3>
            <Row className="g-4">
                {galleryItems.map((item) => (
                    <Col key={item.id} xs={12} md={6} lg={4}>
                        <Card className="h-100">
                            {item.type === 'image' ? (
                                <Card.Img variant="top" src={item.url} alt={item.title} className="media-item" />
                            ) : (
                                <Card.Body className="media-item">
                                    <video width="100%" height="100%" controls>
                                        <source src={item.url} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </Card.Body>
                            )}
                            <Card.Body>
                                <Card.Title>{item.title}</Card.Title>
                                <Button variant="danger" onClick={() => handleDelete(item.id, item.url)}>
                                    Delete
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default UploadGallery;