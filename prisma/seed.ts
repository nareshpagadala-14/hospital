import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Hospital Database Seeding...");

  // Clear existing data
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.doctorAvailability.deleteMany();
  await prisma.doctorUnavailability.deleteMany();
  await prisma.hospitalHoliday.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.department.deleteMany();
  await prisma.service.deleteMany();
  await prisma.healthPackage.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.healthArticle.deleteMany();
  await prisma.faq.deleteMany();
  await prisma.hospitalSetting.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Cleaned database tables.");

  // 1. Hospital Settings
  const settings = [
    { key: "hospital_name", value: "AIMS Prime Super Speciality Hospital", description: "Official Hospital Name" },
    { key: "tagline", value: "Advanced Healthcare. Compassionate Care.", description: "Hospital Tagline" },
    { key: "address", value: "Collectorate Road, Beside New RTO, Sambasiva Pet, Guntur, Andhra Pradesh 522004", description: "Hospital Physical Address" },
    { key: "city", value: "Guntur", description: "City" },
    { key: "state", value: "Andhra Pradesh", description: "State" },
    { key: "emergency_phone", value: "+91 863 234 5678", description: "24/7 Emergency Hotline" },
    { key: "ambulance_phone", value: "+91 863 234 9999", description: "Ambulance Hotline" },
    { key: "appointment_phone", value: "+91 863 234 5600", description: "Appointments Desk" },
    { key: "general_email", value: "care@aimshospital.com", description: "Contact Email" },
    { key: "working_hours", value: "OPD: Mon-Sat 08:00 AM - 08:00 PM | Emergency: 24/7 All Days", description: "Working Hours" },
    { key: "experience_years", value: "18+", description: "Years of Excellence" },
    { key: "doctors_count", value: "120+", description: "Specialists" },
    { key: "departments_count", value: "24+", description: "Departments" },
    { key: "patients_served", value: "250K+", description: "Patients Treated" },
  ];

  for (const s of settings) {
    await prisma.hospitalSetting.create({ data: s });
  }

  // 2. Passwords
  const adminPassword = await bcrypt.hash("Admin@1234", 10);
  const doctorPassword = await bcrypt.hash("Doctor@1234", 10);
  const receptionPassword = await bcrypt.hash("Reception@1234", 10);
  const patientPassword = await bcrypt.hash("Patient@1234", 10);

  // 3. Admin User
  const adminUser = await prisma.user.create({
    data: {
      name: "Dr. K. Srinivas Rao (Medical Director)",
      email: "admin@aimshospital.com",
      phone: "+91 98480 12345",
      passwordHash: adminPassword,
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  // 4. Receptionist User
  const receptionistUser = await prisma.user.create({
    data: {
      name: "Lakshmi Narayana (Front Desk Chief)",
      email: "reception@aimshospital.com",
      phone: "+91 98480 54321",
      passwordHash: receptionPassword,
      role: "RECEPTIONIST",
      status: "ACTIVE",
    },
  });

  // 5. Patients
  const patientUser1 = await prisma.user.create({
    data: {
      name: "Venkata Satyanarayana Murthy",
      email: "patient@aimshospital.com",
      phone: "+91 94401 23456",
      passwordHash: patientPassword,
      role: "PATIENT",
      status: "ACTIVE",
    },
  });

  const patient1 = await prisma.patient.create({
    data: {
      userId: patientUser1.id,
      dateOfBirth: "1978-05-14",
      gender: "Male",
      bloodGroup: "B+",
      address: "Brodipet 4th Lane, Guntur, AP",
      emergencyContact: "+91 94401 98765 (Spouse)",
      medicalHistory: "Mild Hypertension managed with Telmisartan 40mg. No drug allergies.",
    },
  });

  const patientUser2 = await prisma.user.create({
    data: {
      name: "Sneha Latha Reddy",
      email: "sneha.reddy@gmail.com",
      phone: "+91 98660 88776",
      passwordHash: patientPassword,
      role: "PATIENT",
      status: "ACTIVE",
    },
  });

  const patient2 = await prisma.patient.create({
    data: {
      userId: patientUser2.id,
      dateOfBirth: "1992-11-20",
      gender: "Female",
      bloodGroup: "O+",
      address: "Chandramouli Nagar, Ring Road, Guntur, AP",
      emergencyContact: "+91 98660 11223 (Brother)",
      medicalHistory: "Routine annual checkup, seasonal allergic rhinitis.",
    },
  });

  // 6. Departments
  const departmentsData = [
    {
      name: "Cardiology & Cardiac Surgery",
      slug: "cardiology",
      description: "Comprehensive cardiac care with digital flat-panel cath lab, 24/7 primary angioplasty, and bypass surgery.",
      icon: "HeartPulse",
      image: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Neurology & Neurosurgery",
      slug: "neurology",
      description: "Advanced neurological diagnostics, brain and spine surgery, stroke thrombolysis, and neuro-critical care.",
      icon: "Brain",
      image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Orthopedics & Joint Replacement",
      slug: "orthopedics",
      description: "Robotic assisted total knee and hip replacements, arthroscopy, complex trauma reconstruction, and sports medicine.",
      icon: "Bone",
      image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Pediatrics & Neonatology (NICU)",
      slug: "pediatrics",
      description: "Level III NICU, pediatric intensive care, growth monitoring, developmental assessment, and immunizations.",
      icon: "Baby",
      image: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Obstetrics & Gynecology",
      slug: "gynecology",
      description: "High-risk pregnancy management, painless normal delivery, laparoscopy, infertility assessment, and women's health.",
      icon: "UserHeart",
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "General Medicine & Diabetology",
      slug: "general-medicine",
      description: "Expert diagnosis and ongoing management of lifestyle diseases, diabetes mellitus, hypertension, and infectious diseases.",
      icon: "Stethoscope",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Gastroenterology & Hepatology",
      slug: "gastroenterology",
      description: "Video endoscopy, colonoscopy, ERCP, liver disease treatments, and minimally invasive gastrointestinal surgery.",
      icon: "Activity",
      image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "24/7 Emergency & Trauma Care",
      slug: "emergency-medicine",
      description: "Immediate life-saving resuscitation, acute trauma management, disaster readiness, and ACLS equipped ambulances.",
      icon: "Ambulance",
      image: "https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  const departmentMap: Record<string, any> = {};
  for (const dep of departmentsData) {
    const createdDep = await prisma.department.create({ data: dep });
    departmentMap[dep.slug] = createdDep;
  }

  // 7. Doctors
  const doctorsData = [
    {
      user: {
        name: "Dr. Ramesh Chandra Chowdary",
        email: "dr.ramesh@aimshospital.com",
        phone: "+91 94400 11221",
        role: "DOCTOR",
      },
      departmentSlug: "cardiology",
      qualification: "MBBS, MD (Gen Med), DM (Cardiology), FACC",
      specialization: "Chief Interventional Cardiologist",
      experienceYears: 18,
      registrationNumber: "APMC-45892",
      consultationFee: 700.0,
      languages: "Telugu, English, Hindi",
      biography: "Dr. Ramesh Chandra is one of Andhra Pradesh's most experienced cardiologists with over 8,000 successful coronary angioplasties and pacemaker implantations. Trained at AIIMS and Nizam's Institute of Medical Sciences.",
      photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80",
    },
    {
      user: {
        name: "Dr. Priya Varma",
        email: "dr.priya@aimshospital.com",
        phone: "+91 94400 22332",
        role: "DOCTOR",
      },
      departmentSlug: "neurology",
      qualification: "MBBS, MD (Medicine), DM (Neurology)",
      specialization: "Senior Consultant Neurologist & Stroke Specialist",
      experienceYears: 14,
      registrationNumber: "APMC-51204",
      consultationFee: 650.0,
      languages: "Telugu, English",
      biography: "Specialist in acute ischemic stroke intervention, refractory epilepsy, Parkinson's disease, and neuro-immunology. Recipient of prestigious state clinical research awards.",
      photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80",
    },
    {
      user: {
        name: "Dr. Suresh Babu Kilaru",
        email: "dr.suresh@aimshospital.com",
        phone: "+91 94400 33443",
        role: "DOCTOR",
      },
      departmentSlug: "orthopedics",
      qualification: "MBBS, MS (Ortho), MCh (Ortho, UK), Fellowship Joint Replacement",
      specialization: "Robotic Joint Replacement & Arthroscopy Surgeon",
      experienceYears: 16,
      registrationNumber: "APMC-47819",
      consultationFee: 600.0,
      languages: "Telugu, English",
      biography: "Pioneer in computer-navigated and robotic knee replacements in Guntur district. Performed more than 4,500 joint replacements with fast-track rehabilitation protocols.",
      photo: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=800&q=80",
    },
    {
      user: {
        name: "Dr. Anitha Devi Mandava",
        email: "dr.anitha@aimshospital.com",
        phone: "+91 94400 44554",
        role: "DOCTOR",
      },
      departmentSlug: "pediatrics",
      qualification: "MBBS, DCH, DNB (Pediatrics), Fellowship Neonatology",
      specialization: "Senior Pediatrician & Chief Neonatologist",
      experienceYears: 12,
      registrationNumber: "APMC-53412",
      consultationFee: 500.0,
      languages: "Telugu, English, Hindi",
      biography: "Dedicated pediatric expert leading the Level-III NICU at AIMS Prime. Highly skilled in extreme premature infant resuscitation, developmental growth tracking, and pediatric allergy.",
      photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80",
    },
    {
      user: {
        name: "Dr. Kavitha Rayapati",
        email: "dr.kavitha@aimshospital.com",
        phone: "+91 94400 55665",
        role: "DOCTOR",
      },
      departmentSlug: "gynecology",
      qualification: "MBBS, MS (OBG), FMAS, Fellow in Reproductive Medicine",
      specialization: "High-Risk Pregnancy & Laparoscopic Surgeon",
      experienceYears: 15,
      registrationNumber: "APMC-49033",
      consultationFee: 600.0,
      languages: "Telugu, English",
      biography: "Specialized in painless labor management, high-risk obstetrics, fibroid myomectomy, and total laparoscopic hysterectomy with minimal recovery duration.",
      photo: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=800&q=80",
    },
    {
      user: {
        name: "Dr. Venkat Rao Guntupalli",
        email: "dr.venkat@aimshospital.com",
        phone: "+91 94400 66776",
        role: "DOCTOR",
      },
      departmentSlug: "general-medicine",
      qualification: "MBBS, MD (General Medicine), Post Graduate Diploma in Diabetology",
      specialization: "Senior Physician & Diabetologist",
      experienceYears: 20,
      registrationNumber: "APMC-38910",
      consultationFee: 500.0,
      languages: "Telugu, English, Hindi",
      biography: "Renowned general physician in Guntur with two decades of experience treating complex infectious diseases, diabetic foot ulcers, metabolic disorders, and chronic hypertension.",
      photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const doctorsList = [];
  for (const doc of doctorsData) {
    const u = await prisma.user.create({
      data: {
        name: doc.user.name,
        email: doc.user.email,
        phone: doc.user.phone,
        passwordHash: doctorPassword,
        role: doc.user.role,
        status: "ACTIVE",
      },
    });

    const d = await prisma.doctor.create({
      data: {
        userId: u.id,
        departmentId: departmentMap[doc.departmentSlug].id,
        qualification: doc.qualification,
        specialization: doc.specialization,
        experienceYears: doc.experienceYears,
        registrationNumber: doc.registrationNumber,
        consultationFee: doc.consultationFee,
        languages: doc.languages,
        biography: doc.biography,
        photo: doc.photo,
        status: "ACTIVE",
      },
    });

    // Create Availability: Mon (1) to Sat (6), 09:00 - 13:00, 16:00 - 19:00
    for (let day = 1; day <= 6; day++) {
      await prisma.doctorAvailability.create({
        data: {
          doctorId: d.id,
          dayOfWeek: day,
          startTime: "09:00",
          endTime: "13:00",
          slotDurationMinutes: 30,
          maxAppointmentsPerSlot: 1,
        },
      });
      await prisma.doctorAvailability.create({
        data: {
          doctorId: d.id,
          dayOfWeek: day,
          startTime: "16:00",
          endTime: "19:00",
          slotDurationMinutes: 30,
          maxAppointmentsPerSlot: 1,
        },
      });
    }

    doctorsList.push(d);
  }

  // 8. Hospital Services
  const services = [
    {
      title: "24/7 Emergency & Level-1 Trauma Care",
      slug: "emergency-trauma",
      category: "EMERGENCY",
      description: "Round-the-clock emergency team with dedicated triage, resuscitation bays, ultrasound FAST, and life-support transport.",
      icon: "Ambulance",
      image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80",
      facilities: "Red code triage, Immediate CT scan access, ACLS ambulances, Emergency operating room, Dedicated trauma surgeons",
    },
    {
      title: "State-of-the-Art Cath Lab & CCU",
      slug: "cath-lab",
      category: "CRITICAL_CARE",
      description: "Ultramodern digital flat panel angiography system delivering emergency Primary Angioplasty within the golden hour.",
      icon: "Heart",
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
      facilities: "Fractional Flow Reserve (FFR), Intravascular Ultrasound (IVUS), Rotablation, Intra-Aortic Balloon Pump (IABP)",
    },
    {
      title: "Ultra-Clean Modular Operation Theatres",
      slug: "modular-ot",
      category: "SURGICAL",
      description: "Class 100 laminar airflow theatres equipped with high-definition endoscopic towers and HEPA filtration.",
      icon: "ShieldAlert",
      image: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?auto=format&fit=crop&w=800&q=80",
      facilities: "Laminar airflow, Anti-microbial seamless walls, LED surgical lights, Intra-operative X-ray C-arm, Advanced anesthesia workstations",
    },
    {
      title: "Advanced 1.5T MRI & 64-Slice CT Scan",
      slug: "radiology-imaging",
      category: "DIAGNOSTICS",
      description: "Sub-millimeter accurate digital imaging with low radiation protocols for brain, cardiac, abdominal, and skeletal diagnosis.",
      icon: "Scan",
      image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80",
      facilities: "Whole body MRI, Cardiac CT angiography, Digital mammography, 4D color Doppler ultrasound, Bone mineral densitometry (DEXA)",
    },
    {
      title: "24/7 Fully Automated NABL Laboratory",
      slug: "pathology-lab",
      category: "DIAGNOSTICS",
      description: "High-throughput robotic clinical chemistry, hematology, microbiology, and molecular diagnostics.",
      icon: "Microscope",
      image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=800&q=80",
      facilities: "Barcoded sample tracking, Automated immunoassays, Arterial blood gas (ABG) in 90 seconds, Rapid PCR testing",
    },
    {
      title: "Hemodialysis & Renal Care Unit",
      slug: "dialysis-unit",
      category: "INPATIENT",
      description: "Equipped with state-of-the-art Fresenius dialysis machines and multi-stage reverse osmosis water treatment.",
      icon: "Droplets",
      image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80",
      facilities: "Isolated machines for seropositive patients, SLED for ICU patients, Peritoneal dialysis counseling, Vascular access clinic",
    },
  ];

  for (const s of services) {
    await prisma.service.create({ data: s });
  }

  // 9. Health Packages
  const packages = [
    {
      name: "AIMS Executive Health Checkup",
      slug: "executive-health-checkup",
      description: "Complete screening designed for corporate executives and working professionals to detect lifestyle diseases early.",
      includedTests: JSON.stringify([
        "Complete Blood Picture with ESR",
        "Fasting & Post-Prandial Blood Sugar with HbA1c",
        "Lipid Profile (Cholesterol, HDL, LDL, Triglycerides)",
        "Liver Function Test (11 Parameters)",
        "Kidney Function Test (Creatinine, Urea, Uric Acid)",
        "Thyroid Profile (T3, T4, TSH)",
        "12-Lead Resting ECG",
        "Chest X-Ray PA View",
        "Ultrasound Whole Abdomen & Pelvis",
        "Physician & Dietitian Consultation",
      ]),
      originalPrice: 4500.0,
      discountedPrice: 2499.0,
      validityDays: 30,
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
      isPopular: true,
    },
    {
      name: "Advanced Cardiac Wellness Package",
      slug: "advanced-cardiac-wellness",
      description: "Thorough heart evaluation by senior cardiologists to screen for ischemic heart disease, arrhythmias, and hypertension risks.",
      includedTests: JSON.stringify([
        "Consultation with Senior Cardiologist",
        "12-Lead Electrocardiogram (ECG)",
        "2D Echocardiography with Color Doppler",
        "Treadmill Stress Test (TMT)",
        "Cardiac Lipid Profile & Apolipoproteins",
        "Serum Homocysteine & hs-CRP",
        "Serum Electrolytes (Na+, K+, Cl-)",
        "Complete Hemogram & Urine Routine",
      ]),
      originalPrice: 6500.0,
      discountedPrice: 3899.0,
      validityDays: 30,
      image: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&w=800&q=80",
      isPopular: true,
    },
    {
      name: "Senior Citizen Wellness (Male & Female)",
      slug: "senior-citizen-wellness",
      description: "Specialized geriatric screening focusing on joint health, bone density, cardiac endurance, and metabolic stability.",
      includedTests: JSON.stringify([
        "Geriatric Physician Comprehensive Review",
        "Bone Mineral Density (DEXA Scan)",
        "Serum Calcium, Vitamin D3 & Vitamin B12",
        "PSA (Prostate Specific Antigen for Men) / Pap Smear (Women)",
        "Complete Renal & Hepatic Evaluation",
        "Ophthalmology / Vision & Glaucoma Check",
        "Audiometry / Hearing Test",
        "Dietary & Lifestyle Counseling",
      ]),
      originalPrice: 5800.0,
      discountedPrice: 3199.0,
      validityDays: 45,
      image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80",
      isPopular: false,
    },
    {
      name: "Well Women Complete Screening",
      slug: "well-women-screening",
      description: "Designed for women of all ages covering hormonal balance, cervical screening, breast wellness, and bone health.",
      includedTests: JSON.stringify([
        "Consultation with Senior Gynecologist",
        "Pap Smear Screening",
        "Breast Ultrasound / Mammogram (as indicated)",
        "Pelvic Ultrasound (TVS / TAS)",
        "Thyroid Profile (TSH, FT4)",
        "Hemoglobin, Iron Studies, Ferritin",
        "Urine Routine & Culture",
      ]),
      originalPrice: 4200.0,
      discountedPrice: 2299.0,
      validityDays: 30,
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80",
      isPopular: false,
    },
  ];

  for (const pkg of packages) {
    await prisma.healthPackage.create({ data: pkg });
  }

  // 10. Sample Appointments
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const apt1 = await prisma.appointment.create({
    data: {
      appointmentNumber: "APT-" + today.replace(/-/g, "") + "-001",
      patientId: patient1.id,
      doctorId: doctorsList[0].id, // Dr. Ramesh
      departmentId: departmentMap["cardiology"].id,
      appointmentDate: today,
      startTime: "10:00",
      endTime: "10:30",
      appointmentType: "IN_PERSON",
      reason: "Quarterly hypertension and heart rhythm follow-up check.",
      status: "CHECKED_IN",
      consultationNotes: "BP is 138/88. Advised reduction in salt intake. Continuing Telmisartan.",
    },
  });

  const apt2 = await prisma.appointment.create({
    data: {
      appointmentNumber: "APT-" + today.replace(/-/g, "") + "-002",
      patientId: patient2.id,
      doctorId: doctorsList[2].id, // Dr. Suresh (Ortho)
      departmentId: departmentMap["orthopedics"].id,
      appointmentDate: today,
      startTime: "11:30",
      endTime: "12:00",
      appointmentType: "IN_PERSON",
      reason: "Right knee pain while climbing stairs for 3 weeks.",
      status: "CONFIRMED",
    },
  });

  const apt3 = await prisma.appointment.create({
    data: {
      appointmentNumber: "APT-" + tomorrow.replace(/-/g, "") + "-003",
      patientId: patient1.id,
      doctorId: doctorsList[1].id, // Dr. Priya (Neuro)
      departmentId: departmentMap["neurology"].id,
      appointmentDate: tomorrow,
      startTime: "09:30",
      endTime: "10:00",
      appointmentType: "IN_PERSON",
      reason: "Frequent morning tension headaches.",
      status: "PENDING",
    },
  });

  // 11. Testimonials
  const testimonials = [
    {
      patientName: "G. V. Subba Rao",
      department: "Cardiology",
      rating: 5,
      comment: "When my father experienced acute chest pain at 2 AM, the AIMS Prime emergency team in Guntur was ready. Dr. Ramesh performed an angioplasty within 45 minutes of arrival. Today my father is healthy and active. God bless the team!",
      isApproved: true,
    },
    {
      patientName: "M. Anuradha Devi",
      department: "Orthopedics",
      rating: 5,
      comment: "I had severe osteoarthritis in both knees and could barely walk. Dr. Suresh performed bilateral robotic knee replacement. I was able to walk with support on the second day itself. The nursing care was truly compassionate.",
      isApproved: true,
    },
    {
      patientName: "Chaitanya Krishna",
      department: "Pediatrics",
      rating: 5,
      comment: "Our baby was born prematurely at 31 weeks. Dr. Anitha and the Level-III NICU team took care of him like their own child for 24 days. Best pediatric critical care facility in Guntur and Amaravati region.",
      isApproved: true,
    },
    {
      patientName: "K. Padmavathi",
      department: "Gynecology & Obstetrics",
      rating: 5,
      comment: "Dr. Kavitha helped me navigate a high-risk pregnancy with gestational diabetes with immense calm and clarity. Delivered a healthy baby boy via normal delivery. Extremely clean hospital rooms.",
      isApproved: true,
    },
  ];

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }

  // 12. Health Articles
  const articles = [
    {
      title: "Understanding the Golden Hour in Cardiac Arrest & Heart Attacks",
      slug: "understanding-the-golden-hour-in-heart-attacks",
      excerpt: "Why the first 60 minutes after the onset of chest discomfort can be the difference between complete recovery and permanent heart muscle damage.",
      content: `Every second counts when a coronary artery is blocked. In cardiology, the 'Golden Hour' refers to the critical initial 60 minutes following the onset of heart attack symptoms. 

### Key Symptoms to Watch For:
- Crushing pressure or tightness in the center of the chest.
- Pain radiating to the left arm, jaw, neck, or back.
- Unexplained sudden cold sweat, shortness of breath, or nausea.

### What Should You Do?
1. **Never wait:** Do not assume it is simple gastric acidity if symptoms persist for more than 5 minutes.
2. **Call Emergency Immediately:** Dial AIMS Prime Emergency at +91 863 234 5678.
3. **Chew Aspirin 300mg** if advised by emergency paramedics while the ambulance is en route.

Our digital cath lab in Guntur provides 24/7 Primary Percutaneous Coronary Intervention (PCI) to restore blood flow swiftly.`,
      category: "CARDIOLOGY",
      authorName: "Dr. Ramesh Chandra, DM (Cardio)",
      readTimeMinutes: 4,
      image: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&w=800&q=80",
      isPublished: true,
    },
    {
      title: "Robotic Joint Replacement: How Modern Technology Speeds Up Recovery",
      slug: "robotic-joint-replacement-fast-track-recovery",
      excerpt: "Learn how CT-free robotic surgical systems offer 0.5mm precision in knee replacements, reducing bone loss and promoting same-day mobilization.",
      content: `Knee pain due to severe osteoarthritis no longer means weeks of bed rest. With advanced robotic knee replacement at AIMS Prime Hospital Guntur, patients experience a revolutionary leap in surgical accuracy.

### Benefits of Robotic Surgery:
- **Sub-millimeter Accuracy:** The robotic arm assists the surgeon in aligning the implant precisely matching your unique joint anatomy.
- **Minimal Soft Tissue Damage:** Spares healthy ligaments and muscle tissues.
- **Less Blood Loss & Pain:** Allows most patients to walk with support within 24 hours of surgery.
- **Extended Implant Longevity:** Perfect alignment ensures minimum wear and tear over 20-25 years.`,
      category: "ORTHOPEDICS",
      authorName: "Dr. Suresh Babu Kilaru, MS (Ortho)",
      readTimeMinutes: 5,
      image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80",
      isPublished: true,
    },
    {
      title: "Managing Type-2 Diabetes: Essential Steps for Long-Term Organ Protection",
      slug: "managing-type-2-diabetes-organ-protection",
      excerpt: "Controlling blood glucose is only half the battle. Protect your kidneys, eyes, and heart with proactive comprehensive screening.",
      content: `In India, diabetes often progresses silently. While elevated blood sugar is the marker, the real clinical goal of diabetology is vascular protection.

### Essential Quarterly & Annual Checks:
- **HbA1c test every 3 months:** Aim for an HbA1c below 7.0% or personalized targets.
- **Urine Microalbumin/Creatinine Ratio:** Early indicator of diabetic nephropathy before serum creatinine rises.
- **Dilated Eye Exam:** Annual fundoscopy to prevent diabetic retinopathy.
- **Foot Sensation Assessment:** Monofilament testing for diabetic peripheral neuropathy.

Eat whole grains, stay hydrated with Guntur's warm climate, and walk at least 40 minutes daily.`,
      category: "GENERAL_MEDICINE",
      authorName: "Dr. Venkat Rao Guntupalli, MD",
      readTimeMinutes: 6,
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
      isPublished: true,
    },
  ];

  for (const art of articles) {
    await prisma.healthArticle.create({ data: art });
  }

  // 13. FAQs
  const faqs = [
    {
      question: "How do I book an appointment with a specialist doctor?",
      answer: "You can book easily online through our Appointment Wizard in 6 simple steps. Choose your desired department, select the doctor, pick a date and convenient time slot, provide patient details, and receive immediate SMS/online confirmation. You can also call our appointment desk at +91 863 234 5600.",
      category: "APPOINTMENTS",
      orderIndex: 1,
    },
    {
      question: "Is emergency and trauma care available 24 hours a day?",
      answer: "Yes, our Emergency & Level-1 Trauma Department operates 24 hours a day, 365 days a year with full-time emergency physicians, on-call trauma surgeons, 24/7 blood bank, CT/X-Ray services, and ACLS ambulances.",
      category: "EMERGENCY",
      orderIndex: 2,
    },
    {
      question: "Can I cancel or reschedule my booked appointment?",
      answer: "Yes. Patients can log into their Patient Dashboard, navigate to 'My Appointments', and easily reschedule to another available slot or cancel with zero penalty up to 2 hours before the scheduled time.",
      category: "APPOINTMENTS",
      orderIndex: 3,
    },
    {
      question: "Do you accept health insurance and cashless TPA facilities?",
      answer: "AIMS Prime Hospital is empanelled with all major national health insurance providers and Third-Party Administrators (TPAs) including Star Health, Care Health, HDFC ERGO, ICICI Lombard, Medi Assist, Vidal, and Andhra Pradesh government health schemes. Cashless desk is open 24/7 at the ground floor.",
      category: "BILLING",
      orderIndex: 4,
    },
    {
      question: "What documents should I bring for my first consultation?",
      answer: "Please bring a valid photo ID (Aadhaar or Driving License), any previous medical records, ongoing prescription medications, diagnostic reports (ECG, X-Ray, blood tests), and your insurance health card if seeking cashless admission.",
      category: "GENERAL",
      orderIndex: 5,
    },
    {
      question: "How does your system prevent double booking of doctor slots?",
      answer: "Our booking engine uses strict database-level unique constraints and transactions. The moment a slot is confirmed, it is locked in real-time, preventing concurrent overlap across online and front-desk bookings.",
      category: "APPOINTMENTS",
      orderIndex: 6,
    },
  ];

  for (const f of faqs) {
    await prisma.faq.create({ data: f });
  }

  // 14. Initial Notifications
  await prisma.notification.create({
    data: {
      userId: patientUser1.id,
      title: "Appointment Checked-In",
      message: "You are checked in for your Cardiology consultation today with Dr. Ramesh Chandra at 10:00 AM.",
      type: "APPOINTMENT",
      link: "/patient/appointments",
    },
  });

  await prisma.notification.create({
    data: {
      userId: adminUser.id,
      title: "System Initialized",
      message: "AIMS Prime Hospital Management System has been initialized with Guntur master data.",
      type: "SUCCESS",
      link: "/admin/dashboard",
    },
  });

  // 15. Audit Logs
  await prisma.auditLog.create({
    data: {
      userId: adminUser.id,
      action: "SYSTEM_SEED",
      entity: "Database",
      entityId: "initial",
      details: "Initialized master data for 8 departments, 6 specialists, health packages, and hospital settings in Guntur.",
      ipAddress: "127.0.0.1",
    },
  });

  console.log("✅ Seeding completed successfully!");
  console.log("\nDemo Credentials:");
  console.log("--------------------------------------------------");
  console.log("ADMIN:        admin@aimshospital.com      / Admin@1234");
  console.log("DOCTOR:       dr.ramesh@aimshospital.com  / Doctor@1234");
  console.log("RECEPTIONIST: reception@aimshospital.com  / Reception@1234");
  console.log("PATIENT:      patient@aimshospital.com    / Patient@1234");
  console.log("--------------------------------------------------\n");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
