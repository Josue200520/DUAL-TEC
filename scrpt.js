let currentLoginType = 'alumno';

// Base de datos inicial de egresados
let graduatesData = [
    { id: 1, matricula: "A00823451", nombre: "Ana Sofía Garza Martínez", email: "ana.garza@universidad.edu", carrera: "Ing. en Sistemas Computacionales", anio: 2025, promedio: "94.5", estatus: "Titulado" },
    { id: 2, matricula: "A00791243", nombre: "Carlos Eduardo Ruiz", email: "carlos.ruiz@universidad.edu", carrera: "Lic. en Administración Financiera", anio: 2026, promedio: "89.0", estatus: "En Titulación" },
    { id: 3, matricula: "A00845112", nombre: "María Fernanda López", email: "maria.lopez@universidad.edu", carrera: "Ingeniería Industrial y de Sistemas", anio: 2025, promedio: "92.1", estatus: "Titulado" }
];

const adminCredentials = { user: 'admin.vinculacion', pass: 'admin123' };
let currentLoggedStudent = null;

// Cambio de pestañas en la pantalla de Login
// Cambio de pestañas en la pantalla de Login (Corregido para evitar bloqueos)
function selectLoginType(type) {
    currentLoginType = type;
    const tabAlumno = document.getElementById('tab-alumno');
    const tabAdmin = document.getElementById('tab-admin');
    const lblUser = document.getElementById('lbl-user');
    const inputUser = document.getElementById('input-username');
    const loginHint = document.getElementById('login-hint');

    // Limpiar campos
    inputUser.value = '';
    document.getElementById('input-password').value = '';

    if (type === 'alumno') {
        tabAlumno.classList.add('active');
        tabAdmin.classList.remove('active');
        lblUser.textContent = "Correo Electrónico Institucional";
        inputUser.placeholder = "usuario@universidad.edu";
        loginHint.innerHTML = `<p><i class="fa-solid fa-info-circle"></i> <strong>Contraseña por defecto para egresados:</strong> 12345</p>`;
    } else {
        tabAdmin.classList.add('active');
        tabAlumno.classList.remove('active');
        lblUser.textContent = "Usuario Asignado (Administrador)";
        inputUser.placeholder = "admin.vinculacion";
        loginHint.innerHTML = `<p><i class="fa-solid fa-info-circle"></i> <strong>Credenciales Admin:</strong> admin.vinculacion / admin123</p>`;
    }
}

// Validar inicio de sesión
function handleLogin(e) {
    e.preventDefault();
    const userInput = document.getElementById('input-username').value.trim();
    const passInput = document.getElementById('input-password').value.trim();

    if (currentLoginType === 'admin') {
        if (userInput === adminCredentials.user && passInput === adminCredentials.pass) {
            document.getElementById('login-container').style.display = 'none';
            document.getElementById('panel-admin').classList.add('active');
            refreshAllViews();
        } else {
            alert('Usuario o contraseña de administrador incorrectos.\nUsa: admin.vinculacion / admin123');
        }
    } else {
        const studentFound = graduatesData.find(g => g.email.toLowerCase() === userInput.toLowerCase());

        if (studentFound) {
            if (passInput === '12345') {
                currentLoggedStudent = studentFound;
                document.getElementById('alumno-logged-name').textContent = studentFound.nombre;
                
                document.getElementById('login-container').style.display = 'none';
                document.getElementById('panel-alumno').classList.add('active');
                refreshAllViews();
            } else {
                alert('Contraseña incorrecta. La contraseña por defecto es 12345');
            }
        } else {
            alert('El correo ingresado no pertenece a ningún egresado registrado.');
        }
    }
}

// Cerrar sesión
function logout() {
    currentLoggedStudent = null;
    document.getElementById('panel-alumno').classList.remove('active');
    document.getElementById('panel-admin').classList.remove('active');
    document.getElementById('login-container').style.display = 'flex';
    document.getElementById('form-login').reset();
    selectLoginType('alumno');
}

// Base de datos de vacantes
let jobsData = [
    { id: 1, title: "Desarrollador Frontend Jr.", company: "Tech Solutions Inc.", category: "Tecnología", modality: "Remoto", location: "Ciudad de México", salary: "$25,000 - $32,000 MXN", logo: "TS" },
    { id: 2, title: "Analista de Datos", company: "Global Logistics", category: "Tecnología", modality: "Híbrido", location: "Monterrey, NL", salary: "$28,000 MXN", logo: "GL" },
    { id: 3, title: "Ingeniero de Soporte TI", company: "Innovatec Labs", category: "Ingeniería", modality: "Presencial", location: "Guadalajara, JAL", salary: "$20,000 MXN", logo: "IL" },
    { id: 4, title: "Auxiliar Administrativo Financiero", company: "Corporativo B&R", category: "Administración", modality: "Presencial", location: "Querétaro, QRO", salary: "$16,500 MXN", logo: "BR" }
];

// Navegación interna del Alumno
document.querySelectorAll('.nav-link-alumno').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.nav-link-alumno').forEach(l => l.classList.remove('active'));
        document.querySelectorAll('#panel-alumno .tab-content').forEach(t => t.classList.remove('active'));
        link.classList.add('active');
        document.getElementById(link.getAttribute('data-target')).classList.add('active');
    });
});

// Navegación interna del Administrador
document.querySelectorAll('.nav-link-admin').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.nav-link-admin').forEach(l => l.classList.remove('active'));
        document.querySelectorAll('#panel-admin .tab-content').forEach(t => t.classList.remove('active'));
        link.classList.add('active');
        document.getElementById(link.getAttribute('data-target')).classList.add('active');
    });
});

function refreshAllViews() {
    renderJobs(jobsData, 'all-jobs-grid');
    renderJobs(jobsData.slice(0, 3), 'featured-jobs-grid');
    renderAdminJobsList();
    renderGraduatesTable();
    const statVacantes = document.getElementById('stat-vacantes');
    if(statVacantes) statVacantes.textContent = jobsData.length;
}

function renderJobs(jobs, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";

    jobs.forEach(job => {
        const card = document.createElement('div');
        card.className = 'job-card';
        card.innerHTML = `
            <div>
                <div class="job-header">
                    <div class="company-logo">${job.logo}</div>
                    <span class="job-badge">${job.modality}</span>
                </div>
                <div class="job-body">
                    <h3>${job.title}</h3>
                    <p class="job-company-name">${job.company}</p>
                    <div class="job-details-tags">
                        <span><i class="fa-solid fa-location-dot"></i> ${job.location}</span>
                        <span><i class="fa-solid fa-briefcase"></i> ${job.category}</span>
                    </div>
                </div>
            </div>
            <div class="job-footer">
                <span class="salary">${job.salary}</span>
                <button class="btn" onclick="postularse('${job.title}', '${job.company}')">Postularse</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function renderAdminJobsList() {
    const container = document.getElementById('admin-jobs-list');
    if (!container) return;
    container.innerHTML = "";

    jobsData.forEach(job => {
        const item = document.createElement('div');
        item.style.cssText = "display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; background: var(--bg-main); border: 1px solid var(--border); border-radius: 0.5rem;";
        item.innerHTML = `
            <div>
                <h4 style="font-size: 0.9rem;">${job.title}</h4>
                <span style="font-size: 0.75rem; color: var(--text-muted);">${job.company} • ${job.modality}</span>
            </div>
            <button class="btn btn-outline" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; color: #ef4444; border-color: #ef4444;" onclick="deleteJob(${job.id})"><i class="fa-solid fa-trash"></i></button>
        `;
        container.appendChild(item);
    });
}

function renderGraduatesTable() {
    const tbody = document.getElementById('admin-graduates-table-body');
    if (!tbody) return;
    tbody.innerHTML = "";

    graduatesData.forEach(grad => {
        const badgeClass = grad.estatus === 'Titulado' ? 'accepted' : 'review';
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${grad.matricula}</strong></td>
            <td>${grad.nombre}<br><small style="color: var(--text-muted);">${grad.email}</small></td>
            <td>${grad.carrera} (${grad.anio})</td>
            <td>${grad.promedio}</td>
            <td><span class="status-badge ${badgeClass}">${grad.estatus}</span></td>
            <td><button class="btn btn-outline" style="padding: 0.2rem 0.4rem; font-size: 0.75rem;" onclick="alert('Viendo kardex completo de ${grad.nombre}')">Ver</button></td>
        `;
        tbody.appendChild(tr);
    });
}

// Registrar nueva vacante (Admin)
function addNewJob(e) {
    e.preventDefault();
    const title = document.getElementById('jobTitle').value;
    const company = document.getElementById('jobCompany').value;
    const category = document.getElementById('jobCategory').value;
    const modality = document.getElementById('jobModality').value;
    const location = document.getElementById('jobLocation').value;
    const salary = document.getElementById('jobSalary').value;
    const initials = company.split(" ").map(n => n[0]).join("").toUpperCase().substring(0,2);

    jobsData.unshift({ id: Date.now(), title, company, category, modality, location, salary, logo: initials || "EMP" });
    refreshAllViews();
    document.getElementById('formNewJob').reset();
    alert('¡Vacante creada con éxito en la bolsa laboral!');
}

// Registrar nuevo egresado (Admin)
function addNewGraduate(e) {
    e.preventDefault();
    const matricula = document.getElementById('gradMatricula').value;
    const nombre = document.getElementById('gradNombre').value;
    const email = document.getElementById('gradEmail').value.trim();
    const carrera = document.getElementById('gradCarrera').value;
    const anio = document.getElementById('gradAnio').value;
    const promedio = document.getElementById('gradPromedio').value;
    const estatus = document.getElementById('gradEstatus').value;

    graduatesData.unshift({ id: Date.now(), matricula, nombre, email, carrera, anio, promedio, estatus });
    
    refreshAllViews();
    document.getElementById('formNewGraduate').reset();
    alert(`¡Egresado "${nombre}" registrado exitosamente!\n\nEl alumno ya puede iniciar sesión con:\nCorreo: ${email}\nContraseña: 12345`);
}

function deleteJob(id) {
    if (confirm('¿Eliminar esta vacante?')) {
        jobsData = jobsData.filter(j => j.id !== id);
        refreshAllViews();
    }
}

function postularse(jobTitle, companyName) {
    alert(`¡Postulación enviada a "${jobTitle}" en ${companyName}!`);
    const statPostulaciones = document.getElementById('stat-postulaciones');
    if (statPostulaciones) statPostulaciones.textContent = parseInt(statPostulaciones.textContent) + 1;
}

// Exportar Vacantes a CSV
function exportVacantesCSV() {
    if (jobsData.length === 0) {
        alert('No hay vacantes para exportar.');
        return;
    }
    let csvContent = "\uFEFFID,Titulo Puesto,Empresa,Categoria,Modalidad,Ubicacion,Salario\n";
    jobsData.forEach(job => {
        csvContent += `${job.id},"${job.title}","${job.company}","${job.category}","${job.modality}","${job.location}","${job.salary}"\n`;
    });
    downloadCSV(csvContent, "reporte_vacantes.csv");
}

// Exportar Egresados a CSV
function exportEgresadosCSV() {
    if (graduatesData.length === 0) {
        alert('No hay egresados para exportar.');
        return;
    }
    let csvContent = "\uFEFFMatricula,Nombre Completo,Correo Electronico,Carrera,Anio Graduacion,Promedio,Estatus\n";
    graduatesData.forEach(grad => {
        csvContent += `"${grad.matricula}","${grad.nombre}","${grad.email}","${grad.carrera}",${grad.anio},${grad.promedio},"${grad.estatus}"\n`;
    });
    downloadCSV(csvContent, "base_datos_egresados.csv");
}

function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Modo Oscuro / Claro
const themeToggleBtn = document.getElementById('themeToggleBtn');
if(themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });
}