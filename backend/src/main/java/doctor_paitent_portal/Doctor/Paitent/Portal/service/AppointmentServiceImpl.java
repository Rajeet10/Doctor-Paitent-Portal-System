package doctor_paitent_portal.Doctor.Paitent.Portal.service;

import doctor_paitent_portal.Doctor.Paitent.Portal.dto.AppointmentRequest;
import doctor_paitent_portal.Doctor.Paitent.Portal.entity.Appointment;
import doctor_paitent_portal.Doctor.Paitent.Portal.entity.AvailableSlot;
import doctor_paitent_portal.Doctor.Paitent.Portal.entity.Doctor;
import doctor_paitent_portal.Doctor.Paitent.Portal.entity.Patient;
import doctor_paitent_portal.Doctor.Paitent.Portal.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Set;
import java.util.HashSet;
import java.util.ArrayList;


@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final AvailableSlotRepository slotRepository;
    private final MedicalRecordRepository medicalRecordRepository;

    @Override
    @Transactional
    public Appointment bookAppointment(AppointmentRequest request) {
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        // ✅ 1. Only pick a free slot
        AvailableSlot slot = slotRepository
                .findByDoctorIdAndSlotDateAndSlotTimeAndIsAvailableTrue(
                        doctor.getId(),
                        request.getAppointmentDate(),
                        request.getAppointmentTime()
                )
                .orElseThrow(() -> new RuntimeException("Requested slot is not available"));

        // ✅ 2. Create appointment
        Appointment appointment = new Appointment();
        appointment.setDoctor(doctor);
        appointment.setPatient(patient);
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setAppointmentTime(request.getAppointmentTime());
        appointment.setReason(request.getReason());

        // You can use CONFIRMED if you want:
        appointment.setStatus(Appointment.AppointmentStatus.PENDING);
        // or keep PENDING depending on your flow:
        // appointment.setStatus(Appointment.AppointmentStatus.PENDING);

        // ✅ 3. Mark slot unavailable
        slot.setIsAvailable(false);
        slotRepository.save(slot);

        return appointmentRepository.save(appointment);
    }


    @Override
    public List<Appointment> getAppointmentsByDoctor(Long doctorId) {
        return appointmentRepository.findByDoctorIdOrderByAppointmentDateAsc(doctorId);
    }

    @Override
    public List<Appointment> getAppointmentsByPatient(Long patientId) {
        return appointmentRepository.findByPatientIdOrderByAppointmentDateDesc(patientId);
    }

    @Override
    public Appointment getAppointmentById(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
    }

    @Override
    @Transactional
    public Appointment updateAppointmentStatus(Long id, Appointment.AppointmentStatus status) {
        Appointment ap = getAppointmentById(id);
        ap.setStatus(status);
        return appointmentRepository.save(ap);
    }

    @Override
    @Transactional
    public void cancelAppointment(Long id) {
        Appointment ap = getAppointmentById(id);
        ap.setStatus(Appointment.AppointmentStatus.CANCELLED);

        // Free up the slot if exists
        slotRepository.findByDoctorIdAndSlotDateAndSlotTime(
                ap.getDoctor().getId(), ap.getAppointmentDate(), ap.getAppointmentTime()
        ).ifPresent(s -> {
            s.setIsAvailable(true);
            slotRepository.save(s);
        });

        appointmentRepository.save(ap);
    }

    @Override
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    @Override
    public List<Patient> getPatientsForDoctor(Long doctorId) {
        Set<Long> seenIds = new HashSet<>();
        List<Patient> result = new ArrayList<>();

        // 1️⃣ Patients from appointments
        List<Patient> fromAppointments = appointmentRepository.findDistinctPatientsByDoctorId(doctorId);
        if (fromAppointments != null) {
            for (Patient p : fromAppointments) {
                if (p != null && seenIds.add(p.getId())) {
                    result.add(p);
                }
            }
        }

        // 2️⃣ Patients from medical records
        List<Patient> fromRecords = medicalRecordRepository.findDistinctPatientsByDoctorId(doctorId);
        if (fromRecords != null) {
            for (Patient p : fromRecords) {
                if (p != null && seenIds.add(p.getId())) {
                    result.add(p);
                }
            }
        }

        return result;
    }

}
