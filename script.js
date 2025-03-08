document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registration-form');
    const loginForm = document.getElementById('login-form');
    const studentForm = document.getElementById('student-form');
    const studentTable = document.getElementById('student-table');
    const studentManagementSection = document.querySelector('.student-management');
    const students = JSON.parse(localStorage.getItem('students')) || [];
    let isLoggedIn = false;

    // Afficher les étudiants déjà inscrits
    students.forEach(student => {
        addStudentToTable(student);
    });

    // Inscription
    registrationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const prenom = document.getElementById('prenom').value;
        const nom = document.getElementById('nom').value;
        const email = document.getElementById('email').value;
        const motdepasse = document.getElementById('motdepasse').value;

        const student = { prenom, nom, email, motdepasse };
        students.push(student);
        localStorage.setItem('students', JSON.stringify(students));
        registrationForm.reset();
        alert('Inscription réussie !');
    });

    // Connexion
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const loginEmail = document.getElementById('login-email').value;
        const loginMotdepasse = document.getElementById('login-motdepasse').value;

        const foundStudent = students.find(student => student.email === loginEmail && student.motdepasse === loginMotdepasse);

        if (foundStudent) {
            alert(`Bienvenue ${foundStudent.prenom} ${foundStudent.nom}!`);
            isLoggedIn = true;
            studentManagementSection.style.display = 'block';
            loginForm.parentElement.style.display = 'none'; // Masquer la section connexion
            loginForm.reset();
        } else {
            alert("Identifiants invalides.");
        }
    });

    // Ajouter un étudiant
    studentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!isLoggedIn) {
            alert("Vous devez être connecté pour ajouter un étudiant.");
            return;
        }
        const studentPrenom = document.getElementById('student-prenom').value;
        const studentNom = document.getElementById('student-nom').value;

        const student = { prenom: studentPrenom, nom: studentNom };
        students.push(student);
        localStorage.setItem('students', JSON.stringify(students));
        addStudentToTable(student);
        studentForm.reset();
    });

    // Ajouter un étudiant au tableau
    function addStudentToTable(student) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.prenom}</td>
            <td>${student.nom}</td>
            <td class="actions">
                <button class="edit-btn"><i class="fas fa-edit"></i></button>
                <button class="delete-btn"><i class="fas fa-trash"></i></button>
            </td>
        `;
        studentTable.querySelector('tbody').appendChild(row);

        // Modifier un étudiant
        row.querySelector('.edit-btn').addEventListener('click', () => {
            document.getElementById('student-prenom').value = student.prenom;
            document.getElementById('student-nom').value = student.nom;
            const index = students.indexOf(student);
            if (index > -1) {
                students.splice(index, 1);
                localStorage.setItem('students', JSON.stringify(students));
                row.remove();
            }
        });

        // Supprimer un étudiant
        row.querySelector('.delete-btn').addEventListener('click', () => {
            const index = students.indexOf(student);
            if (index > -1) {
                students.splice(index, 1);
                localStorage.setItem('students', JSON.stringify(students));
                row.remove();
            }
        });
    }

    // Functions to show registration and login sections
    window.showRegistration = function() {
        document.querySelector('.registration').style.display = 'block';
        document.querySelector('.login').style.display = 'none';
        document.querySelector('.student-management').style.display = 'none';
    }

    window.showLogin = function() {
        document.querySelector('.registration').style.display = 'none';
        document.querySelector('.login').style.display = 'block';
        document.querySelector('.student-management').style.display = 'none';
    }

    // Initial display
    showRegistration();
});