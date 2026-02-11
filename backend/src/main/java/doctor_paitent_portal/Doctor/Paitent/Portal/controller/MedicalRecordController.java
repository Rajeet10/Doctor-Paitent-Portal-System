package doctor_paitent_portal.Doctor.Paitent.Portal.controller;


import doctor_paitent_portal.Doctor.Paitent.Portal.dto.ApiResponse;
import doctor_paitent_portal.Doctor.Paitent.Portal.dto.MedicalRecordRequest;
import doctor_paitent_portal.Doctor.Paitent.Portal.entity.MedicalRecord;
import doctor_paitent_portal.Doctor.Paitent.Portal.service.MedicalRecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/records")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class MedicalRecordController {

    private final MedicalRecordService recordService;


    @PostMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> addRecord(@Valid @RequestBody MedicalRecordRequest request) {
        try {
            MedicalRecord record = recordService.addRecord(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(true, "Medical record added successfully", record));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Failed to add record: " + e.getMessage()));
        }
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasRole('PATIENT') or hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<List<MedicalRecord>> getPatientRecords(@PathVariable Long patientId) {
        return ResponseEntity.ok(recordService.getPatientRecords(patientId));
    }

    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<List<MedicalRecord>> getDoctorRecords(@PathVariable Long doctorId) {
        return ResponseEntity.ok(recordService.getDoctorRecords(doctorId));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('PATIENT') or hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<?> getRecordById(@PathVariable Long id) {
        try {
            MedicalRecord record = recordService.getRecordById(id);
            return ResponseEntity.ok(record);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> updateRecord(@PathVariable Long id,
                                          @Valid @RequestBody MedicalRecordRequest request) {
        try {
            MedicalRecord updated = recordService.updateRecord(id, request);
            return ResponseEntity.ok(new ApiResponse(true, "Medical record updated successfully", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Update failed: " + e.getMessage()));
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<MedicalRecord>> getAllRecords() {
        return ResponseEntity.ok(recordService.getAllRecords());
    }

    @GetMapping("/doctor/{doctorId}/patient/{patientId}")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<List<MedicalRecord>> getRecordsForDoctorAndPatient(
            @PathVariable Long doctorId,
            @PathVariable Long patientId) {
        return ResponseEntity.ok(recordService.getRecordsByDoctorAndPatient(doctorId, patientId));
    }
}