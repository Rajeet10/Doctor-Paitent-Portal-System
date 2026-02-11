package doctor_paitent_portal.Doctor.Paitent.Portal.repository;


import doctor_paitent_portal.Doctor.Paitent.Portal.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByEmail(String email);
    Long countByActiveTrue();
    List<Patient> findByActiveTrue();
    List<Patient> findByBloodGroup(String bloodGroup);
}