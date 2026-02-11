package doctor_paitent_portal.Doctor.Paitent.Portal.repository;


import doctor_paitent_portal.Doctor.Paitent.Portal.entity.AvailableSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AvailableSlotRepository extends JpaRepository<AvailableSlot, Long> {
    List<AvailableSlot> findByDoctorId(Long doctorId);
    List<AvailableSlot> findByDoctorIdAndIsAvailableTrue(Long doctorId);
    List<AvailableSlot> findByDoctorIdAndSlotDate(Long doctorId, LocalDate date);
    List<AvailableSlot> findBySlotDateAndIsAvailableTrue(LocalDate date);
    Optional<AvailableSlot> findByDoctorIdAndSlotDateAndSlotTime(Long doctorId, LocalDate date, LocalTime time);
    List<AvailableSlot> findByDoctorIdAndSlotDateAndIsAvailableTrue(Long doctorId, LocalDate date);
    Optional<AvailableSlot> findByDoctorIdAndSlotDateAndSlotTimeAndIsAvailableTrue(
            Long doctorId,
            LocalDate slotDate,
            LocalTime slotTime
    );
}
