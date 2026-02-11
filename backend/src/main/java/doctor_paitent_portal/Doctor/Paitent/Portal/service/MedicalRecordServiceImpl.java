package doctor_paitent_portal.Doctor.Paitent.Portal.service;

import doctor_paitent_portal.Doctor.Paitent.Portal.dto.MedicalRecordRequest;
import doctor_paitent_portal.Doctor.Paitent.Portal.entity.Doctor;
import doctor_paitent_portal.Doctor.Paitent.Portal.entity.MedicalRecord;
import doctor_paitent_portal.Doctor.Paitent.Portal.entity.Patient;
import doctor_paitent_portal.Doctor.Paitent.Portal.repository.MedicalRecordRepository;
import doctor_paitent_portal.Doctor.Paitent.Portal.repository.DoctorRepository;
import doctor_paitent_portal.Doctor.Paitent.Portal.repository.PatientRepository;
import doctor_paitent_portal.Doctor.Paitent.Portal.service.MedicalRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicalRecordServiceImpl implements MedicalRecordService {

    private final MedicalRecordRepository recordRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    @Override
    public MedicalRecord addRecord(MedicalRecordRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        MedicalRecord record = new MedicalRecord();
        record.setPatient(patient);
        record.setDoctor(doctor);
        record.setVisitDate(request.getVisitDate());
        record.setSymptoms(request.getSymptoms());
        record.setDiagnosis(request.getDiagnosis());
        record.setPrescription(request.getPrescription());
        record.setTestResults(request.getTestResults());
        record.setNotes(request.getNotes());
        record.setBloodPressure(request.getBloodPressure());
        record.setTemperature(request.getTemperature());
        record.setHeartRate(request.getHeartRate());
        record.setWeight(request.getWeight());

        return recordRepository.save(record);
    }

    @Override
    public List<MedicalRecord> getPatientRecords(Long patientId) {
        return recordRepository.findByPatientIdOrderByVisitDateDesc(patientId);
    }

    @Override
    public List<MedicalRecord> getDoctorRecords(Long doctorId) {
        return recordRepository.findByDoctorIdOrderByVisitDateDesc(doctorId);
    }

    @Override
    public MedicalRecord getRecordById(Long id) {
        return recordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medical record not found"));
    }

    @Override
    public MedicalRecord updateRecord(Long id, MedicalRecordRequest request) {
        MedicalRecord existing = getRecordById(id);

        existing.setVisitDate(
                request.getVisitDate() != null ? request.getVisitDate() : existing.getVisitDate()
        );
        existing.setSymptoms(request.getSymptoms());
        existing.setDiagnosis(request.getDiagnosis());
        existing.setPrescription(request.getPrescription());
        existing.setTestResults(request.getTestResults());
        existing.setNotes(request.getNotes());
        existing.setBloodPressure(request.getBloodPressure());
        existing.setTemperature(request.getTemperature());
        existing.setHeartRate(request.getHeartRate());
        existing.setWeight(request.getWeight());

        return recordRepository.save(existing);
    }

    @Override
    public List<MedicalRecord> getAllRecords() {
        return recordRepository.findAll();
    }

    @Override
    public List<MedicalRecord> getRecordsByDoctorAndPatient(Long doctorId, Long patientId) {
        return recordRepository.findByDoctorIdAndPatientId(doctorId, patientId);
    }
}
