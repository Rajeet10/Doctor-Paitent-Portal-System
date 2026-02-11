import React, { useEffect, useMemo, useState } from 'react';
import { Row, Col, Card, Button, Table } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { doctorService } from '../../services/doctorService';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const doctorId = user?.id;
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [availCount, setAvailCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const todayISO = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  useEffect(() => {
    if (!doctorId) return;
    let mounted = true;
    (async () => {
      try {
        const [apptRes, availRes] = await Promise.all([
          doctorService.getAppointments(doctorId),
          doctorService.getAvailableSlots(doctorId),
        ]);
        const appts = Array.isArray(apptRes.data) ? apptRes.data : (apptRes.data?.data || []);
        const todays = appts.filter(a => a.appointmentDate === todayISO);
        if (mounted) {
          setTodayAppointments(todays);
          setAvailCount(Array.isArray(availRes.data) ? availRes.data.length : (availRes.data?.data?.length || 0));
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [doctorId, todayISO]);

  return (
    <div>
      <h2 className="mb-4">Doctor Dashboard</h2>

      <Row className="mb-4">
        <Col md={4} className="mb-3">
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Today's Appointments</Card.Title>
              <Card.Text className="fs-2">{loading ? '...' : todayAppointments.length}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Patients Today</Card.Title>
              <Card.Text className="fs-2">{loading ? '...' : new Set(todayAppointments.map(a => a.patient?.id)).size}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Available Slots</Card.Title>
              <Card.Text className="fs-2">{loading ? '...' : availCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={8}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Today's Schedule</h5>
            </Card.Header>
            <Card.Body>
              <Table striped hover>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Patient</th>
                    <th>Reason</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(loading ? [] : todayAppointments).map(a => (
                    <tr key={a.id}>
                      <td>{a.appointmentTime}</td>
                      <td>{a.patient?.name || a.patient?.email}</td>
                      <td>{a.reason || '-'}</td>
                      <td>{a.status}</td>
                    </tr>
                  ))}
                  {!loading && todayAppointments.length === 0 && (
                    <tr><td colSpan="4" className="text-center">No appointments today</td></tr>
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
              <Button variant="primary" href="/doctor/appointments">View Appointments</Button>
              <Button variant="success" href="/doctor/slots">Manage Schedule</Button>
              <Button variant="info" href="/records">Patient Records</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DoctorDashboard;
