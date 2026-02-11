package doctor_paitent_portal.Doctor.Paitent.Portal.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class MedicalRecordRequest {
    @NotNull(message = "Patient ID is required")
    private Long patientId;

    @NotNull(message = "Doctor ID is required")
    private Long doctorId;

    private LocalDate visitDate;
    private String symptoms;
    private String diagnosis;
    private String prescription;
    private String testResults;
    private String notes;
    private String bloodPressure;
    private Double temperature;
    private Integer heartRate;
    private Double weight;
}