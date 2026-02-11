import React, { useEffect, useState } from 'react';
import { Card, Button, Table, Row, Col, Form, Alert } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { doctorService } from '../../services/doctorService';

const ManageSlots = () => {
  const { user } = useAuth();
  const doctorId = user?.id;
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState({ slotDate: '', slotTime: '', durationMinutes: 30 });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const load = async () => {
    const res = await doctorService.getSlots(doctorId);
    setSlots(Array.isArray(res.data) ? res.data : (res.data?.data || []));
  };

  useEffect(() => { if (doctorId) load(); }, [doctorId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setMsg('');
    setLoading(true);
    try {
      await doctorService.addSlot(doctorId, {
        slotDate: form.slotDate,
        slotTime: form.slotTime,
        isAvailable: true,
        durationMinutes: Number(form.durationMinutes || 30),
      });
      setForm({ slotDate: '', slotTime: '', durationMinutes: 30 });
      await load();
      setMsg('Slot added successfully.');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to add slot');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4">Manage Slots</h2>

      {msg && <Alert variant="info">{msg}</Alert>}

      <Card className="mb-4">
        <Card.Header>Add New Slot</Card.Header>
        <Card.Body>
          <Form onSubmit={handleAdd}>
            <Row className="g-3">
              <Col md={4}>
                <Form.Control type="date" value={form.slotDate}
                  onChange={e => setForm({ ...form, slotDate: e.target.value })} required />
              </Col>
              <Col md={4}>
                <Form.Control type="time" value={form.slotTime}
                  onChange={e => setForm({ ...form, slotTime: e.target.value })} required />
              </Col>
              <Col md={2}>
                <Form.Control type="number" min="5" step="5" value={form.durationMinutes}
                  onChange={e => setForm({ ...form, durationMinutes: e.target.value })} />
              </Col>
              <Col md={2}>
                <Button type="submit" className="w-100" disabled={loading}>
                  {loading ? 'Adding...' : 'Add'}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>All Slots</Card.Header>
        <Card.Body>
          <Table hover responsive>
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Duration</th>
                <th>Available</th>
              </tr>
            </thead>
            <tbody>
              {slots.map(s => (
                <tr key={s.id}>
                  <td>{s.slotDate}</td>
                  <td>{s.slotTime}</td>
                  <td>{s.durationMinutes} min</td>
                  <td>{s.isAvailable ? 'Yes' : 'No'}</td>
                </tr>
              ))}
              {slots.length === 0 && (
                <tr><td colSpan="4" className="text-center">No slots yet</td></tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ManageSlots;
