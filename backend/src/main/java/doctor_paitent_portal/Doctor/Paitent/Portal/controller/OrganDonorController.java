package doctor_paitent_portal.Doctor.Paitent.Portal.controller;


import doctor_paitent_portal.Doctor.Paitent.Portal.dto.ApiResponse;
import doctor_paitent_portal.Doctor.Paitent.Portal.entity.OrganDonor;
import doctor_paitent_portal.Doctor.Paitent.Portal.service.OrganDonorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donors")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class OrganDonorController {

    private final OrganDonorService donorService;

    @PostMapping
    public ResponseEntity<?> registerDonor(@RequestBody OrganDonor donor) {
        try {
            OrganDonor saved = donorService.registerDonor(donor);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(true, "Donor registered successfully", saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Registration failed: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<OrganDonor>> getAllDonors() {
        return ResponseEntity.ok(donorService.getAllDonors());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDonorById(@PathVariable Long id) {
        try {
            OrganDonor donor = donorService.getDonorById(id);
            return ResponseEntity.ok(donor);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<OrganDonor>> searchDonors(
            @RequestParam(required = false) String bloodGroup,
            @RequestParam(required = false) String organ,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String state) {

        List<OrganDonor> donors;

        if (bloodGroup != null && organ != null) {
            donors = donorService.searchByBloodGroupAndOrgan(bloodGroup, organ);
        } else if (bloodGroup != null) {
            donors = donorService.searchByBloodGroup(bloodGroup);
        } else if (organ != null) {
            donors = donorService.searchByOrgan(organ);
        } else if (city != null) {
            donors = donorService.searchByCity(city);
        } else if (state != null) {
            donors = donorService.searchByState(state);
        } else {
            donors = donorService.getAllDonors();
        }

        return ResponseEntity.ok(donors);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDonor(@PathVariable Long id, @RequestBody OrganDonor donor) {
        try {
            OrganDonor updated = donorService.updateDonor(id, donor);
            return ResponseEntity.ok(new ApiResponse(true, "Donor information updated successfully", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Update failed: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deactivateDonor(@PathVariable Long id) {
        try {
            donorService.deactivateDonor(id);
            return ResponseEntity.ok(new ApiResponse(true, "Donor deactivated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Deactivation failed: " + e.getMessage()));
        }
    }
}