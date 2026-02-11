// src/main/resources/static/js/app.js

const API_BASE = ""; // same origin: http://localhost:8080
let currentPatientIdForDoctor = null;

// ========== UTIL ==========

function saveAuth(data) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.id);
    localStorage.setItem("userEmail", data.email);
    localStorage.setItem("userName", data.name);
    localStorage.setItem("userRole", data.role); // PATIENT / DOCTOR / ADMIN
}

function clearAuth() {
    localStorage.clear();
}

function getToken() {
    return localStorage.getItem("token");
}

async function apiFetch(path, options = {}) {
    const token = getToken();
    const headers = options.headers || {};
    headers["Content-Type"] = "application/json";

    if (token) {
        headers["Authorization"] = "Bearer " + token;
    }
    return fetch(API_BASE + path, {
        ...options,
        headers
    });
}

function showAuthForm(type) {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const loginTab = document.getElementById("login-tab");
    const registerTab = document.getElementById("register-tab");

    if (type === "login") {
        loginForm.style.display = "block";
        registerForm.style.display = "none";
        loginTab.classList.add("active");
        registerTab.classList.remove("active");
    } else {
        loginForm.style.display = "none";
        registerForm.style.display = "block";
        loginTab.classList.remove("active");
        registerTab.classList.add("active");
    }
}

// ========== AUTH ==========

async function login(event) {
    event.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    const msg = document.getElementById("login-message");
    msg.textContent = "";

    try {
        const res = await fetch(API_BASE + "/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            msg.textContent = err.message || "Login failed";
            return;
        }

        const data = await res.json(); // JwtResponse
        saveAuth(data);
        showDashboard();
    } catch (e) {
        msg.textContent = "Network error: " + e.message;
    }
}

async function registerUser(event) {
    event.preventDefault();
    const name = document.getElementById("reg-name").value;
    const email = document.getElementById("reg-email").value;
    const phone = document.getElementById("reg-phone").value;
    const password = document.getElementById("reg-password").value;
    const role = document.getElementById("reg-role").value;
    const msg = document.getElementById("register-message");
    msg.textContent = "";

    try {
        const res = await fetch(API_BASE + "/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, phone, password, role })
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok || data.success === false) {
            msg.textContent = data.message || "Registration failed";
            return;
        }

        msg.style.color = "green";
        msg.textContent = "Registered successfully. You can now login.";
        showAuthForm("login");
    } catch (e) {
        msg.textContent = "Network error: " + e.message;
    }
}

function logout() {
    clearAuth();
    document.getElementById("dashboard-section").style.display = "none";
    document.getElementById("auth-section").style.display = "block";
}

// ========== DASHBOARD INITIALIZATION ==========

function showDashboard() {
    const name = localStorage.getItem("userName");
    const email = localStorage.getItem("userEmail");
    const role = localStorage.getItem("userRole");

    if (!getToken()) {
        document.getElementById("auth-section").style.display = "block";
        document.getElementById("dashboard-section").style.display = "none";
        return;
    }

    document.getElementById("auth-section").style.display = "none";
    document.getElementById("dashboard-section").style.display = "block";

    document.getElementById("user-info").textContent =
        `${name} (${email}) - ${role}`;

    document.querySelectorAll(".role-view").forEach(div => div.style.display = "none");

    const title = document.getElementById("dashboard-title");
    const doctorsCard = document.getElementById("doctors-card");

    if (role === "PATIENT") {
        document.getElementById("patient-view").style.display = "block";
        title.textContent = "Patient Dashboard";
        if (doctorsCard) doctorsCard.style.display = "block";
    } else if (role === "DOCTOR") {
        document.getElementById("doctor-view").style.display = "block";
        title.textContent = "Doctor Dashboard";
        // 🔴 hide global doctors table for doctors
        if (doctorsCard) doctorsCard.style.display = "none";
    } else if (role === "ADMIN") {
        document.getElementById("admin-view").style.display = "block";
        title.textContent = "Admin Dashboard";
        if (doctorsCard) doctorsCard.style.display = "block";
    } else {
        title.textContent = "Dashboard";
        if (doctorsCard) doctorsCard.style.display = "block";
    }

    // initial loads
    loadDoctors();
    loadDonors();
    if (role === "PATIENT") {
        loadPatientAppointments();
        loadPatientRecords();
    } else if (role === "DOCTOR") {
        loadDoctorAppointments();
        loadDoctorSlots();
        loadDoctorPatients();   // 🔹 we'll add this function in Step 3
    } else if (role === "ADMIN") {
        loadPatientCount();
        loadAllAppointments();
        loadAllPatients();
    }
}

// ========== DOCTORS ==========

async function loadDoctors() {
    const table = document.getElementById("doctors-table");
    const role = localStorage.getItem("userRole");

    // decide header based on role
    if (role === "PATIENT") {
        table.innerHTML = `
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Specialty</th>
                <th>Experience</th>
                <th>Fee</th>
                <th>Action</th>
            </tr>`;
    } else {
        table.innerHTML = `
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Specialty</th>
                <th>Experience</th>
                <th>Fee</th>
            </tr>`;
    }

    const cols = role === "PATIENT" ? 6 : 5;

    try {
        const res = await apiFetch("/api/doctors");
        if (!res.ok) {
            table.innerHTML += `<tr><td colspan="${cols}">Failed to load doctors</td></tr>`;
            return;
        }

        const doctors = await res.json();
        doctors.forEach(d => {
            if (role === "PATIENT") {
                table.innerHTML += `
                    <tr>
                        <td>${d.id}</td>
                        <td>${d.name}</td>
                        <td>${d.specialty || ""}</td>
                        <td>${d.experienceYears ?? ""}</td>
                        <td>${d.consultationFee ?? ""}</td>
                        <td><button onclick="selectDoctorForSlot(${d.id})">View Slots</button></td>
                    </tr>`;
            } else {
                table.innerHTML += `
                    <tr>
                        <td>${d.id}</td>
                        <td>${d.name}</td>
                        <td>${d.specialty || ""}</td>
                        <td>${d.experienceYears ?? ""}</td>
                        <td>${d.consultationFee ?? ""}</td>
                    </tr>`;
            }
        });
    } catch (e) {
        table.innerHTML += `<tr><td colspan="${cols}">Error: ${e.message}</td></tr>`;
    }
}

function selectDoctorForSlot(doctorId) {
    const slotDoctorInput = document.getElementById("slot-doctor-id");
    const apptDoctorInput = document.getElementById("appt-doctor-id");

    if (slotDoctorInput) slotDoctorInput.value = doctorId;
    if (apptDoctorInput) apptDoctorInput.value = doctorId;

    // auto-load slots for today if a date is already chosen
    loadAvailableSlots();
}

// ========== AVAILABLE SLOTS (PATIENT VIEW) ==========

async function loadAvailableSlots() {
    const doctorId = document.getElementById("slot-doctor-id")?.value;
    const date = document.getElementById("slot-date")?.value;
    const table = document.getElementById("available-slots-table");
    const msg = document.getElementById("slot-check-message");

    if (!table || !msg) return;

    msg.textContent = "";
    table.innerHTML = "<tr><th>ID</th><th>Date</th><th>Time</th><th>Action</th></tr>";

    if (!doctorId) {
        msg.textContent = "Please enter a Doctor ID.";
        return;
    }
    if (!date) {
        msg.textContent = "Please select a date.";
        return;
    }

    try {
        const res = await apiFetch(`/api/doctors/${doctorId}/slots`);
        if (!res.ok) {
            table.innerHTML += `<tr><td colspan="4">Failed to load slots</td></tr>`;
            return;
        }
        const slots = await res.json();

        // Filter by selected date & availability
        const filtered = slots.filter(s => s.slotDate === date && s.isAvailable);

        if (filtered.length === 0) {
            table.innerHTML += `<tr><td colspan="4">No available slots for this date.</td></tr>`;
            return;
        }

        filtered.forEach(s => {
            table.innerHTML += `<tr>
                <td>${s.id}</td>
                <td>${s.slotDate}</td>
                <td>${s.slotTime}</td>
                <td>
                    <button onclick="chooseSlot('${doctorId}', '${s.slotDate}', '${s.slotTime}')">
                        Choose
                    </button>
                </td>
            </tr>`;
        });
    } catch (e) {
        table.innerHTML += `<tr><td colspan="4">Error: ${e.message}</td></tr>`;
    }
}

function chooseSlot(doctorId, date, time) {
    const apptDoctorInput = document.getElementById("appt-doctor-id");
    const apptDateInput = document.getElementById("appt-date");
    const apptTimeInput = document.getElementById("appt-time");

    if (apptDoctorInput) apptDoctorInput.value = doctorId;
    if (apptDateInput) apptDateInput.value = date;
    if (apptTimeInput) apptTimeInput.value = time;

    const msg = document.getElementById("appt-message");
    if (msg) {
        msg.style.color = "green";
        msg.textContent = "Slot selected. Now click 'Book' to confirm.";
    }
}




// ========== APPOINTMENTS (PATIENT) ==========

async function bookAppointment() {
    const doctorId = parseInt(document.getElementById("appt-doctor-id").value);
    const patientId = parseInt(localStorage.getItem("userId"));
    const date = document.getElementById("appt-date").value;
    const time = document.getElementById("appt-time").value;
    const reason = document.getElementById("appt-reason").value;
    const msg = document.getElementById("appt-message");
    msg.textContent = "";

    if (!doctorId || !date || !time) {
        msg.textContent = "Doctor, date and time are required.";
        return;
    }

    try {
        const res = await apiFetch("/api/appointments", {
            method: "POST",
            body: JSON.stringify({
                doctorId,
                patientId,
                appointmentDate: date,
                appointmentTime: time,
                reason
            })
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok || data.success === false) {
            msg.textContent = data.message || "Failed to book appointment";
            return;
        }

        msg.style.color = "green";
        msg.textContent = "Appointment booked successfully.";
        loadPatientAppointments();
    } catch (e) {
        msg.textContent = "Error: " + e.message;
    }
}

async function loadPatientAppointments() {
    const table = document.getElementById("patient-appointments-table");
    table.innerHTML = "<tr><th>ID</th><th>Doctor ID</th><th>Date</th><th>Time</th><th>Status</th><th>Reason</th></tr>";
    const patientId = localStorage.getItem("userId");

    try {
        const res = await apiFetch(`/api/appointments/patient/${patientId}`);
        if (!res.ok) {
            table.innerHTML += `<tr><td colspan="6">Failed to load appointments</td></tr>`;
            return;
        }
        const apps = await res.json();
        apps.forEach(a => {
            table.innerHTML += `<tr>
                <td>${a.id}</td>
                <td>${a.doctor?.id ?? ""}</td>
                <td>${a.appointmentDate}</td>
                <td>${a.appointmentTime}</td>
                <td>${a.status}</td>
                <td>${a.reason ?? ""}</td>
            </tr>`;
        });
    } catch (e) {
        table.innerHTML += `<tr><td colspan="6">Error: ${e.message}</td></tr>`;
    }
}

// ========== APPOINTMENTS (DOCTOR / ADMIN) ==========

async function loadDoctorAppointments() {
    const table = document.getElementById("doctor-appointments-table");
    table.innerHTML = "<tr>" +
        "<th>ID</th>" +
        "<th>Patient ID</th>" +
        "<th>Date</th>" +
        "<th>Time</th>" +
        "<th>Status</th>" +
        "<th>Reason</th>" +
        "<th>Actions</th>" +
        "</tr>";

    const doctorId = localStorage.getItem("userId");

    try {
        const res = await apiFetch(`/api/appointments/doctor/${doctorId}`);
        if (!res.ok) {
            table.innerHTML += `<tr><td colspan="7">Failed to load appointments</td></tr>`;
            return;
        }
        const apps = await res.json();
        apps.forEach(a => {
            // simple logic: what buttons should be enabled for each status
            const status = a.status;
            let buttonsHtml = "";

            if (status === "PENDING") {
                buttonsHtml += `<button onclick="confirmAppointment(${a.id})">Confirm</button> `;
                buttonsHtml += `<button onclick="cancelAppointmentDoctor(${a.id})">Cancel</button>`;
            } else if (status === "CONFIRMED") {
                buttonsHtml += `<button onclick="completeAppointment(${a.id})">Complete</button> `;
                buttonsHtml += `<button onclick="cancelAppointmentDoctor(${a.id})">Cancel</button>`;
            } else if (status === "COMPLETED") {
                buttonsHtml += `<span>Completed</span>`;
            } else if (status === "CANCELLED") {
                buttonsHtml += `<span>Cancelled</span>`;
            }

            table.innerHTML += `<tr>
                <td>${a.id}</td>
                <td>${a.patient?.id ?? ""}</td>
                <td>${a.appointmentDate}</td>
                <td>${a.appointmentTime}</td>
                <td>${a.status}</td>
                <td>${a.reason ?? ""}</td>
                <td>${buttonsHtml}</td>
            </tr>`;
        });
    } catch (e) {
        table.innerHTML += `<tr><td colspan="7">Error: ${e.message}</td></tr>`;
    }
}


async function loadAllAppointments() {
    const table = document.getElementById("all-appointments-table");
    table.innerHTML = "<tr><th>ID</th><th>Doctor ID</th><th>Patient ID</th><th>Date</th><th>Time</th><th>Status</th></tr>";

    try {
        const res = await apiFetch("/api/appointments");
        if (!res.ok) {
            table.innerHTML += `<tr><td colspan="6">Failed to load appointments</td></tr>`;
            return;
        }
        const apps = await res.json();
        apps.forEach(a => {
            table.innerHTML += `<tr>
                <td>${a.id}</td>
                <td>${a.doctor?.id ?? ""}</td>
                <td>${a.patient?.id ?? ""}</td>
                <td>${a.appointmentDate}</td>
                <td>${a.appointmentTime}</td>
                <td>${a.status}</td>
            </tr>`;
        });
    } catch (e) {
        table.innerHTML += `<tr><td colspan="6">Error: ${e.message}</td></tr>`;
    }
}

// ========== AVAILABLE SLOTS (DOCTOR) ==========

async function addSlot() {
    const doctorId = localStorage.getItem("userId");
    const date = document.getElementById("doctor-slot-date").value;
    const time = document.getElementById("doctor-slot-time").value;
    const msg = document.getElementById("doctor-slot-message");
    msg.textContent = "";

    if (!date || !time) {
        msg.textContent = "Date and time are required.";
        return;
    }

    try {
        const res = await apiFetch(`/api/doctors/${doctorId}/slots`, {
            method: "POST",
            body: JSON.stringify({
                slotDate: date,
                slotTime: time,
                isAvailable: true,
                durationMinutes: 30
            })
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok || data.success === false) {
            msg.textContent = data.message || "Failed to add slot";
            return;
        }

        msg.style.color = "green";
        msg.textContent = "Slot added successfully.";
        loadDoctorSlots();
    } catch (e) {
        msg.textContent = "Error: " + e.message;
    }
}

async function loadDoctorSlots() {
    const doctorId = localStorage.getItem("userId");
    const table = document.getElementById("doctor-slots-table");
    table.innerHTML = "<tr><th>ID</th><th>Date</th><th>Time</th><th>Available</th></tr>";

    try {
        const res = await apiFetch(`/api/doctors/${doctorId}/slots`);
        if (!res.ok) {
            table.innerHTML += `<tr><td colspan="4">Failed to load slots</td></tr>`;
            return;
        }
        const slots = await res.json();
        slots.forEach(s => {
            table.innerHTML += `<tr>
                <td>${s.id}</td>
                <td>${s.slotDate}</td>
                <td>${s.slotTime}</td>
                <td>${s.isAvailable}</td>
            </tr>`;
        });
    } catch (e) {
        table.innerHTML += `<tr><td colspan="4">Error: ${e.message}</td></tr>`;
    }
}

// ========== DOCTOR: MY PATIENTS ==========

async function loadDoctorPatients() {
    const doctorId = localStorage.getItem("userId");
    const table = document.getElementById("doctor-patients-table");
    if (!table) return;

    table.innerHTML = "<tr><th>Patient ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Action</th></tr>";

    try {
        const res = await apiFetch(`/api/appointments/doctor/${doctorId}/patients`);
        if (!res.ok) {
            table.innerHTML += `<tr><td colspan="5">Failed to load patients</td></tr>`;
            return;
        }

        const patients = await res.json();
        if (!patients.length) {
            table.innerHTML += `<tr><td colspan="5">No patients found.</td></tr>`;
            return;
        }

        patients.forEach(p => {
            table.innerHTML += `<tr>
                <td>${p.id}</td>
                <td>${p.name ?? ""}</td>
                <td>${p.email ?? ""}</td>
                <td>${p.phone ?? ""}</td>
                <td>
                    <button onclick="loadRecordsForDoctorPatient(${p.id})">
                        View Records
                    </button>
                </td>
            </tr>`;
        });
    } catch (e) {
        table.innerHTML += `<tr><td colspan="5">Error: ${e.message}</td></tr>`;
    }
}


/// ========== MEDICAL RECORDS ==========

 async function addMedicalRecord() {
     const doctorId = parseInt(localStorage.getItem("userId"));
     const patientId = parseInt(document.getElementById("rec-patient-id").value);
     const visitDate = document.getElementById("rec-visit-date").value;
     const symptoms = document.getElementById("rec-symptoms").value;
     const diagnosis = document.getElementById("rec-diagnosis").value;
     const prescription = document.getElementById("rec-prescription").value;

     const notes = document.getElementById("rec-notes")?.value || null;
     const bloodPressure = document.getElementById("rec-bp")?.value || null;
     const temperature = document.getElementById("rec-temp")?.value || null;
     const heartRate = document.getElementById("rec-hr")?.value || null;
     const weight = document.getElementById("rec-weight")?.value || null;

     const msg = document.getElementById("record-message");
     msg.textContent = "";

     if (!patientId || !visitDate) {
         msg.textContent = "Patient ID and visit date are required.";
         return;
     }

     try {
         const res = await apiFetch("/api/records", {
             method: "POST",
             body: JSON.stringify({
                 patientId,
                 doctorId,
                 visitDate,
                 symptoms,
                 diagnosis,
                 prescription,
                 notes,
                 bloodPressure,
                 temperature,
                 heartRate,
                 weight
             })
         });

         const data = await res.json().catch(() => ({}));
         if (!res.ok || data.success === false) {
             msg.textContent = data.message || "Failed to add record";
             return;
         }

         msg.style.color = "green";
         msg.textContent = "Record added successfully.";

         // 🔹 clear inputs (optional)
         document.getElementById("rec-symptoms").value = "";
         document.getElementById("rec-diagnosis").value = "";
         document.getElementById("rec-prescription").value = "";
         if (document.getElementById("rec-notes")) document.getElementById("rec-notes").value = "";
         if (document.getElementById("rec-bp")) document.getElementById("rec-bp").value = "";
         if (document.getElementById("rec-temp")) document.getElementById("rec-temp").value = "";
         if (document.getElementById("rec-hr")) document.getElementById("rec-hr").value = "";
         if (document.getElementById("rec-weight")) document.getElementById("rec-weight").value = "";

         // 🔹 if this patient is the selected one in "My Patients", refresh their records table
         if (currentPatientIdForDoctor && currentPatientIdForDoctor === patientId) {
             loadRecordsForDoctorPatient(currentPatientIdForDoctor);
         }

     } catch (e) {
         msg.textContent = "Error: " + e.message;
     }
 }


async function loadPatientRecords() {
    const patientId = localStorage.getItem("userId");
    const table = document.getElementById("patient-records-table");
    table.innerHTML =
        "<tr>" +
        "<th>ID</th>" +
        "<th>Doctor ID</th>" +
        "<th>Visit Date</th>" +
        "<th>Diagnosis</th>" +
        "<th>Prescription</th>" +
        "<th>Blood Pressure</th>" +
        "<th>Temp</th>" +
        "<th>Heart Rate</th>" +
        "<th>Weight</th>" +
        "<th>Notes</th>" +
        "</tr>";

    try {
        const res = await apiFetch(`/api/records/patient/${patientId}`);
        if (!res.ok) {
            table.innerHTML += `<tr><td colspan="10">Failed to load records</td></tr>`;
            return;
        }
        const records = await res.json();
        records.forEach(r => {
            table.innerHTML += `<tr>
                <td>${r.id}</td>
                <td>${r.doctor?.id ?? ""}</td>
                <td>${r.visitDate}</td>
                <td>${r.diagnosis ?? ""}</td>
                <td>${r.prescription ?? ""}</td>
                <td>${r.bloodPressure ?? ""}</td>
                <td>${r.temperature ?? ""}</td>
                <td>${r.heartRate ?? ""}</td>
                <td>${r.weight ?? ""}</td>
                <td>${r.notes ?? ""}</td>
            </tr>`;
        });
    } catch (e) {
        table.innerHTML += `<tr><td colspan="10">Error: ${e.message}</td></tr>`;
    }
}

async function loadRecordsForDoctorPatient(patientId) {
    const doctorId = localStorage.getItem("userId");
    const table = document.getElementById("doctor-patient-records-table");
    const msg = document.getElementById("doctor-records-message");

    if (!table || !msg) return;

    // 🔹 remember which patient is selected
    currentPatientIdForDoctor = patientId;

    // 🔹 auto-fill the Add Medical Record form with this patient
    const recPatientInput = document.getElementById("rec-patient-id");
    if (recPatientInput) {
        recPatientInput.value = patientId;
    }

    msg.textContent = "";
    table.innerHTML = `
        <tr>
            <th>ID</th>
            <th>Visit Date</th>
            <th>Diagnosis</th>
            <th>Prescription</th>
            <th>Notes</th>
            <th>BP</th>
            <th>Temp</th>
            <th>HR</th>
            <th>Weight</th>
        </tr>`;

    try {
        const res = await apiFetch(`/api/records/doctor/${doctorId}/patient/${patientId}`);
        if (!res.ok) {
            table.innerHTML += `<tr><td colspan="9">Failed to load records</td></tr>`;
            return;
        }

        const records = await res.json();
        if (!records.length) {
            msg.textContent = "No records found for this patient.";
            return;
        }

        records.forEach(r => {
            table.innerHTML += `
                <tr>
                    <td>${r.id}</td>
                    <td>${r.visitDate ?? ""}</td>
                    <td>${r.diagnosis ?? ""}</td>
                    <td>${r.prescription ?? ""}</td>
                    <td>${r.notes ?? ""}</td>
                    <td>${r.bloodPressure ?? ""}</td>
                    <td>${r.temperature ?? ""}</td>
                    <td>${r.heartRate ?? ""}</td>
                    <td>${r.weight ?? ""}</td>
                </tr>`;
        });
    } catch (e) {
        table.innerHTML += `<tr><td colspan="9">Error: ${e.message}</td></tr>`;
    }
}

// ========== PATIENTS (ADMIN) ==========

async function loadAllPatients() {
    const table = document.getElementById("all-patients-table");
    table.innerHTML = "<tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Active</th></tr>";

    try {
        const res = await apiFetch("/api/patients");
        if (!res.ok) {
            table.innerHTML += `<tr><td colspan="5">Failed to load patients</td></tr>`;
            return;
        }
        const patients = await res.json();
        patients.forEach(p => {
            table.innerHTML += `<tr>
                <td>${p.id}</td>
                <td>${p.name}</td>
                <td>${p.email}</td>
                <td>${p.phone}</td>
                <td>${p.active}</td>
            </tr>`;
        });
    } catch (e) {
        table.innerHTML += `<tr><td colspan="5">Error: ${e.message}</td></tr>`;
    }
}

async function loadPatientCount() {
    const p = document.getElementById("patient-count");
    p.textContent = "";
    try {
        const res = await apiFetch("/api/patients/count");
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data.success === false) {
            p.textContent = data.message || "Failed to load count";
            return;
        }
        p.textContent = `Active Patients: ${data.data}`;
    } catch (e) {
        p.textContent = "Error: " + e.message;
    }
}

// ========== ORGAN DONORS ==========

async function loadDonors() {
    const table = document.getElementById("donors-table");
    const tableAdmin = document.getElementById("donors-table-admin");

    const headerRow = "<tr>" +
        "<th>ID</th>" +
        "<th>Name</th>" +
        "<th>Age</th>" +
        "<th>Gender</th>" +
        "<th>Blood Group</th>" +
        "<th>Organs</th>" +
        "<th>Contact</th>" +
        "<th>Email</th>" +
        "<th>Address</th>" +
        "<th>City</th>" +
        "<th>State</th>" +
        "<th>Medical Conditions</th>" +
        "</tr>";

    if (table) table.innerHTML = headerRow;
    if (tableAdmin) tableAdmin.innerHTML = headerRow;

    try {
        const res = await apiFetch("/api/donors");
        if (!res.ok) {
            const errorRow = `<tr><td colspan="12">Failed to load donors</td></tr>`;
            if (table) table.innerHTML += errorRow;
            if (tableAdmin) tableAdmin.innerHTML += errorRow;
            return;
        }

        const donors = await res.json();
        if (!donors.length) {
            const emptyRow = `<tr><td colspan="12">No donors found</td></tr>`;
            if (table) table.innerHTML += emptyRow;
            if (tableAdmin) tableAdmin.innerHTML += emptyRow;
            return;
        }

        donors.forEach(d => {
            const row = `<tr>
                <td>${d.id}</td>
                <td>${d.name}</td>
                <td>${d.age ?? ""}</td>
                <td>${d.gender ?? ""}</td>
                <td>${d.bloodGroup}</td>
                <td>${d.organsToDonate}</td>
                <td>${d.contactNumber ?? ""}</td>
                <td>${d.email ?? ""}</td>
                <td>${d.address ?? ""}</td>
                <td>${d.city ?? ""}</td>
                <td>${d.state ?? ""}</td>
                <td>${d.medicalConditions ?? ""}</td>
            </tr>`;

            if (table) table.innerHTML += row;
            if (tableAdmin) tableAdmin.innerHTML += row;
        });
    } catch (e) {
        const errRow = `<tr><td colspan="12">Error: ${e.message}</td></tr>`;
        if (table) table.innerHTML += errRow;
        if (tableAdmin) tableAdmin.innerHTML += errRow;
    }
}

async function searchDonors() {
    const blood = document.getElementById("donor-search-blood").value;
    const organ = document.getElementById("donor-search-organ").value;
    const city = document.getElementById("donor-search-city").value;
    const state = document.getElementById("donor-search-state").value;

    let qs = [];
    if (blood) qs.push(`bloodGroup=${encodeURIComponent(blood)}`);
    if (organ) qs.push(`organ=${encodeURIComponent(organ)}`);
    if (city) qs.push(`city=${encodeURIComponent(city)}`);
    if (state) qs.push(`state=${encodeURIComponent(state)}`);

    const query = qs.length ? "?" + qs.join("&") : "";
    const table = document.getElementById("donors-table");

    table.innerHTML = "<tr>" +
        "<th>ID</th>" +
        "<th>Name</th>" +
        "<th>Age</th>" +
        "<th>Gender</th>" +
        "<th>Blood Group</th>" +
        "<th>Organs</th>" +
        "<th>Contact</th>" +
        "<th>Email</th>" +
        "<th>Address</th>" +
        "<th>City</th>" +
        "<th>State</th>" +
        "<th>Medical Conditions</th>" +
        "</tr>";

    try {
        const res = await apiFetch(`/api/donors/search${query}`);
        if (!res.ok) {
            table.innerHTML += `<tr><td colspan="12">Failed to search donors</td></tr>`;
            return;
        }
        const donors = await res.json();

        if (!donors.length) {
            table.innerHTML += `<tr><td colspan="12">No donors found</td></tr>`;
            return;
        }

        donors.forEach(d => {
            table.innerHTML += `<tr>
                <td>${d.id}</td>
                <td>${d.name}</td>
                <td>${d.age ?? ""}</td>
                <td>${d.gender ?? ""}</td>
                <td>${d.bloodGroup}</td>
                <td>${d.organsToDonate}</td>
                <td>${d.contactNumber ?? ""}</td>
                <td>${d.email ?? ""}</td>
                <td>${d.address ?? ""}</td>
                <td>${d.city ?? ""}</td>
                <td>${d.state ?? ""}</td>
                <td>${d.medicalConditions ?? ""}</td>
            </tr>`;
        });
    } catch (e) {
        table.innerHTML += `<tr><td colspan="12">Error: ${e.message}</td></tr>`;
    }
}

async function registerDonor() {
    const name = document.getElementById("donor-name").value;
    const age = parseInt(document.getElementById("donor-age").value);
    const gender = document.getElementById("donor-gender").value;
    const bloodGroup = document.getElementById("donor-blood").value;
    const contactNumber = document.getElementById("donor-contact").value;
    const email = document.getElementById("donor-email").value;
    const address = document.getElementById("donor-address").value;
    const city = document.getElementById("donor-city").value;
    const state = document.getElementById("donor-state").value;
    const organsToDonate = document.getElementById("donor-organs").value;
    const medicalConditions = document.getElementById("donor-conditions").value;
    const msg = document.getElementById("donor-message");
    msg.textContent = "";

    if (!name || !age || !bloodGroup || !contactNumber || !email || !organsToDonate) {
        msg.textContent = "Please fill required fields (name, age, blood group, contact, email, organs).";
        return;
    }

    try {
        const res = await apiFetch("/api/donors", {
            method: "POST",
            body: JSON.stringify({
                name,
                age,
                gender,
                bloodGroup,
                contactNumber,
                email,
                address,
                city,
                state,
                organsToDonate,
                medicalConditions
            })
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok || data.success === false) {
            msg.textContent = data.message || "Failed to register donor";
            return;
        }

        msg.style.color = "green";
        msg.textContent = "Donor registered successfully.";
        loadDonors();
    } catch (e) {
        msg.textContent = "Error: " + e.message;
    }
}

async function updateAppointmentStatus(id, status) {
    try {
        const res = await apiFetch(`/api/appointments/${id}/status`, {
            method: "PUT",
            body: JSON.stringify({ status })
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok || data.success === false) {
            alert(data.message || "Failed to update status");
            return;
        }

        // reload doctor view + admin table (if visible)
        loadDoctorAppointments();
        const adminTable = document.getElementById("all-appointments-table");
        if (adminTable) {
            loadAllAppointments();
        }
    } catch (e) {
        alert("Error updating status: " + e.message);
    }
}

function confirmAppointment(id) {
    updateAppointmentStatus(id, "CONFIRMED");
}

function completeAppointment(id) {
    updateAppointmentStatus(id, "COMPLETED");
}

function cancelAppointmentDoctor(id) {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    updateAppointmentStatus(id, "CANCELLED");
}


// ========== ON LOAD ==========

window.addEventListener("load", () => {
    if (getToken()) {
        showDashboard();
    } else {
        document.getElementById("auth-section").style.display = "block";
        document.getElementById("dashboard-section").style.display = "none";
    }
});
