package doctor_paitent_portal.Doctor.Paitent.Portal.service;


import doctor_paitent_portal.Doctor.Paitent.Portal.entity.Patient;
import doctor_paitent_portal.Doctor.Paitent.Portal.repository.PatientRepository;
import doctor_paitent_portal.Doctor.Paitent.Portal.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;

    @Override
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    @Override
    public Patient getPatientById(Long id) {
        return patientRepository.findById(id).orElseThrow(() -> new RuntimeException("Patient not found"));
    }

    @Override
    public Patient updatePatient(Long id, Patient patient) {
        Patient existing = getPatientById(id);
        if (patient.getName() != null && !patient.getName().trim().isEmpty()) {
            existing.setName(patient.getName());
        }
        if (patient.getPhone() != null && !patient.getPhone().trim().isEmpty()) {
            existing.setPhone(patient.getPhone());
        }
        if (patient.getDateOfBirth() != null) {
            existing.setDateOfBirth(patient.getDateOfBirth());
        }
        if (patient.getGender() != null) {
            existing.setGender(patient.getGender());
        }
        if (patient.getBloodGroup() != null && !patient.getBloodGroup().trim().isEmpty()) {
            existing.setBloodGroup(patient.getBloodGroup());
        }
        if (patient.getAddress() != null && !patient.getAddress().trim().isEmpty()) {
            existing.setAddress(patient.getAddress());
        }
        if (patient.getEmergencyContact() != null && !patient.getEmergencyContact().trim().isEmpty()) {
            existing.setEmergencyContact(patient.getEmergencyContact());
        }
        if (patient.getMedicalHistory() != null && !patient.getMedicalHistory().trim().isEmpty()) {
            existing.setMedicalHistory(patient.getMedicalHistory());
        }
        return patientRepository.save(existing);
    }

    @Override
    public Long getActivePatientCount() {
        return patientRepository.countByActiveTrue();
    }
}
