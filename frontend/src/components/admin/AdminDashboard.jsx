import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { patientService } from '../../services/patientService';
import { doctorService } from '../../services/doctorService';
import { appointmentService } from '../../services/appointmentService';
import { useAuth } from '../../contexts/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [counts, setCounts] = useState({ users: 0, doctors: 0, patients: 0, appointments: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Patients count (backend: /api/patients/count) – allowed for ADMIN/DOCTOR
        const patientCountRes = await patientService.getActiveCount();
        const patients = patientCountRes.data?.data ?? 0;

        // Doctors count — no direct count endpoint; fetch all doctors, take length
        const doctorsRes = await doctorService.getAll();
        const doctors = Array.isArray(doctorsRes.data) ? doctorsRes.data.length : (doctorsRes.data?.data?.length || 0);

        // Users count — not exposed; infer as doctors + patients (approx) or hide
        // If you later add /api/users, replace this calc.
        const users = doctors + patients;

        // Appointments count — ADMIN only endpoint /api/appointments
        let appointments = 0;
        try {
          const apptRes = await appointmentService.getAll();
          const list = Array.isArray(apptRes.data) ? apptRes.data : apptRes.data?.data || [];
          appointments = list.length;
        } catch {
          // If not ADMIN, skip silently
        }

        if (mounted) setCounts({ users, doctors, patients, appointments });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [user]);

  return (
    <div>
      <h2 className="mb-4">Admin Dashboard</h2>

      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Users</Card.Title>
              <Card.Text className="fs-2">{loading ? '...' : counts.users}</Card.Text>
              <Button variant="outline-primary" size="sm">Manage Users</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Doctors</Card.Title>
              <Card.Text className="fs-2">{loading ? '...' : counts.doctors}</Card.Text>
              <Button variant="outline-primary" size="sm">View Doctors</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Patients</Card.Title>
              <Card.Text className="fs-2">{loading ? '...' : counts.patients}</Card.Text>
              <Button variant="outline-primary" size="sm">View Patients</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Appointments</Card.Title>
              <Card.Text className="fs-2">{loading ? '...' : counts.appointments}</Card.Text>
              <Button variant="outline-primary" size="sm">View All</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Leave your “Quick Actions” and “Recent Activity” as-is */}
    </div>
  );
};

export default AdminDashboard;
