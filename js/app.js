// Variables

const courses = document.querySelector('#courses-list'),
    shoppingCartContent = document.querySelector('#cart-content tbody'),
    clearCartBtn = document.querySelector('#clear-cart');

// Listeners

loadEventListeners();

function loadEventListeners() {
    // When a new course is added
    courses.addEventListener('click', buyCourse);

    // When the remove button is clicked
    shoppingCartContent.addEventListener('click', removeCourse)

    // Clear Cart Btn
    clearCartBtn.addEventListener('click', clearCart);

    // Document Ready
    document.addEventListener('DOMContentLoaded', getFromLocalStorage);
}

// Functions

function buyCourse(e) {
    e.preventDefault();
    // Use delegation to find the course that was added
    if(e.target.classList.contains('add-to-cart')) {
        
        // Read the course values
        const course = e.target.parentElement.parentElement;

        // Read the values
        getCourseInfo(course);
    }
}

// Reads the HTML info of the selected course
function getCourseInfo(course) {

    // Create an Object with Course Data
    const courseInfo = {
        image: course.querySelector('img').src,
        title: course.querySelector('h4').innerText,
        price: course.querySelector('.price span').innerText,
        id: course.querySelector('a').getAttribute('data-id')
    }

    // Insert into the shopping cart
    addIntoCart(courseInfo);
}

// Display the selected course into the shopping cart
function addIntoCart(course) {
    // create a <tr>
    const row = document.createElement('tr');

    // Build the template
    row.innerHTML = `
        <tr>
            <td>
                <img src="${course.image}" width=100px>
            </td>
            <td>${course.title}</td>
            <td>${course.price}</td>
            <td>
                <a href="#" class="remove" data-id="${course.id}">X</a>
            </td>
        </tr>
    `;

    // Add into the shopping cart
    shoppingCartContent.appendChild(row);

    // Add course into local storage
    saveIntoStorage(course);
}

// Add the courses into the local storage
function saveIntoStorage(course) {

    let courses = getCourseFromStorage();

    // add the course into the array
    courses.push(course);

    // since storage only saves strings, we need to convert JSON into string here
    localStorage.setItem('courses', JSON.stringify(courses))
}

// Get the contents from storage
function getCourseFromStorage() {

    let courses;

    // if something exist on storage then get the value, otherwise create an empty array
    if(localStorage.getItem('courses') === null) {
        courses = [];
    } else {
        courses = JSON.parse(localStorage.getItem('courses'));
    }

    return courses;
}

// Remove course from the dom
function removeCourse(e) {

    let course, courseId;

    if (e.target.classList.contains('remove')) {
        e.target.parentElement.parentElement.remove();
        course = e.target.parentElement.parentElement;
        courseId = course.querySelector('a').getAttribute('data-id');
    }

    // remove from the local storage
    removeCourseLocalStorage(courseId);

}

function removeCourseLocalStorage(courseId) {
    // get data from local storage
    let coursesLS = getCourseFromStorage();

    // loop through list and find index index to remove
    coursesLS.forEach(function(courseLS, index){
        if (courseLS.id === courseId) {
            coursesLS.splice(index,1);
        }
    });

    // Add the rest of the array
    localStorage.setItem('courses', JSON.stringify(coursesLS));

}

// Clears the shopping cart
function clearCart() {

    while(shoppingCartContent.firstChild) {
        shoppingCartContent.removeChild(shoppingCartContent.firstChild);
    }

    // Clear from local storage
    clearLocalStorage();
}

// Clears the whole local storage
function clearLocalStorage() {
    localStorage.clear();
}

// Loads when doc is ready and prints courses into shopping cart
function getFromLocalStorage() {
    let coursesLS = getCourseFromStorage();

    // LOOP through coursesLS and print into cart
    coursesLS.forEach(function(course){
        // Create <tr>
        const row = document.createElement('tr');

        // print the content
        row.innerHTML = `
            <tr>
                <td>
                    <img src="${course.image}" width=100px>
                </td>
                <td>${course.title}</td>
                <td>${course.price}</td>
                <td>
                    <a href="#" class="remove" data-id="${course.id}">X</a>
                </td>
            </tr>
        `;
        shoppingCartContent.appendChild(row);
    });
}