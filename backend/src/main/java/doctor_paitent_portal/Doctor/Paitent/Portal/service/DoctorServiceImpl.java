package doctor_paitent_portal.Doctor.Paitent.Portal.service;

import doctor_paitent_portal.Doctor.Paitent.Portal.entity.AvailableSlot;
import doctor_paitent_portal.Doctor.Paitent.Portal.entity.Doctor;
import doctor_paitent_portal.Doctor.Paitent.Portal.repository.AvailableSlotRepository;
import doctor_paitent_portal.Doctor.Paitent.Portal.repository.DoctorRepository;
import doctor_paitent_portal.Doctor.Paitent.Portal.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;
    private final AvailableSlotRepository slotRepository;

    @Override
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    @Override
    public Doctor getDoctorById(Long id) {
        return doctorRepository.findById(id).orElseThrow(() -> new RuntimeException("Doctor not found"));
    }

    @Override
    public List<Doctor> getDoctorsBySpecialty(String specialty) {
        return doctorRepository.findBySpecialtyContainingIgnoreCase(specialty);
    }

    @Override
    public Doctor updateDoctor(Long id, Doctor doctor) {
        Doctor existing = getDoctorById(id);
        if (doctor.getName() != null && !doctor.getName().trim().isEmpty()) {
            existing.setName(doctor.getName());
        }
        if (doctor.getPhone() != null && !doctor.getPhone().trim().isEmpty()) {
            existing.setPhone(doctor.getPhone());
        }
        if (doctor.getQualification() != null && !doctor.getQualification().trim().isEmpty()) {
            existing.setQualification(doctor.getQualification());
        }
        if (doctor.getSpecialty() != null && !doctor.getSpecialty().trim().isEmpty()) {
            existing.setSpecialty(doctor.getSpecialty());
        }
        if (doctor.getExperienceYears() != null) {
            existing.setExperienceYears(doctor.getExperienceYears());
        }
        if (doctor.getAbout() != null && !doctor.getAbout().trim().isEmpty()) {
            existing.setAbout(doctor.getAbout());
        }
        if (doctor.getConsultationFee() != null) {
            existing.setConsultationFee(doctor.getConsultationFee());
        }
        if (doctor.getLicenseNumber() != null && !doctor.getLicenseNumber().trim().isEmpty()) {
            existing.setLicenseNumber(doctor.getLicenseNumber());
        }

        return doctorRepository.save(existing);
    }

    @Override
    public AvailableSlot addSlot(AvailableSlot slot) {
        // slot.doctor should be set by controller before calling this method (controller already does that)
        return slotRepository.save(slot);
    }

    @Override
    public List<AvailableSlot> getDoctorSlots(Long id) {
        return slotRepository.findByDoctorId(id);
    }

    @Override
    public List<AvailableSlot> getAvailableSlots(Long id) {
        return slotRepository.findByDoctorIdAndIsAvailableTrue(id);
    }
}
