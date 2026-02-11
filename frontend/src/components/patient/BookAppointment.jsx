import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { doctorService } from '../../services/doctorService';
import { appointmentService } from '../../services/appointmentService';

const BookAppointment = () => {
  const { user } = useAuth();
  const patientId = user?.id;

  const [doctors, setDoctors] = useState([]);
  const [available, setAvailable] = useState([]);
  const [form, setForm] = useState({ doctorId: '', appointmentDate: '', appointmentTime: '', reason: '' });
  const [msg, setMsg] = useState('');

  useEffect(() => { (async () => {
    const res = await doctorService.getAll();
    setDoctors(Array.isArray(res.data) ? res.data : (res.data?.data || []));
  })(); }, []);

  useEffect(() => {
    (async () => {
      if (!form.doctorId) return setAvailable([]);
      // if date is chosen, try fetching filtered by date or client filter
      const res = await doctorService.getAvailableSlots(form.doctorId);
      const slots = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      const filtered = form.appointmentDate
        ? slots.filter(s => s.slotDate === form.appointmentDate)
        : slots;
      setAvailable(filtered);
    })();
  }, [form.doctorId, form.appointmentDate]);

  const submit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await appointmentService.book({
        doctorId: Number(form.doctorId),
        patientId: Number(patientId),
        appointmentDate: form.appointmentDate,
        appointmentTime: form.appointmentTime,
        reason: form.reason || '',
      });
      setMsg('Appointment booked successfully.');
      setForm({ doctorId: '', appointmentDate: '', appointmentTime: '', reason: '' });
      setAvailable([]);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Booking failed');
    }
  };

  return (
    <div>
      <h2 className="mb-4">Book Appointment</h2>
      {msg && <Alert variant={msg.includes('successfully') ? 'success' : 'danger'}>{msg}</Alert>}

      <Card>
        <Card.Body>
          <Form onSubmit={submit}>
            <Row className="g-3">
              <Col md={4}>
                <Form.Select value={form.doctorId} onChange={e => setForm({ ...form, doctorId: e.target.value })} required>
                  <option value="">Select Doctor</option>
                  {doctors.map(d => <option key={d.id} value={d.id}>{d.name} — {d.specialty || 'General'}</option>)}
                </Form.Select>
              </Col>
              <Col md={4}>
                <Form.Control type="date" value={form.appointmentDate}
                  onChange={e => setForm({ ...form, appointmentDate: e.target.value })} required />
              </Col>
              <Col md={4}>
                <Form.Select value={form.appointmentTime}
                  onChange={e => setForm({ ...form, appointmentTime: e.target.value })} required>
                  <option value="">Select Time</option>
                  {available
                    .filter(s => s.slotDate === form.appointmentDate)
                    .map(s => <option key={s.id} value={s.slotTime}>{s.slotTime}</option>)}
                </Form.Select>
              </Col>
              <Col md={12}>
                <Form.Control as="textarea" rows={3} placeholder="Reason (optional)"
                  value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} />
              </Col>
              <Col md={12}>
                <Button type="submit">Book</Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default BookAppointment;
