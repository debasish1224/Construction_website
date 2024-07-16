import React from 'react';
import { Container, Typography, Card, CardMedia, CardContent } from '@mui/material';
import { useLocation } from 'react-router-dom';
import '../Css/viewBlog.css'; // Custom CSS for ViewBlog component

const ViewBlog = () => {
  const location = useLocation();
  const topic = location.state;

  return (
    <div className="view-blog-container">
      <Container>
        <Card className="blog-card">
          <CardMedia
            component="img"
            className="blog-image"
            image={topic.imageUrl}
            alt={topic.title}
          />
          <CardContent className="blog-content">
            <Typography variant="h2" className="blog-title">{topic.title}</Typography>
            <Typography variant="body1" className="blog-description">
              {topic.description}
            </Typography>
            <Typography variant="caption" className="blog-info">
              By {topic.author} | {topic.date}
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default ViewBlog;