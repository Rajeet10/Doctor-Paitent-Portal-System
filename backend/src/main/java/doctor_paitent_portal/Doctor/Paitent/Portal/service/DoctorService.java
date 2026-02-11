package doctor_paitent_portal.Doctor.Paitent.Portal.service;


import doctor_paitent_portal.Doctor.Paitent.Portal.entity.AvailableSlot;
import doctor_paitent_portal.Doctor.Paitent.Portal.entity.Doctor;

import java.util.List;

public interface DoctorService {
    List<Doctor> getAllDoctors();
    Doctor getDoctorById(Long id);
    List<Doctor> getDoctorsBySpecialty(String specialty);
    Doctor updateDoctor(Long id, Doctor doctor);
    AvailableSlot addSlot(AvailableSlot slot);
    List<AvailableSlot> getDoctorSlots(Long id);
    List<AvailableSlot> getAvailableSlots(Long id);
}
