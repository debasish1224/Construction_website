import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import '../Css/Gallery.css'; // Make sure to create and import this CSS file

const Gallery = () => {
    const [mediaItems, setMediaItems] = useState([]);

    useEffect(() => {
        const fetchMediaItems = async () => {
            try {
                const galleryCollection = collection(db, 'gallery');
                const gallerySnapshot = await getDocs(galleryCollection);
                const mediaList = gallerySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                })).filter(item => item.url); // Ensure items have a url
                setMediaItems(mediaList);
            } catch (error) {
                console.error('Error fetching media items:', error);
            }
        };

        fetchMediaItems();
    }, []);

    return (
        <Container className="my-5">
            <h2 className="text-center mb-4">SannuTech Advantage</h2>
            <Row className="g-4">
                {mediaItems.map((item) => (
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
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Gallery;