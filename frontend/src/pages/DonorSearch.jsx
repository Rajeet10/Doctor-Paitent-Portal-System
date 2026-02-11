import React, { useState } from 'react';
import { Card, Row, Col, Form, Button, Table, Alert } from 'react-bootstrap';
import { donorService } from '../services/donorService';

const DonorSearch = () => {
  const [form, setForm] = useState({ bloodGroup: '', organ: '', city: '', state: '' });
  const [list, setList] = useState([]);
  const [msg, setMsg] = useState('');

  const search = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const params = {};
      if (form.bloodGroup) params.bloodGroup = form.bloodGroup;
      if (form.organ) params.organ = form.organ;
      if (form.city) params.city = form.city;
      if (form.state) params.state = form.state;
      const res = await donorService.search(params);
      setList(Array.isArray(res.data) ? res.data : (res.data?.data || []));
      if ((Array.isArray(res.data) ? res.data : (res.data?.data || [])).length === 0) {
        setMsg('No donors found for given criteria.');
      }
    } catch (e) {
      setMsg(e.response?.data?.message || 'Search failed');
    }
  };

  return (
    <div>
      <h2 className="mb-4">Organ Donor Search</h2>
      {msg && <Alert variant="info">{msg}</Alert>}

      <Card className="mb-4">
        <Card.Body>
          <Form onSubmit={search}>
            <Row className="g-3">
              <Col md={3}><Form.Control placeholder="Blood Group (e.g., O+)" value={form.bloodGroup} onChange={e=>setForm({...form,bloodGroup:e.target.value})} /></Col>
              <Col md={3}><Form.Control placeholder="Organ (e.g., Kidney)" value={form.organ} onChange={e=>setForm({...form,organ:e.target.value})} /></Col>
              <Col md={3}><Form.Control placeholder="City" value={form.city} onChange={e=>setForm({...form,city:e.target.value})} /></Col>
              <Col md={3}><Form.Control placeholder="State" value={form.state} onChange={e=>setForm({...form,state:e.target.value})} /></Col>
              <Col md={12}><Button type="submit">Search</Button></Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <Table hover responsive>
            <thead>
              <tr>
                <th>Name</th><th>Blood Group</th><th>Organs</th><th>City</th><th>State</th><th>Contact</th>
              </tr>
            </thead>
            <tbody>
              {list.map(d => (
                <tr key={d.id}>
                  <td>{d.name}</td>
                  <td>{d.bloodGroup}</td>
                  <td>{d.organsToDonate}</td>
                  <td>{d.city || '-'}</td>
                  <td>{d.state || '-'}</td>
                  <td>{d.contactNumber}</td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr><td colSpan="6" className="text-center">No results</td></tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default DonorSearch;
