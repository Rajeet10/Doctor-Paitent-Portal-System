package doctor_paitent_portal.Doctor.Paitent.Portal.controller;


import doctor_paitent_portal.Doctor.Paitent.Portal.dto.ApiResponse;
import doctor_paitent_portal.Doctor.Paitent.Portal.entity.AvailableSlot;
import doctor_paitent_portal.Doctor.Paitent.Portal.entity.Doctor;
import doctor_paitent_portal.Doctor.Paitent.Portal.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class DoctorController {

    private final DoctorService doctorService;

    @GetMapping
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDoctorById(@PathVariable Long id) {
        try {
            Doctor doctor = doctorService.getDoctorById(id);
            return ResponseEntity.ok(doctor);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @GetMapping("/specialty/{specialty}")
    public ResponseEntity<List<Doctor>> getDoctorsBySpecialty(@PathVariable String specialty) {
        return ResponseEntity.ok(doctorService.getDoctorsBySpecialty(specialty));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> updateDoctor(@PathVariable Long id, @RequestBody Doctor doctor) {
        try {
            Doctor updated = doctorService.updateDoctor(id, doctor);
            return ResponseEntity.ok(new ApiResponse(true, "Doctor profile updated successfully", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Update failed: " + e.getMessage()));
        }
    }

    @PostMapping("/{id}/slots")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> addSlot(@PathVariable Long id, @RequestBody AvailableSlot slot) {
        try {
            Doctor doctor = doctorService.getDoctorById(id);
            slot.setDoctor(doctor);
            AvailableSlot saved = doctorService.addSlot(slot);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(true, "Slot added successfully", saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Failed to add slot: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}/slots")
    public ResponseEntity<List<AvailableSlot>> getDoctorSlots(@PathVariable Long id) {
        return ResponseEntity.ok(doctorService.getDoctorSlots(id));
    }

    @GetMapping("/{id}/available-slots")
    public ResponseEntity<List<AvailableSlot>> getAvailableSlots(@PathVariable Long id) {
        return ResponseEntity.ok(doctorService.getAvailableSlots(id));
    }
}