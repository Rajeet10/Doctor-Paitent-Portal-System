import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Container className="mt-4">
      {/* Hero Section */}
      <Row className="text-center mb-5">
        <Col>
          <h1 className="display-4 text-primary mb-3">Welcome to Healthcare Portal</h1>
          <p className="lead">Your complete healthcare management solution</p>
          {!isAuthenticated && (
            <div className="mt-4">
              <Button as={Link} to="/register" variant="primary" size="lg" className="me-3">
                Get Started
              </Button>
              <Button as={Link} to="/login" variant="outline-primary" size="lg">
                Login
              </Button>
            </div>
          )}
        </Col>
      </Row>

      {/* Features Section */}
      <Row className="mb-5">
        <Col md={4} className="mb-4">
          <Card className="h-100 text-center">
            <Card.Body>
              <div className="fs-1 mb-3">👨‍⚕️</div>
              <Card.Title>For Doctors</Card.Title>
              <Card.Text>
                Manage appointments, view patient records, and provide quality healthcare services.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="h-100 text-center">
            <Card.Body>
              <div className="fs-1 mb-3">👨‍💼</div>
              <Card.Title>For Patients</Card.Title>
              <Card.Text>
                Book appointments, view medical history, and communicate with your healthcare providers.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="h-100 text-center">
            <Card.Body>
              <div className="fs-1 mb-3">⚙️</div>
              <Card.Title>For Administrators</Card.Title>
              <Card.Text>
                Manage users, monitor system performance, and ensure smooth operations.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Dashboard Quick Access */}
      {isAuthenticated && (
        <Row>
          <Col>
            <Card className="bg-light">
              <Card.Body className="text-center">
                <h3>Welcome back, {user?.firstName || user?.name}!</h3>
                <p className="mb-3">You are logged in as {user?.role}</p>
                <Button as={Link} to="/dashboard" variant="primary" size="lg">
                  Go to Dashboard
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Home;