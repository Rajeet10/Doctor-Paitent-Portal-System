package doctor_paitent_portal.Doctor.Paitent.Portal.service;

import doctor_paitent_portal.Doctor.Paitent.Portal.entity.Patient;

import java.util.List;

public interface PatientService {
    List<Patient> getAllPatients();
    Patient getPatientById(Long id);
    Patient updatePatient(Long id, Patient patient);
    Long getActivePatientCount();
}
