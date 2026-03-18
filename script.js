let addBtn = document.getElementById("addBtn");
let form = document.getElementById("form");
let btnAnnul = document.getElementById("btnAnnul");
let searchInput = document.getElementById("searchInput");
let totalStudent = document.getElementById("totalStudent");

addBtn.addEventListener("click", function(){
   form.classList.remove("hidden");
});

let btn = document.getElementById("btn");
let name = document.getElementById("name");
let surname = document.getElementById("surname");
let age = document.getElementById("age");
let field = document.getElementById("field");
let tbody = document.getElementById("studentTable");
let formError = document.getElementById("formError");


 // le localstorage.getItem : recupere les donnees, JSON.parse(): transforme le tableau en js, || []: cree un tableau vide.
let students = JSON.parse(localStorage.getItem("students")) || [];
let idCount = JSON.parse(localStorage.getItem("idCount")) || 1;

// Bouton Modal
const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");

// Ouvrir modal
addBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
});

// Fermer modal avec X
closeModal.addEventListener("click", () => {
    modal.classList.add("hidden");
});


// Fermer modal si clic en dehors du contenu
window.addEventListener("click", (e) => {
    if(e.target === modal){
        modal.classList.add("hidden");
        form.reset();
    }
});

// fermer le modal avec le bouton annuler 
btnAnnul.addEventListener("click", function(){
    form.reset();
    modal.classList.add("hidden");
});




// le bouton submit (envoyer)
form.addEventListener("submit", function(e){

    e.preventDefault(); // empeche le rechargement de la page

    if(editId){ // si on est en mode édition pour modifier les infos d`un etudiant
        let index = students.findIndex(student => student.id === editId);
        if(index !== -1){
            students[index].name = name.value;
            students[index].surname = surname.value;
            students[index].age = age.value;
            students[index].field = field.value;

            localStorage.setItem("students", JSON.stringify(students));
            displayStudents();
            form.reset();
            modal.classList.add("hidden");

            editId = null; // reset le mode édition
            return;
        }
    }

    // verifie si les champs sont vides

    if(name.value === "" || surname.value === "" || age.value === "" || field.value === ""){
        alert("Veuillez remplir tous les champs.");
        return;
    }

    // verifie si l`age est un entier
    if(!Number.isInteger(Number(age.value)) || Number(age.value) < 0){
        alert("Veuillez entrer un âge valide.");
        return;
    }

    // some(): permet de verifier dans le tableau si l`etudiant existe deja
    let exist = students.some(function(student){

        return student.name.toLowerCase().trim() === name.value.toLowerCase().trim() && 
               student.surname.toLowerCase().trim() === surname.value.toLowerCase().trim() &&
               student.age == age.value &&
               student.field.toLowerCase().trim() === field.value.toLowerCase().trim();
    });

    if(exist){
        alert("Cet étudiant existe déjà.");
        return;
    }

    // creer les donnees de l`etudiant
    let student = {
        id: students.length + 1,
        name: name.value,
        surname: surname.value,
        age: age.value,
        field: field.value
    }

    students.push(student); // l`ajoute dans le tableau

    localStorage.setItem("students", JSON.stringify(students));

    displayStudents();
    form.reset();
    modal.classList.add("hidden");
});

displayStudents();



// afficher les etudiants dans le tableau
function displayStudents(filteredStudents = students){

     if(filteredStudents.length === 0){
        tbody.innerHTML = `<tr><td colspan="6">Aucun étudiant trouvé</td></tr>`;
    }else{
        tbody.innerHTML = "";
        filteredStudents.forEach(function(student, index){

            let tr = document.createElement("tr");


            tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${student.name}</td>
            <td>${student.surname}</td>
            <td>${student.age}</td>
            <td>${student.field}</td>
            
            <td>
            <button class = "action-btn edit-btn" onclick="editStudentById(${student.id})">Edit</button>
            <button class = "action-btn delete-btn" onclick="deleteStudentById(${student.id})">Delete</button>
            </td>
            `
            tbody.appendChild(tr);
        });
        updateTotal();
    }
}




// fonction du bouton modifier
let editId = null;

function editStudentById(id){

    let index = students.findIndex(student => student.id === id);
    if(index === -1) return; // sécurité

    let student = students[index];

    name.value = student.name;
    surname.value = student.surname;
    age.value = student.age;
    field.value = student.field;

    modal.classList.remove("hidden");

    editId = id;
}




// supprimer un etudiant deja enregistrer
function deleteStudentById(id){

    let index = students.findIndex(student => student.id === id);
    if(index === -1) return;

    students.splice(index, 1);

    // renumeroter les id apres suppression
    students.forEach((student, i) => {
       student.id = i + 1;
    });

    localStorage.setItem("students", JSON.stringify(students));

    displayStudents();
}



// evenement de recherche
searchInput.addEventListener("input", function(){
   
    let searchValue = searchInput.value.toLowerCase().trim();

    let filteredStudents = students.filter(function(student){

        return student.name.toLowerCase().includes(searchValue) ||
               student.surname.toLowerCase().includes(searchValue) ||
               student.field.toLowerCase().includes(searchValue);
    });     
    
   
    displayStudents(filteredStudents);

});


// compteur d`etudiants au total
function updateTotal(){
    totalStudent.textContent = students.length + " Etudiants";
}

