import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import AdminDashboard from '../components/admin/AdminDashboard';
import DoctorDashboard from '../components/doctor/DoctorDashboard';
import PatientDashboard from '../components/patient/PatientDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case 'ADMIN':
        return <AdminDashboard />;
      case 'DOCTOR':
        return <DoctorDashboard />;
      case 'PATIENT':
        return <PatientDashboard />;
      default:
        return (
          <Card>
            <Card.Body>
              <h3>Welcome to Healthcare Portal</h3>
              <p>Please contact administrator for role assignment.</p>
            </Card.Body>
          </Card>
        );
    }
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h1>Dashboard</h1>
          {renderDashboard()}
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;