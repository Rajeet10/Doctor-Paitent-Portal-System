import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { patientService } from '../services/patientService';
import { appointmentService } from '../services/appointmentService';

const MyAppointments = () => {
  const { user } = useAuth();
  const patientId = user?.id;
  const [list, setList] = useState([]);
  const [msg, setMsg] = useState('');

  const load = async () => {
    const res = await patientService.getAppointments(patientId);
    setList(Array.isArray(res.data) ? res.data : (res.data?.data || []));
  };

  useEffect(() => { if (patientId) load(); }, [patientId]);

  const cancel = async (id) => {
    try {
      await appointmentService.cancel(id);
      setMsg('Appointment cancelled');
      await load();
    } catch (e) {
      setMsg(e.response?.data?.message || 'Failed to cancel');
    }
  };

  return (
    <div>
      <h2 className="mb-4">My Appointments</h2>
      {msg && <Alert variant={msg.includes('cancelled') ? 'success' : 'danger'}>{msg}</Alert>}

      <Card>
        <Card.Body>
          <Table hover responsive>
            <thead>
              <tr>
                <th>Date</th><th>Time</th><th>Doctor</th><th>Status</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {list.map(a => (
                <tr key={a.id}>
                  <td>{a.appointmentDate}</td>
                  <td>{a.appointmentTime}</td>
                  <td>{a.doctor?.name}</td>
                  <td>{a.status}</td>
                  <td>
                    {a.status !== 'CANCELLED' && (
                      <Button size="sm" variant="outline-danger" onClick={() => cancel(a.id)}>Cancel</Button>
                    )}
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr><td colSpan="5" className="text-center">No appointments</td></tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default MyAppointments;
