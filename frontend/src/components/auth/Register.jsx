import React, { useState } from 'react';
import { Form, Button, Card, Alert, Container, Row, Col, Tabs, Tab } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

const Register = () => {
  const [activeTab, setActiveTab] = useState('patient');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    address: '',
    emergencyContact: '',
    medicalHistory: '',
    specialty: '',
    qualification: '',
    experienceYears: '',
    licenseNumber: '',
    consultationFee: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Combine firstName + lastName into name and always include role
      const payload = {
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`,
        role: activeTab.toUpperCase()
      };

      let response;
      if (activeTab === 'patient') {
        response = await authService.registerPatient(payload);
      } else if (activeTab === 'doctor') {
        response = await authService.registerDoctor(payload);
      }

      // ✅ UPDATED: Redirect to login with registration info instead of profile wizard
      setSuccess('Registration successful! Please login.');
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: 'Registration successful! Please login to continue.',
            fromRegistration: true, // ✅ NEW: Flag to indicate new registration
            userEmail: formData.email // ✅ NEW: Pre-fill email for convenience
          } 
        });
      }, 1500);
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Register</h2>

              <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-3">
                <Tab eventKey="patient" title="Patient">
                  <PatientForm
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    loading={loading}
                    error={error}
                    success={success}
                  />
                </Tab>
                <Tab eventKey="doctor" title="Doctor">
                  <DoctorForm
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    loading={loading}
                    error={error}
                    success={success}
                  />
                </Tab>
              </Tabs>

              <div className="text-center mt-3">
                <Link to="/login">Already have an account? Login</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

// Patient Form Component (NO CHANGES NEEDED)
const PatientForm = ({ formData, handleChange, handleSubmit, loading, error, success }) => (
  <Form onSubmit={handleSubmit}>
    {error && <Alert variant="danger">{error}</Alert>}
    {success && <Alert variant="success">{success}</Alert>}

    <Row>
      <Col md={6}>
        <Form.Group className="mb-3">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </Form.Group>
      </Col>
      <Col md={6}>
        <Form.Group className="mb-3">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </Form.Group>
      </Col>
    </Row>

    <Form.Group className="mb-3">
      <Form.Label>Email</Form.Label>
      <Form.Control
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
    </Form.Group>

    <Form.Group className="mb-3">
      <Form.Label>Password</Form.Label>
      <Form.Control
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        required
      />
    </Form.Group>

    <Form.Group className="mb-3">
      <Form.Label>Phone</Form.Label>
      <Form.Control
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        required
      />
    </Form.Group>

    <Row>
      <Col md={6}>
        <Form.Group className="mb-3">
          <Form.Label>Date of Birth</Form.Label>
          <Form.Control
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
          />
        </Form.Group>
      </Col>
      <Col md={6}>
        <Form.Group className="mb-3">
          <Form.Label>Gender</Form.Label>
          <Form.Select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </Form.Select>
        </Form.Group>
      </Col>
    </Row>

    <Button variant="primary" type="submit" className="w-100" disabled={loading}>
      {loading ? 'Registering...' : 'Register as Patient'}
    </Button>
  </Form>
);

// Doctor Form Component (NO CHANGES NEEDED)
const DoctorForm = ({ formData, handleChange, handleSubmit, loading, error, success }) => (
  <Form onSubmit={handleSubmit}>
    {error && <Alert variant="danger">{error}</Alert>}
    {success && <Alert variant="success">{success}</Alert>}

    <Row>
      <Col md={6}>
        <Form.Group className="mb-3">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </Form.Group>
      </Col>
      <Col md={6}>
        <Form.Group className="mb-3">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </Form.Group>
      </Col>
    </Row>

    <Form.Group className="mb-3">
      <Form.Label>Email</Form.Label>
      <Form.Control
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
    </Form.Group>

    <Form.Group className="mb-3">
      <Form.Label>Password</Form.Label>
      <Form.Control
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        required
      />
    </Form.Group>

    <Form.Group className="mb-3">
      <Form.Label>Phone</Form.Label>
      <Form.Control
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        required
      />
    </Form.Group>

    <Form.Group className="mb-3">
      <Form.Label>Specialty</Form.Label>
      <Form.Control
        type="text"
        name="specialty"
        value={formData.specialty}
        onChange={handleChange}
        required
        placeholder="e.g., Cardiology, Neurology"
      />
    </Form.Group>

    <Form.Group className="mb-3">
      <Form.Label>Qualification</Form.Label>
      <Form.Control
        type="text"
        name="qualification"
        value={formData.qualification}
        onChange={handleChange}
        required
        placeholder="e.g., MD, MBBS"
      />
    </Form.Group>

    <Form.Group className="mb-3">
      <Form.Label>Experience (Years)</Form.Label>
      <Form.Control
        type="number"
        name="experienceYears"
        value={formData.experienceYears}
        onChange={handleChange}
        required
      />
    </Form.Group>

    <Button variant="primary" type="submit" className="w-100" disabled={loading}>
      {loading ? 'Registering...' : 'Register as Doctor'}
    </Button>
  </Form>
);

export default Register;