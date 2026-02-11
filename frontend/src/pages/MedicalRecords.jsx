import React, { useEffect, useState } from 'react';
import { Card, Table, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { recordService } from '../services/recordService';

const MedicalRecords = () => {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    (async () => {
      try {
        if (user?.role === 'DOCTOR') {
          const res = await recordService.getByDoctor(user.id);
          setList(Array.isArray(res.data) ? res.data : (res.data?.data || []));
        } else if (user?.role === 'PATIENT') {
          const res = await recordService.getByPatient(user.id);
          setList(Array.isArray(res.data) ? res.data : (res.data?.data || []));
        } else {
          setMsg('Only doctors or patients can view records here.');
        }
      } catch (e) {
        setMsg(e.response?.data?.message || 'Failed to load records');
      }
    })();
  }, [user]);

  return (
    <div>
      <h2 className="mb-4">Medical Records</h2>
      {msg && <Alert variant="warning">{msg}</Alert>}

      <Card>
        <Card.Body>
          <Table hover responsive>
            <thead>
              <tr>
                <th>Date</th>
                <th>Doctor</th>
                <th>Patient</th>
                <th>Diagnosis</th>
                <th>Prescription</th>
              </tr>
            </thead>
            <tbody>
              {list.map(r => (
                <tr key={r.id}>
                  <td>{r.visitDate}</td>
                  <td>{r.doctor?.name}</td>
                  <td>{r.patient?.name}</td>
                  <td>{r.diagnosis || '-'}</td>
                  <td>{r.prescription || '-'}</td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr><td colSpan="5" className="text-center">No records</td></tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default MedicalRecords;
