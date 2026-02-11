package doctor_paitent_portal.Doctor.Paitent.Portal.repository;

import doctor_paitent_portal.Doctor.Paitent.Portal.entity.OrganDonor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrganDonorRepository extends JpaRepository<OrganDonor, Long> {
    List<OrganDonor> findByBloodGroup(String bloodGroup);
    List<OrganDonor> findByCity(String city);
    List<OrganDonor> findByState(String state);
    List<OrganDonor> findByIsActiveTrue();
    List<OrganDonor> findByBloodGroupAndIsActiveTrue(String bloodGroup);

    @Query("SELECT o FROM OrganDonor o WHERE o.organsToDonate LIKE %:organ% AND o.isActive = true")
    List<OrganDonor> findByOrganType(@Param("organ") String organ);

    @Query("SELECT o FROM OrganDonor o WHERE o.bloodGroup = :bloodGroup AND o.organsToDonate LIKE %:organ% AND o.isActive = true")
    List<OrganDonor> findByBloodGroupAndOrgan(@Param("bloodGroup") String bloodGroup, @Param("organ") String organ);
}