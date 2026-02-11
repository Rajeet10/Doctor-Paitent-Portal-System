// components/profile/ProfileWizard.jsx
import React, { useState } from 'react';
import { 
  Container, 
  Card, 
  ProgressBar, 
  Button, 
  Row, 
  Col, 
  Form, 
  Alert,
  Badge 
} from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';

const ProfileWizard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  
  const { 
    userType = user?.role?.toLowerCase() || 'patient', 
    message = 'Complete your profile for better experience'
  } = location.state || {};
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
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
    consultationFee: '',
    about: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    const token = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    
    console.log('=== DEBUG DATA ===');
    console.log('👤 User ID:', storedUser?.id);
    console.log('👤 User role:', storedUser?.role);
    console.log('📦 Form data being sent:', formData);

    if (!token) {
      throw new Error('No authentication token found');
    }

    let response;
    if (userType === 'patient') {
      // ✅ SMART UPDATE: Only include fields that have values
      const updateData = {};

      // Only add form fields that have non-empty values
      if (formData.dateOfBirth) updateData.dateOfBirth = formData.dateOfBirth;
      if (formData.gender) updateData.gender = formData.gender;
      if (formData.bloodGroup && formData.bloodGroup.trim() !== '') updateData.bloodGroup = formData.bloodGroup;
      if (formData.address && formData.address.trim() !== '') updateData.address = formData.address;
      if (formData.emergencyContact && formData.emergencyContact.trim() !== '') updateData.emergencyContact = formData.emergencyContact;
      if (formData.medicalHistory && formData.medicalHistory.trim() !== '') updateData.medicalHistory = formData.medicalHistory;

      console.log('🔄 Sending patient data:', updateData);
      response = await authService.updatePatientProfile(storedUser.id, updateData);

    } else if (userType === 'doctor') {
      // ✅ SMART UPDATE: Only include fields that have values
      const updateData = {};

      // Only add form fields that have meaningful values
      if (formData.specialty && formData.specialty.trim() !== '') {
        updateData.specialty = formData.specialty;
      }
      if (formData.qualification && formData.qualification.trim() !== '') {
        updateData.qualification = formData.qualification;
      }
      // Only update experience if it's provided and valid
      if (formData.experienceYears && formData.experienceYears !== '' && parseInt(formData.experienceYears) > 0) {
        updateData.experienceYears = parseInt(formData.experienceYears);
      }
      if (formData.licenseNumber && formData.licenseNumber.trim() !== '') {
        updateData.licenseNumber = formData.licenseNumber;
      }
      // Only update fee if it's provided and valid
      if (formData.consultationFee && formData.consultationFee !== '' && parseFloat(formData.consultationFee) > 0) {
        updateData.consultationFee = parseFloat(formData.consultationFee);
      }
      if (formData.about && formData.about.trim() !== '') {
        updateData.about = formData.about;
      }

      console.log('🔄 Sending doctor data:', updateData);
      response = await authService.updateDoctorProfile(storedUser.id, updateData);
    }
    
    console.log('✅ Profile update response:', response);
    
    if (response.data && response.data.data) {
      updateUser(response.data.data);
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    
    alert('Profile completed successfully!');
    navigate('/dashboard');
    
  } catch (error) {
    console.error('❌ Profile update failed:', error);
    console.error('❌ Error response data:', error.response?.data);
    
    if (error.response?.status === 400) {
      alert('Data format error. Please make sure all required fields (*) are filled correctly.');
    } else {
      alert(`Failed to update profile: ${error.message}`);
    }
  } finally {
    setLoading(false);
  }
};
  const handleSkip = () => {
    if (window.confirm('You can complete your profile later from settings. Continue to dashboard?')) {
      navigate('/dashboard');
    }
  };

  const progress = (step / 3) * 100;

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow">
            <Card.Header className="text-center bg-primary text-white">
              <h4 className="mb-1">Complete Your Profile</h4>
              <div className="d-flex justify-content-center align-items-center">
                <Badge bg="light" text="dark" className="me-2">
                  {userType === 'doctor' ? '👨‍⚕️ Doctor' : '👤 Patient'}
                </Badge>
                <small className="text-light">{message}</small>
              </div>
            </Card.Header>
            
            <Card.Body className="p-4">
              <ProgressBar now={progress} className="mb-4" variant="primary" />
              
              <Alert variant="info" className="text-center">
                <strong>Almost there!</strong> Complete your profile in {4 - step} simple steps.
              </Alert>

              <Form onSubmit={handleSubmit}>
                {step === 1 && (
                  <PersonalInfoStep 
                    formData={formData} 
                    handleChange={handleChange}
                    userType={userType}
                    onNext={() => setStep(2)}
                  />
                )}

                {step === 2 && (
                  <MedicalProfessionalStep 
                    formData={formData} 
                    handleChange={handleChange}
                    userType={userType}
                    onNext={() => setStep(3)}
                    onBack={() => setStep(1)}
                  />
                )}

                {step === 3 && (
                  <ReviewStep 
                    formData={formData}
                    userType={userType}
                    onBack={() => setStep(2)}
                    loading={loading}
                    onSkip={handleSkip}
                  />
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

// Step 1: Personal Information
const PersonalInfoStep = ({ formData, handleChange, userType, onNext }) => {
  const handleNext = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div>
      <h5 className="mb-4">📝 Personal Information</h5>
      
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
            <Form.Select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {userType === 'patient' && (
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Blood Group</Form.Label>
              <Form.Select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Emergency Contact</Form.Label>
              <Form.Control
                type="tel"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                placeholder="Emergency phone number"
              />
            </Form.Group>
          </Col>
        </Row>
      )}

      <Form.Group className="mb-3">
        <Form.Label>Address</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter your complete address"
        />
      </Form.Group>

      <div className="d-flex justify-content-between align-items-center">
        <div>
          <small className="text-muted">Step 1 of 3</small>
        </div>
        <Button variant="primary" onClick={handleNext}>
          Next →
        </Button>
      </div>
    </div>
  );
};

// Step 2: Medical/Professional Information
const MedicalProfessionalStep = ({ formData, handleChange, userType, onNext, onBack }) => {
  const handleNext = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div>
      <h5 className="mb-4">
        {userType === 'doctor' ? '👨‍⚕️ Professional Information' : '🏥 Medical Information'}
      </h5>
      
      {userType === 'doctor' ? (
        // Doctor Professional Info
        <>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Specialty *</Form.Label>
                <Form.Control
                  type="text"
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Cardiology, Neurology"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Qualification *</Form.Label>
                <Form.Control
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  required
                  placeholder="e.g., MD, MBBS"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Experience (Years) *</Form.Label>
                <Form.Control
                  type="number"
                  name="experienceYears"
                  value={formData.experienceYears}
                  onChange={handleChange}
                  required
                  min="0"
                  max="50"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>License Number</Form.Label>
                <Form.Control
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  placeholder="Medical license number"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Consultation Fee (₹)</Form.Label>
            <Form.Control
              type="number"
              name="consultationFee"
              value={formData.consultationFee}
              onChange={handleChange}
              placeholder="e.g., 500"
              min="0"
            />
          </Form.Group>
        </>
      ) : (
        // Patient Medical Info
        <Form.Group className="mb-3">
          <Form.Label>Medical History</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            name="medicalHistory"
            value={formData.medicalHistory}
            onChange={handleChange}
            placeholder="Any existing medical conditions, allergies, medications, or previous surgeries..."
          />
          <Form.Text className="text-muted">
            This information helps doctors provide better personalized care
          </Form.Text>
        </Form.Group>
      )}

      {/* Common field for both */}
      <Form.Group className="mb-4">
        <Form.Label>{userType === 'doctor' ? 'About/Bio' : 'Additional Notes'}</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="about"
          value={formData.about}
          onChange={handleChange}
          placeholder={
            userType === 'doctor' 
              ? "Tell patients about your experience, expertise, and approach to healthcare..." 
              : "Any additional information you'd like to share with your healthcare providers"
          }
        />
      </Form.Group>

      <div className="d-flex justify-content-between align-items-center">
        <div>
          <small className="text-muted">Step 2 of 3</small>
        </div>
        <div>
          <Button variant="outline-secondary" onClick={onBack} className="me-2">
            ← Back
          </Button>
          <Button variant="primary" onClick={handleNext}>
            Next →
          </Button>
        </div>
      </div>
    </div>
  );
};

// Step 3: Review & Complete
const ReviewStep = ({ formData, userType, onBack, loading, onSkip }) => {
  return (
    <div>
      <h5 className="mb-4">👀 Review Your Information</h5>
      
      <Card className="bg-light mb-4">
        <Card.Body>
          <h6 className="border-bottom pb-2">Personal Information</h6>
          <Row className="mb-3">
            <Col md={6}>
              <strong>Date of Birth:</strong>
              <p className="mb-2">{formData.dateOfBirth || 'Not provided'}</p>
            </Col>
            <Col md={6}>
              <strong>Gender:</strong>
              <p className="mb-2">{formData.gender || 'Not provided'}</p>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <strong>Address:</strong>
              <p className="mb-2">{formData.address || 'Not provided'}</p>
            </Col>
          </Row>

          {userType === 'patient' ? (
            <>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Blood Group:</strong>
                  <p className="mb-2">{formData.bloodGroup || 'Not provided'}</p>
                </Col>
                <Col md={6}>
                  <strong>Emergency Contact:</strong>
                  <p className="mb-2">{formData.emergencyContact || 'Not provided'}</p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <strong>Medical History:</strong>
                  <p className="mb-0">{formData.medicalHistory || 'Not provided'}</p>
                </Col>
              </Row>
            </>
          ) : (
            <>
              <h6 className="border-bottom pb-2 mt-3">Professional Information</h6>
              <Row className="mb-2">
                <Col md={6}>
                  <strong>Specialty:</strong>
                  <p className="mb-1">{formData.specialty || 'Not provided'}</p>
                </Col>
                <Col md={6}>
                  <strong>Qualification:</strong>
                  <p className="mb-1">{formData.qualification || 'Not provided'}</p>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col md={6}>
                  <strong>Experience:</strong>
                  <p className="mb-1">{formData.experienceYears ? `${formData.experienceYears} years` : 'Not provided'}</p>
                </Col>
                <Col md={6}>
                  <strong>Consultation Fee:</strong>
                  <p className="mb-1">{formData.consultationFee ? `₹${formData.consultationFee}` : 'Not provided'}</p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <strong>About/Bio:</strong>
                  <p className="mb-0">{formData.about || 'Not provided'}</p>
                </Col>
              </Row>
            </>
          )}
        </Card.Body>
      </Card>

      <Alert variant="warning" className="small">
        <strong>Note:</strong> You can update this information anytime from your profile settings.
        {userType === 'doctor' && ' Complete profiles get more patient appointments.'}
      </Alert>

      <div className="d-flex justify-content-between align-items-center">
        <div>
          <small className="text-muted">Step 3 of 3</small>
        </div>
        <div>
          <Button variant="outline-secondary" onClick={onBack} className="me-2">
            ← Back
          </Button>
          <Button variant="outline-primary" onClick={onSkip} className="me-2">
            Skip for Now
          </Button>
          <Button variant="success" type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Complete Profile ✓'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileWizard;