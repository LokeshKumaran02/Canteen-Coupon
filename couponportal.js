var department =  localStorage.getItem('data'); 
var adminDiv = document.querySelector('.admin');
var userDiv = document.querySelector('.user');
console.log(department);

if (department === "Canteen") {
    adminDiv.style.display = 'block';
    userDiv.style.display = 'none';
} else {
    adminDiv.style.display = 'none';
    userDiv.style.display = 'block';
}
