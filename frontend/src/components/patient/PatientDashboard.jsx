import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Table } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { patientService } from '../../services/patientService';

const PatientDashboard = () => {
  const { user } = useAuth();
  const patientId = user?.id;
  const [appointments, setAppointments] = useState([]);
  const [recordCount, setRecordCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patientId) return;
    let mounted = true;
    (async () => {
      try {
        const [apptRes, recRes] = await Promise.all([
          patientService.getAppointments(patientId),
          patientService.getRecords(patientId),
        ]);
        const appts = Array.isArray(apptRes.data) ? apptRes.data : (apptRes.data?.data || []);
        const recs = Array.isArray(recRes.data) ? recRes.data : (recRes.data?.data || []);
        if (mounted) {
          setAppointments(appts.slice(0, 5));
          setRecordCount(recs.length);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [patientId]);

  return (
    <div>
      <h2 className="mb-4">Patient Dashboard</h2>

      <Row className="mb-4">
        <Col md={4} className="mb-3">
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Upcoming Appointments</Card.Title>
              <Card.Text className="fs-2">{loading ? '...' : appointments.length}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Medical Records</Card.Title>
              <Card.Text className="fs-2">{loading ? '...' : recordCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Prescriptions</Card.Title>
              <Card.Text className="fs-2">—</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={8}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">My Appointments</h5>
            </Card.Header>
            <Card.Body>
              <Table striped hover>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Doctor</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(loading ? [] : appointments).map(a => (
                    <tr key={a.id}>
                      <td>{a.appointmentDate}</td>
                      <td>{a.appointmentTime}</td>
                      <td>{a.doctor?.name}</td>
                      <td>{a.status}</td>
                    </tr>
                  ))}
                  {!loading && appointments.length === 0 && (
                    <tr><td colSpan="4" className="text-center">No upcoming appointments</td></tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body className="d-grid gap-2">
              <Button variant="primary" href="/appointments/book">Book Appointment</Button>
              <Button variant="success" href="/records">View Medical History</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PatientDashboard;
