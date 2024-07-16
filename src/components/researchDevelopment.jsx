import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardActions, Button } from '@mui/material';
import { db } from '../firebase'; // Import Firestore instance from Firebase
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import '../Css/researchDevelopment.css'; // Custom CSS for Research and Development component

const ResearchDevelopment = () => {
  const [topics, setTopics] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'researchDevelopmentTopics')); // Adjust collection name as per your Firestore setup
        const topicsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTopics(topicsData);
      } catch (error) {
        console.error('Error fetching research and development topics:', error);
        // Handle error fetching data
      }
    };

    fetchTopics();
  }, []);

  const handleTopicClick = (topic) => {
    navigate('/viewBlog', { state: topic });
  };

  return (
    <div className="research-development-container">
      <Container maxWidth="lg" className="my-5">
        <Typography variant="h2" className="text-center mb-4">Research and Development</Typography>
        <Grid container spacing={3}>
          {topics.map(topic => (
            <Grid item xs={12} sm={6} md={4} key={topic.id}>
              <Card className="topic-card" onClick={() => handleTopicClick(topic)}>
                <CardContent className="topic-card-content">
                  <Typography variant="h5" className="topic-title">
                    {topic.title}
                  </Typography>
                  <Typography variant="body2" className="topic-text">
                    {`${topic.description.substring(0, 20)}${topic.description.length > 20 ? "..." : ""}`}
                  </Typography>
                  <Typography variant="caption" className="topic-info">
                    By {topic.author} | {topic.date}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary" onClick={() => handleTopicClick(topic)}>Read More</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default ResearchDevelopment;