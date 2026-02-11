package doctor_paitent_portal.Doctor.Paitent.Portal.repository;


import doctor_paitent_portal.Doctor.Paitent.Portal.entity.MedicalRecord;
import doctor_paitent_portal.Doctor.Paitent.Portal.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {
    List<MedicalRecord> findByPatientId(Long patientId);
    List<MedicalRecord> findByDoctorId(Long doctorId);
    List<MedicalRecord> findByPatientIdOrderByVisitDateDesc(Long patientId);
    List<MedicalRecord> findByDoctorIdOrderByVisitDateDesc(Long doctorId);
    List<MedicalRecord> findByVisitDateBetween(LocalDate startDate, LocalDate endDate);
//    List<MedicalRecord> findByPatientIdAndDoctorId(Long patientId, Long doctorId);
    List<MedicalRecord> findByDoctorIdAndPatientId(Long doctorId, Long patientId);

    @Query("select distinct mr.patient from MedicalRecord mr where mr.doctor.id = :doctorId")
    List<Patient> findDistinctPatientsByDoctorId(@Param("doctorId") Long doctorId);
}
