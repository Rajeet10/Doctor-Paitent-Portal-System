package doctor_paitent_portal.Doctor.Paitent.Portal.service;

import doctor_paitent_portal.Doctor.Paitent.Portal.dto.MedicalRecordRequest;
import doctor_paitent_portal.Doctor.Paitent.Portal.entity.MedicalRecord;

import java.util.List;

public interface MedicalRecordService {
    MedicalRecord addRecord(MedicalRecordRequest request);
    List<MedicalRecord> getPatientRecords(Long patientId);
    List<MedicalRecord> getDoctorRecords(Long doctorId);
    MedicalRecord getRecordById(Long id);
    MedicalRecord updateRecord(Long id, MedicalRecordRequest request);
    List<MedicalRecord> getAllRecords();
    List<MedicalRecord> getRecordsByDoctorAndPatient(Long doctorId, Long patientId);
}
