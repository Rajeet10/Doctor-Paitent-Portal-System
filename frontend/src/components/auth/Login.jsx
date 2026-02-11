import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Container, Row, Col } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ UPDATED: Get state from navigation (like from registration)
  const { message, fromRegistration, userEmail } = location.state || {};

  // ✅ UPDATED: Pre-fill email if coming from registration
  useEffect(() => {
    if (userEmail) {
      setFormData(prev => ({ ...prev, email: userEmail }));
    }
  }, [userEmail]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        // ✅ UPDATED: Check if user just registered (incomplete profile)
        const user = JSON.parse(localStorage.getItem('user'));
        const hasIncompleteProfile = checkProfileCompletion(user);
        
        if (fromRegistration || hasIncompleteProfile) {
          // ✅ NEW: New user or incomplete profile → go to profile wizard
          navigate('/profile-wizard', {
            state: {
              message: 'Complete your profile to get started!',
              userType: user?.role?.toLowerCase() || 'patient'
            }
          });
        } else {
          // Existing user with complete profile → go to dashboard
          navigate('/dashboard');
        }
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW: Helper function to check if profile is complete
  const checkProfileCompletion = (user) => {
    if (!user) return true;
    
    if (user.role === 'PATIENT') {
      return !user.bloodGroup || !user.address || !user.emergencyContact;
    } else if (user.role === 'DOCTOR') {
      return !user.specialty || !user.qualification || !user.experienceYears;
    }
    
    return false;
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Login</h2>
              
              {/* ✅ UPDATED: Show special message if coming from registration */}
              {message && <Alert variant="success">{message}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
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
                    placeholder="Enter your password"
                  />
                </Form.Group>

                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100" 
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </Form>

              <div className="text-center mt-3">
                <Link to="/register">Don't have an account? Register</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;