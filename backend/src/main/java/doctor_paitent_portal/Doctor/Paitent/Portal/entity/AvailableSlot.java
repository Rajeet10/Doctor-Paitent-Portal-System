package doctor_paitent_portal.Doctor.Paitent.Portal.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "available_slots")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvailableSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "appointments", "availableSlots", "medicalRecords"})
    private Doctor doctor;

    @Column(nullable = false)
    private LocalDate slotDate;

    @Column(nullable = false)
    private LocalTime slotTime;

    @Column(nullable = false)
    private Boolean isAvailable = true;

    private Integer durationMinutes = 30;
}