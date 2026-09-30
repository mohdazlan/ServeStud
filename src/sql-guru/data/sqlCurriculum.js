/**
 * SQL-Guru Curriculum Data
 * Inspired by UTP Research: "Integrating Generative AI into SQL Learning: A Usability Study of a Prompt-Based Web Tutor"
 * Authors: Norshadila Ahmad Badela & Anton Satria Prabuwono (UTP)
 * Reference e-Book: https://norshaab.github.io/sql-ai-ebook/
 */

export const DATABASE_SCHEMAS = {
  dreamhome: {
    name: 'DreamHome Rental DB',
    description: 'Relational database for a property rental agency with Branches, Staff, and Properties.',
    tables: {
      Branch: {
        description: 'Agency branch offices across cities.',
        columns: [
          { name: 'branchNo', type: 'VARCHAR(4)', pk: true, notNull: true, desc: 'Unique branch code (e.g., B001)' },
          { name: 'street', type: 'VARCHAR(50)', pk: false, notNull: true, desc: 'Street address' },
          { name: 'city', type: 'VARCHAR(30)', pk: false, notNull: true, desc: 'City location' },
          { name: 'postcode', type: 'VARCHAR(10)', pk: false, notNull: true, desc: 'Postal code' },
        ],
        data: [
          { branchNo: 'B001', street: '8 Jefferson Way', city: 'Kuala Lumpur', postcode: '50450' },
          { branchNo: 'B002', street: '16 Argyll Road', city: 'Ipoh', postcode: '30000' },
          { branchNo: 'B003', street: '163 Main St', city: 'Penang', postcode: '10100' },
          { branchNo: 'B004', street: '32 Manse Rd', city: 'Johor Bahru', postcode: '80000' },
          { branchNo: 'B005', street: '22 Deer Rd', city: 'Kuantan', postcode: '25000' },
        ],
      },
      Staff: {
        description: 'Employees managing properties and customer contracts.',
        columns: [
          { name: 'staffNo', type: 'VARCHAR(5)', pk: true, notNull: true, desc: 'Employee ID (e.g. SL21)' },
          { name: 'fName', type: 'VARCHAR(20)', pk: false, notNull: true, desc: 'First name' },
          { name: 'lName', type: 'VARCHAR(20)', pk: false, notNull: true, desc: 'Last name' },
          { name: 'position', type: 'VARCHAR(20)', pk: false, notNull: true, desc: 'Job designation' },
          { name: 'sex', type: 'CHAR(1)', pk: false, notNull: true, desc: 'Gender (M/F)' },
          { name: 'salary', type: 'DECIMAL(8,2)', pk: false, notNull: true, desc: 'Monthly salary (RM)' },
          { name: 'branchNo', type: 'VARCHAR(4)', pk: false, fk: 'Branch.branchNo', notNull: true, desc: 'Assigned branch' },
        ],
        data: [
          { staffNo: 'SL21', fName: 'John', lName: 'White', position: 'Manager', sex: 'M', salary: 30000, branchNo: 'B001' },
          { staffNo: 'SG37', fName: 'Ann', lName: 'Beech', position: 'Assistant', sex: 'F', salary: 12000, branchNo: 'B003' },
          { staffNo: 'SG14', fName: 'David', lName: 'Ford', position: 'Supervisor', sex: 'M', salary: 18000, branchNo: 'B003' },
          { staffNo: 'SA9', fName: 'Mary', lName: 'Howe', position: 'Assistant', sex: 'F', salary: 9000, branchNo: 'B002' },
          { staffNo: 'SG5', fName: 'Susan', lName: 'Brand', position: 'Manager', sex: 'F', salary: 24000, branchNo: 'B003' },
          { staffNo: 'SL41', fName: 'Julie', lName: 'Lee', position: 'Assistant', sex: 'F', salary: 9000, branchNo: 'B001' },
        ],
      },
      PropertyForRent: {
        description: 'Properties available for rental by clients.',
        columns: [
          { name: 'propertyNo', type: 'VARCHAR(5)', pk: true, notNull: true, desc: 'Property identifier' },
          { name: 'street', type: 'VARCHAR(40)', pk: false, notNull: true, desc: 'Property street' },
          { name: 'city', type: 'VARCHAR(30)', pk: false, notNull: true, desc: 'City location' },
          { name: 'postcode', type: 'VARCHAR(10)', pk: false, notNull: true, desc: 'Postal code' },
          { name: 'type', type: 'VARCHAR(10)', pk: false, notNull: true, desc: 'Flat/House' },
          { name: 'rooms', type: 'INT', pk: false, notNull: true, desc: 'Number of bedrooms' },
          { name: 'rent', type: 'DECIMAL(7,2)', pk: false, notNull: true, desc: 'Monthly rent (RM)' },
          { name: 'staffNo', type: 'VARCHAR(5)', pk: false, fk: 'Staff.staffNo', notNull: false, desc: 'Overseeing staff ID' },
          { name: 'branchNo', type: 'VARCHAR(4)', pk: false, fk: 'Branch.branchNo', notNull: true, desc: 'Managing branch' },
        ],
        data: [
          { propertyNo: 'PA14', street: '16 Holhead', city: 'Ipoh', postcode: '30000', type: 'House', rooms: 6, rent: 650, staffNo: 'SA9', branchNo: 'B002' },
          { propertyNo: 'PL94', street: '6 Argyll St', city: 'Kuala Lumpur', postcode: '50450', type: 'Flat', rooms: 4, rent: 400, staffNo: 'SL41', branchNo: 'B001' },
          { propertyNo: 'PG4', street: '6 Lawrence St', city: 'Penang', postcode: '10100', type: 'Flat', rooms: 3, rent: 350, staffNo: 'SG14', branchNo: 'B003' },
          { propertyNo: 'PG36', street: '2 Manor Rd', city: 'Penang', postcode: '10100', type: 'Flat', rooms: 3, rent: 375, staffNo: 'SG37', branchNo: 'B003' },
          { propertyNo: 'PG21', street: '18 Dale Rd', city: 'Penang', postcode: '10100', type: 'House', rooms: 5, rent: 600, staffNo: 'SG37', branchNo: 'B003' },
          { propertyNo: 'PG16', street: '5 Novar Dr', city: 'Penang', postcode: '10100', type: 'Flat', rooms: 4, rent: 450, staffNo: 'SG14', branchNo: 'B003' },
        ],
      },
    },
  },
  politeknik: {
    name: 'Politeknik Student Portal DB',
    description: 'Database for academic courses, enrolled polytechnic students, and exam grades.',
    tables: {
      Students: {
        description: 'Registered polytechnic diploma students.',
        columns: [
          { name: 'student_id', type: 'VARCHAR(12)', pk: true, notNull: true, desc: 'Matrix Number (e.g. 01DDT23F1001)' },
          { name: 'name', type: 'VARCHAR(50)', pk: false, notNull: true, desc: 'Full student name' },
          { name: 'program', type: 'VARCHAR(10)', pk: false, notNull: true, desc: 'Diploma program code' },
          { name: 'semester', type: 'INT', pk: false, notNull: true, desc: 'Current study semester' },
          { name: 'cgpa', type: 'DECIMAL(3,2)', pk: false, notNull: true, desc: 'Cumulative GPA' },
        ],
        data: [
          { student_id: '01DDT23F1001', name: 'Ahmad Faiz', program: 'DDT', semester: 4, cgpa: 3.75 },
          { student_id: '01DDT23F1002', name: 'Nur Aisyah', program: 'DDT', semester: 4, cgpa: 3.88 },
          { student_id: '01DDT23F1003', name: 'Chong Wei Lun', program: 'DDT', semester: 3, cgpa: 3.42 },
          { student_id: '01DNS23F1004', name: 'Siti Sarah', program: 'DNS', semester: 5, cgpa: 3.65 },
          { student_id: '01DNS23F1005', name: 'Kavitha Devi', program: 'DNS', semester: 5, cgpa: 3.10 },
          { student_id: '01DDT23F1006', name: 'Muhammad Danish', program: 'DDT', semester: 2, cgpa: 2.95 },
        ],
      },
      Courses: {
        description: 'Curriculum courses offered in the Department of Information Technology.',
        columns: [
          { name: 'course_code', type: 'VARCHAR(10)', pk: true, notNull: true, desc: 'Course code (e.g. DFP50283)' },
          { name: 'title', type: 'VARCHAR(50)', pk: false, notNull: true, desc: 'Course title' },
          { name: 'credit_hours', type: 'INT', pk: false, notNull: true, desc: 'Credit units' },
        ],
        data: [
          { course_code: 'DFP50283', title: 'Java Web Technologies', credit_hours: 3 },
          { course_code: 'DFP50193', title: 'Database Administration', credit_hours: 3 },
          { course_code: 'DFP40203', title: 'Data Structures & Algorithms', credit_hours: 3 },
          { course_code: 'DFP30133', title: 'Web Design Technologies', credit_hours: 3 },
        ],
      },
      Enrollments: {
        description: 'Course registrations and final exam grades.',
        columns: [
          { name: 'enrollment_id', type: 'INT', pk: true, notNull: true, desc: 'Auto increment ID' },
          { name: 'student_id', type: 'VARCHAR(12)', pk: false, fk: 'Students.student_id', notNull: true, desc: 'Student matrix' },
          { name: 'course_code', type: 'VARCHAR(10)', pk: false, fk: 'Courses.course_code', notNull: true, desc: 'Course code' },
          { name: 'grade', type: 'VARCHAR(2)', pk: false, notNull: false, desc: 'Earned grade (A, A-, B+, etc.)' },
          { name: 'mark', type: 'INT', pk: false, notNull: false, desc: 'Final score out of 100' },
        ],
        data: [
          { enrollment_id: 1, student_id: '01DDT23F1001', course_code: 'DFP50283', grade: 'A', mark: 88 },
          { enrollment_id: 2, student_id: '01DDT23F1001', course_code: 'DFP50193', grade: 'A-', mark: 82 },
          { enrollment_id: 3, student_id: '01DDT23F1002', course_code: 'DFP50283', grade: 'A+', mark: 94 },
          { enrollment_id: 4, student_id: '01DDT23F1003', course_code: 'DFP50283', grade: 'B', mark: 68 },
          { enrollment_id: 5, student_id: '01DNS23F1004', course_code: 'DFP50193', grade: 'A', mark: 85 },
          { enrollment_id: 6, student_id: '01DNS23F1005', course_code: 'DFP50193', grade: 'B-', mark: 60 },
        ],
      },
    },
  },
}

export const SQL_ACTIVITIES = [
  {
    id: 'activity-1',
    category: 'DDL - Table Creation',
    title: 'Aktiviti 1: Bina Jadual Cawangan (CREATE TABLE)',
    subtitle: 'Membina jadual relasi dengan Primary Key & Not Null constraint (Diinspirasi oleh Rajah 1 Kajian)',
    dbKey: 'dreamhome',
    paperReference: 'Figure 1 in UTP Research Paper: GenAI Feedback for CREATE TABLE Branch',
    level: 'Asas (Beginner)',
    estimatedMinutes: 5,
    scenario:
      'Agensi hartanah DreamHome memerlukan jadual baharu untuk menyimpan rekod cawangan (Branch). Setiap cawangan mempunyai nombor cawangan (branchNo) sebagai Kunci Utama, alamat jalan (street), bandar (city), dan poskod (postcode). Pastikan semua kolum tidak boleh dibiarkan kosong (NOT NULL) dan panjang aksara sesuai.',
    targetGoal:
      'Tulis arahan SQL DDL untuk mencipta jadual bernama `Branch` dengan 4 medan: branchNo (Primary Key), street (VARCHAR 50), city (VARCHAR 50), dan postcode (VARCHAR 10).',
    starterCode: `-- Tulis arahan CREATE TABLE di sini
CREATE TABLE Branch (
    branchNo VARCHAR(4) PRIMARY KEY,
    -- Lengkapkan kolum seterusnya:
);`,
    solutionPatterns: [
      /CREATE\s+TABLE\s+Branch\s*\(\s*branchNo\s+(?:VARCHAR\(\d+\)|INT|CHAR\(\d+\))\s+PRIMARY\s+KEY/i,
      /street\s+VARCHAR\(\d+\)\s+NOT\s+NULL/i,
      /city\s+VARCHAR\(\d+\)\s+NOT\s+NULL/i,
      /postcode\s+VARCHAR\(\d+\)\s+NOT\s+NULL/i,
    ],
    expectedCode: `CREATE TABLE Branch (
    branchNo VARCHAR(4) PRIMARY KEY,
    street VARCHAR(50) NOT NULL,
    city VARCHAR(50) NOT NULL,
    postcode VARCHAR(10) NOT NULL
);`,
    hints: [
      {
        level: 1,
        title: '💡 Petunjuk Struktur Asas',
        text: 'Sintaks asas CREATE TABLE mengikut format: `CREATE TABLE nama_jadual ( nama_kolum jenis_data syarat, ... );`. Pastikan anda meletakkan koma di antara definisi medan.',
      },
      {
        level: 2,
        title: '💡 Petunjuk Jenis Data & Kekangan',
        text: 'Gunakan `VARCHAR(50)` untuk nama jalan dan bandar. Untuk poskod, gunakan `VARCHAR(10)`. Tambahkan `NOT NULL` selepas jenis data pada setiap medan.',
      },
      {
        level: 3,
        title: '💡 Petunjuk Kunci Utama (Primary Key)',
        text: 'Medan `branchNo` mesti ditetapkan sebagai `PRIMARY KEY`. Anda boleh menulis `branchNo VARCHAR(4) PRIMARY KEY,` atau meletakkan `PRIMARY KEY (branchNo)` di bahagian akhir senarai kolum.',
      },
    ],
    validationType: 'ddl_create_table',
    expectedTable: 'Branch',
    expectedColumns: ['branchNo', 'street', 'city', 'postcode'],
  },
  {
    id: 'activity-2',
    category: 'DML - SELECT & Filtering',
    title: 'Aktiviti 2: Pertanyaan Asas Staf & Penapisan (WHERE & ORDER BY)',
    subtitle: 'Mendapatkan senarai staf bergaji tinggi disusun mengikut abjad',
    dbKey: 'dreamhome',
    level: 'Asas (Beginner)',
    estimatedMinutes: 5,
    scenario:
      'Pihak pengurusan DreamHome ingin melihat senarai kakitangan yang mempunyai gaji (salary) melebihi RM 10,000. Paparkan nama pertama (fName), nama keluarga (lName), jawatan (position), dan gaji (salary). Susunkan senarai mengikut gaji secara menurun (paling tinggi ke rendah).',
    targetGoal:
      'Tulis pertanyaan SELECT dari jadual `Staff` di mana `salary > 10000`, dan susun mengikut `salary DESC`.',
    starterCode: `SELECT fName, lName, position, salary
FROM Staff
WHERE -- Lengkapkan syarat penapisan
ORDER BY -- Lengkapkan susunan;`,
    solutionPatterns: [
      /SELECT\s+[\s\S]*fName[\s\S]*lName[\s\S]*position[\s\S]*salary\s+FROM\s+Staff/i,
      /WHERE\s+salary\s*>\s*10000/i,
      /ORDER\s+BY\s+salary\s+DESC/i,
    ],
    expectedCode: `SELECT fName, lName, position, salary
FROM Staff
WHERE salary > 10000
ORDER BY salary DESC;`,
    hints: [
      {
        level: 1,
        title: '💡 Petunjuk Pemilihan Kolum',
        text: 'Pastikan klausa SELECT menyenaraikan `fName, lName, position, salary` dipisahkan oleh tanda koma, dan jadual sasaran ialah `Staff`.',
      },
      {
        level: 2,
        title: '💡 Petunjuk Klausa WHERE',
        text: 'Gunakan operator perbandingan matematik `salary > 10000` tanpa meletakkan simbol mata wang atau tanda koma pada angka ribuan.',
      },
      {
        level: 3,
        title: '💡 Petunjuk Pengisihan (ORDER BY)',
        text: 'Klausa `ORDER BY salary DESC` akan menyusun data secara menurun (Descending Order). Jika menaik, ia menggunakan `ASC`.',
      },
    ],
    validationType: 'query_select',
    expectedRowsCount: 4,
    requiredColumns: ['fName', 'lName', 'position', 'salary'],
  },
  {
    id: 'activity-3',
    category: 'Aggregations & Grouping',
    title: 'Aktiviti 3: Pengiraan Agregat Cawangan (COUNT, AVG, GROUP BY)',
    subtitle: 'Analisis bilangan hartanah dan purata sewa bagi setiap bandar',
    dbKey: 'dreamhome',
    level: 'Sederhana (Intermediate)',
    estimatedMinutes: 7,
    scenario:
      'Pasukan analitik ingin menganalisis pasaran sewa hartanah. Paparkan nama bandar (city), jumlah bilangan hartanah (COUNT), dan purata harga sewa (AVG) bagi setiap bandar dari jadual `PropertyForRent`. Kumpulkan hasil mengikut bandar.',
    targetGoal:
      'Tulis pertanyaan SELECT yang memaparkan `city`, `COUNT(propertyNo) AS total_properties`, dan `AVG(rent) AS avg_rent` dikelompokkan dengan `GROUP BY city`.',
    starterCode: `SELECT 
    city,
    COUNT(propertyNo) AS total_properties,
    -- Kira purata sewa di sini
FROM PropertyForRent
GROUP BY -- Lengkapkan kumpulan;`,
    solutionPatterns: [
      /SELECT\s+[\s\S]*city[\s\S]*COUNT\(.*\)[\s\S]*AVG\(\s*rent\s*\)/i,
      /FROM\s+PropertyForRent/i,
      /GROUP\s+BY\s+city/i,
    ],
    expectedCode: `SELECT 
    city,
    COUNT(propertyNo) AS total_properties,
    AVG(rent) AS avg_rent
FROM PropertyForRent
GROUP BY city;`,
    hints: [
      {
        level: 1,
        title: '💡 Petunjuk Fungsi Agregat',
        text: 'Fungsi SQL `COUNT(propertyNo)` digunakan untuk mengira kuantiti baris, manakala `AVG(rent)` mengira nilai purata sewa.',
      },
      {
        level: 2,
        title: '💡 Petunjuk GROUP BY',
        text: 'Setiap kali anda memilih kolum biasa (bukan agregat) seperti `city` bersama fungsi agregat, anda WAJIB menyertakan `GROUP BY city`.',
      },
      {
        level: 3,
        title: '💡 Petunjuk Alias (AS)',
        text: 'Gunakan kata kunci `AS total_properties` dan `AS avg_rent` untuk memberi nama label yang kemas kepada lajur hasil kiraan.',
      },
    ],
    validationType: 'query_select',
    expectedRowsCount: 3,
    requiredColumns: ['city'],
  },
  {
    id: 'activity-4',
    category: 'Relational Multi-Table (JOIN)',
    title: 'Aktiviti 4: Gabungan Jadual Staf & Cawangan (INNER JOIN)',
    subtitle: 'Menghubungkan rekod kakitangan dengan alamat cawangan fizikal mereka',
    dbKey: 'dreamhome',
    level: 'Sederhana (Intermediate)',
    estimatedMinutes: 8,
    scenario:
      'HR memerlukan laporan penuh penempatan staf. Paparkan nama staf (fName, lName), jawatan (position), nombor cawangan (branchNo), dan bandar cawangan (city). Hubungkan jadual `Staff` dengan jadual `Branch` menggunakan kunci sepadan `branchNo`.',
    targetGoal:
      'Tulis pertanyaan `INNER JOIN` antara `Staff` (s) dan `Branch` (b) atas syarat `s.branchNo = b.branchNo`.',
    starterCode: `SELECT 
    Staff.fName,
    Staff.lName,
    Staff.position,
    Branch.branchNo,
    Branch.city
FROM Staff
INNER JOIN Branch ON -- Lengkapkan syarat pemadanan kunci;`,
    solutionPatterns: [
      /SELECT\s+[\s\S]*fName[\s\S]*lName[\s\S]*position[\s\S]*branchNo[\s\S]*city/i,
      /FROM\s+Staff\s+(?:AS\s+s\s+)?(?:INNER\s+)?JOIN\s+Branch/i,
      /ON\s+(?:Staff|s)\.branchNo\s*=\s*(?:Branch|b)\.branchNo/i,
    ],
    expectedCode: `SELECT 
    Staff.fName,
    Staff.lName,
    Staff.position,
    Branch.branchNo,
    Branch.city
FROM Staff
INNER JOIN Branch ON Staff.branchNo = Branch.branchNo;`,
    hints: [
      {
        level: 1,
        title: '💡 Petunjuk Konsep Relasi (Foreign Key)',
        text: 'Jadual `Staff` mempunyai medan Foreign Key `branchNo` yang merujuk kepada Primary Key `branchNo` dalam jadual `Branch`.',
      },
      {
        level: 2,
        title: '💡 Petunjuk Klausa ON',
        text: 'Klausa pemadanan ditulis sebagai `ON Staff.branchNo = Branch.branchNo`. Anda juga boleh menggunakan alias jadual (contoh: `FROM Staff s JOIN Branch b ON s.branchNo = b.branchNo`).',
      },
      {
        level: 3,
        title: '💡 Petunjuk Ambiguiti Kolum',
        text: 'Kerana `branchNo` wujud dalam kedua-dua jadual, anda perlu menentukan jadual asal seperti `Staff.branchNo` atau `Branch.branchNo` untuk mengelakkan ralat ambiguiti.',
      },
    ],
    validationType: 'query_select',
    expectedRowsCount: 6,
    requiredColumns: ['fName', 'lName', 'position', 'city'],
  },
  {
    id: 'activity-5',
    category: 'Subqueries & Nested Logic',
    title: 'Aktiviti 5: Subquery Gaji Lebih Tinggi Daripada Purata',
    subtitle: 'Menggunakan anak pertanyaan (subquery) untuk penapisan dinamik',
    dbKey: 'dreamhome',
    level: 'Lanjutan (Advanced)',
    estimatedMinutes: 8,
    scenario:
      'Cari semua staf yang menerima gaji melebihi purata gaji keseluruhan syarikat. Paparkan `staffNo`, `fName`, `lName`, dan `salary`. Gunakan subquery dalam klausa `WHERE` untuk mengira purata gaji secara automatik.',
    targetGoal:
      'Tulis SELECT dari `Staff` dengan `WHERE salary > (SELECT AVG(salary) FROM Staff)`.',
    starterCode: `SELECT staffNo, fName, lName, salary
FROM Staff
WHERE salary > (
    -- Tulis subquery untuk purata gaji di sini
);`,
    solutionPatterns: [
      /SELECT\s+[\s\S]*staffNo[\s\S]*fName[\s\S]*lName[\s\S]*salary\s+FROM\s+Staff/i,
      /WHERE\s+salary\s*>\s*\(\s*SELECT\s+AVG\(\s*salary\s*\)\s+FROM\s+Staff\s*\)/i,
    ],
    expectedCode: `SELECT staffNo, fName, lName, salary
FROM Staff
WHERE salary > (SELECT AVG(salary) FROM Staff);`,
    hints: [
      {
        level: 1,
        title: '💡 Petunjuk Konsep Subquery',
        text: 'Subquery ialah pertanyaan SQL yang diletakkan di dalam kurungan `( ... )` dan dieksekusi terlebih dahulu sebelum pertanyaan utama.',
      },
      {
        level: 2,
        title: '💡 Petunjuk Pengiraan Purata Dalam Kurungan',
        text: 'Di dalam kurungan, tulis `SELECT AVG(salary) FROM Staff`. Hasil nilai purata tunggal (skalar) ini akan dibandingkan dengan kolum `salary` baris demi baris.',
      },
      {
        level: 3,
        title: '💡 Petunjuk Logik Penapisan',
        text: 'Purata gaji staf ialah RM 18,666.67. Oleh itu, subquery akan menapis John White (30,000) dan Susan Brand (24,000).',
      },
    ],
    validationType: 'query_select',
    expectedRowsCount: 2,
    requiredColumns: ['staffNo', 'fName', 'lName', 'salary'],
  },
  {
    id: 'activity-6',
    category: 'Politeknik Student Portal',
    title: 'Aktiviti 6: Senarai Pelajar Cemerlang & Kursus (DDT/DNS)',
    subtitle: 'Menapis gred pelajar DFP50283 dan menyusun mengikut markah peperiksaan',
    dbKey: 'politeknik',
    level: 'Sederhana (Intermediate)',
    estimatedMinutes: 6,
    scenario:
      'Pensyarah kursus DFP50283 (Java Web Technologies) ingin melihat senarai pelajar yang mengambil kursus ini beserta markah dan gred mereka. Paparkan nama pelajar (name), kod kursus (course_code), markah (mark), dan gred (grade). Susun mengikut markah tertinggi (DESC).',
    targetGoal:
      'Gabungkan jadual `Students` dan `Enrollments` atas `student_id`, tapis `course_code = \'DFP50283\'`, dan susun `ORDER BY mark DESC`.',
    starterCode: `SELECT 
    Students.name,
    Enrollments.course_code,
    Enrollments.mark,
    Enrollments.grade
FROM Students
INNER JOIN Enrollments ON Students.student_id = Enrollments.student_id
WHERE -- Tapis kursus DFP50283
ORDER BY -- Susun markah tertinggi;`,
    solutionPatterns: [
      /SELECT\s+[\s\S]*name[\s\S]*course_code[\s\S]*mark[\s\S]*grade/i,
      /FROM\s+Students\s+(?:INNER\s+)?JOIN\s+Enrollments/i,
      /WHERE\s+(?:Enrollments\.)?course_code\s*=\s*['"]DFP50283['"]/i,
      /ORDER\s+BY\s+(?:Enrollments\.)?mark\s+DESC/i,
    ],
    expectedCode: `SELECT 
    Students.name,
    Enrollments.course_code,
    Enrollments.mark,
    Enrollments.grade
FROM Students
INNER JOIN Enrollments ON Students.student_id = Enrollments.student_id
WHERE Enrollments.course_code = 'DFP50283'
ORDER BY Enrollments.mark DESC;`,
    hints: [
      {
        level: 1,
        title: '💡 Petunjuk Klausa WHERE Teks',
        text: 'Nilai rentetan (string) dalam SQL mesti diapit dengan tanda petik tunggal, seperti `course_code = \'DFP50283\'`.',
      },
      {
        level: 2,
        title: '💡 Petunjuk Padanan Relasi',
        text: 'Padankan `Students.student_id = Enrollments.student_id` untuk menghubungkan maklumat peribadi pelajar dengan rekod markahnya.',
      },
      {
        level: 3,
        title: '💡 Petunjuk Pengisihan Markah',
        text: 'Gunakan `ORDER BY mark DESC` supaya pelajar yang mendapat markah tertinggi (Nur Aisyah: 94) muncul di kedudukan pertama.',
      },
    ],
    validationType: 'query_select',
    expectedRowsCount: 3,
    requiredColumns: ['name', 'course_code', 'mark', 'grade'],
  },
]

export const RESEARCH_STUDY_INFO = {
  title: 'Integrating Generative AI into SQL Learning: A Usability Study of a Prompt-Based Web Tutor',
  authors: [
    { name: 'Norshadila Ahmad Badela', affiliation: 'Universiti Teknologi PETRONAS (UTP)', email: 'norshadila_24004187@utp.edu.my' },
    { name: 'Dr. Anton Satria Prabuwono', affiliation: 'Universiti Teknologi PETRONAS (UTP)' },
  ],
  conference: 'IUCEL 2025 / UTEM (International University Carnival on E-Learning)',
  surveyUrl: 'https://forms.gle/2K4PAZoXit5xKhZ49',
  referenceAppUrl: 'https://norshaab.github.io/sql-ai-ebook/',
  demoVideoUrl: 'https://youtu.be/jXBfQCEsuyE',
  tamConstructs: [
    { name: 'Perceived Usefulness (PU)', score: 4.66, std: 0.47, desc: 'Tutor AI membantu meningkatkan kefahaman sintaks dan logik query SQL secara signifikan.' },
    { name: 'Perceived Ease of Use (PEOU)', score: 4.59, std: 0.52, desc: 'Antara muka mesra pengguna, mudah dikemudi, dan intuitif untuk pemula.' },
    { name: 'Perceived Interactivity (PI)', score: 4.62, std: 0.50, desc: 'Maklum balas masa-nyata dan petunjuk bertingkat menghasilkan interaksi aktif.' },
    { name: 'User Satisfaction (US)', score: 4.63, std: 0.50, desc: 'Pelajar dan pensyarah berpuas hati dengan pengalaman pembelajaran berpandu AI.' },
    { name: 'Learning Engagement (LE - Student)', score: 4.60, std: 0.52, desc: 'Mendorong motivasi intrinsik dan amalan penyelesaian masalah kendiri.' },
    { name: 'Instructional Relevance (IR - Lecturer)', score: 4.69, std: 0.42, desc: 'Skor tertinggi: Menjimatkan masa pensyarah dalam membetulkan ralat lazim.' },
    { name: 'Behavioural Intention to Use (BI)', score: 4.61, std: 0.51, desc: 'Hasrat tinggi untuk terus menggunakan tutor AI dalam kursus pangkalan data masa hadapan.' },
  ],
  nationalAlignment: [
    'MyDIGITAL — Blueprint Ekonomi Digital Malaysia',
    'Malaysia Education Blueprint 2015–2025 (Higher Education)',
    'National AI Roadmap 2021–2025 (MOSTI)',
  ],
}
