package doctor_paitent_portal.Doctor.Paitent.Portal.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "doctors")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@PrimaryKeyJoinColumn(name = "user_id")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Doctor extends User {

    @Column(nullable = false)
    private String specialty;

    @Column(nullable = false)
    private String qualification;

    @Column(nullable = false)
    private Integer experienceYears;

    private String licenseNumber;

    @Column(length = 1000)
    private String about;

    private Double consultationFee;

    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"doctor", "patient"})
    private List<AvailableSlot> availableSlots = new ArrayList<>();

    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"doctor", "patient"})
    private List<Appointment> appointments = new ArrayList<>();

    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"doctor", "patient"})
    private List<MedicalRecord> medicalRecords = new ArrayList<>();
}