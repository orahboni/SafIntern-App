// Global variables for pagination
let currentPage = 1;
const rowsPerPage = 10;
let currentData = [];
let currentFilter = 'all';

// DOM elements
const table = document.querySelector('.internManagement table');
const darkMode = document.querySelector('.darkMode');
const lightMode = document.querySelector('.lightMode');
const placementList = 'placement-list.json';
const filterFrontendBtn = document.getElementById('filterFrontendBtn');
const filterBackendBtn = document.getElementById('filterBackendBtn');
const filterGenerativeAiBtn = document.getElementById('filterGenerativeAiBtn');
const displayAllInternBtn = document.getElementById('displayAllBtn');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const contactAdminBtn = document.getElementById('contactAdminBtn');
const internManagement = document.querySelector('.internManagement');
const contactForm = document.querySelector('.contactForm');
const viewPlacementListBtn = document.querySelector('#viewPlacementListBtn');

// Initialize pagination controls
const paginationContainer = document.createElement('div');
paginationContainer.className = 'pagination';
document.querySelector('.internManagement').appendChild(paginationContainer);

// Add CSS for pagination
const paginationText = document.createElement('style');
paginationText.textContent = `
  .pagination {
    display: flex;
    justify-content: center;
    gap: 10px;
    color: white;
    margin: 20px 0;
  }
  .pagination button {
    padding: 5px 10px;
    border: 1.5px solid rgb(26,137,180);
    border-radius: 10px;
    background: #f0f0f0;
    cursor: pointer;
  }
  .pagination button.active {
    background: #4285f4;
    color: white;
  }
  .pagination button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
document.head.appendChild(paginationText);

// DARK Mode Switch Functions
darkMode.addEventListener('click', switchToLightMode);
lightMode.addEventListener('click', switchToDarkMode);

function switchToLightMode() {
    darkMode.style.display = 'none';
    lightMode.style.display = 'block';
    document.body.style.backgroundColor = 'rgb(216,219,222)';
    document.querySelector('.internManagement h1').style.color = '#1f1f1f';
    table.style.color = '#1f1f1f';
    document.querySelector('.pagination').style.color = '#1f1f1f';
}

function switchToDarkMode() {
    lightMode.style.display = 'none';
    darkMode.style.display = 'block';
    document.body.style.backgroundColor = '#1f1f1f';
    document.querySelector('.internManagement h1').style.color = 'rgb(216,219,222)';
    table.style.color = 'rgb(216,219,222)';
     document.querySelector('.pagination').style.color = 'rgb(216,219,222)';
}

// Common function to render table with pagination
function renderTable(data, page = 1) {
    currentPage = page;
    currentData = data;
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, data.length);
    const pageData = data.slice(startIndex, endIndex);

    table.innerHTML = `
        <thead>
            <tr>
                <th>S/N</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Learning Stage</th>
                <th>Learning Path</th>
            </tr>
        </thead>
        <tbody>
            ${pageData.map((item, index) => `
                <tr>
                    <td>${startIndex + index + 1}</td>
                    <td>${item.FirstName}</td>
                    <td>${item.LastName}</td>
                    <td class="alignCenter"><button class="stage">${item.LearningStage}</button></td>
                    <td class="alignCenter"><button class="path">${item.LearningPath}</button></td>
                </tr>
            `).join('')}
        </tbody>
    `;

    table.style.display = 'block';
    renderPagination(data.length);
    
}

// Render pagination controls
function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / rowsPerPage);
    paginationContainer.innerHTML = '';

    if (totalPages <= 1) return;

    // Previous button
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            renderTable(currentData, currentPage - 1);
        }
    });

    // Page numbers
    const pageInfo = document.createElement('span');
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

    // Next button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        
        if (currentPage < totalPages) {
            renderTable(currentData, currentPage + 1);
        }
    });

    paginationContainer.appendChild(prevButton);
    paginationContainer.appendChild(pageInfo);
    paginationContainer.appendChild(nextButton);
}

// Update button styles
function updateButtonStyles(activeButton) {
    const buttons = [filterFrontendBtn, filterBackendBtn, filterGenerativeAiBtn, displayAllInternBtn];
    buttons.forEach(button => {
        button.style.backgroundColor = '#c4c4c4';
        button.style.color = '#1f1f1f';
    });
    
    if (activeButton) {
        activeButton.style.backgroundColor = 'green';
        activeButton.style.color = 'white';
        table.classList.add('fade-in');
    }
}

// Get all placement list
async function getPlacementList() {
    try {
        const response = await fetch(placementList);
        const data = await response.json();
        const listArray = Object.values(data);
        
        if (table.style.display === 'block' && currentFilter === 'all') {
            table.style.display = 'none';
            paginationContainer.innerHTML = '';
            return;
        }
        
        currentFilter = 'all';
        updateButtonStyles(displayAllInternBtn);
        renderTable(listArray);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Get search results
async function getSearchResult() {
    try {
        const response = await fetch(placementList);
        const data = await response.json();
        const listArray = Object.values(data);
        const searchValue = searchInput.value.trim().toLowerCase();

        if (table.style.display === 'block' && searchValue === '') {
            table.style.display = 'none';
            paginationContainer.innerHTML = '';
            return;
        }

        const filteredData = searchValue === '' ? [] : listArray.filter(item => 
            Object.values(item).some(val => 
                String(val).toLowerCase().includes(searchValue)
            )
        );


        if (filteredData.length === 0 && searchValue !== '') {
            alert('No matching records found');
            return;
        }

        currentFilter = 'search';
        updateButtonStyles();
        renderTable(filteredData);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Get frontend interns
async function getFrontend() {
    try {
        const response = await fetch(placementList);
        const data = await response.json();
        const listArray = Object.values(data);
        const filteredData = listArray.filter(item => item.LearningPath === 'Frontend');
        
        if (table.style.display === 'block' && currentFilter === 'frontend') {
            table.style.display = 'none';
            paginationContainer.innerHTML = '';
            return;
        }
        
        currentFilter = 'frontend';
        updateButtonStyles(filterFrontendBtn);
        renderTable(filteredData);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Get backend interns
async function getBackend() {
    try {
        const response = await fetch(placementList);
        const data = await response.json();
        const listArray = Object.values(data);
        const filteredData = listArray.filter(item => item.LearningPath === 'Backend');
        
        if (table.style.display === 'block' && currentFilter === 'backend') {
            table.style.display = 'none';
            paginationContainer.innerHTML = '';
            return;
        }
        
        currentFilter = 'backend';
        updateButtonStyles(filterBackendBtn);
        renderTable(filteredData);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Get generative AI interns
async function getGenerativeAi() {
    try {
        const response = await fetch(placementList);
        const data = await response.json();
        const listArray = Object.values(data);
        const filteredData = listArray.filter(item => item.LearningPath === 'Generative Ai');
        
        if (table.style.display === 'block' && currentFilter === 'generativeAi') {
            table.style.display = 'none';
            paginationContainer.innerHTML = '';
            return;
        }
        
        currentFilter = 'generativeAi';
        updateButtonStyles(filterGenerativeAiBtn);
        renderTable(filteredData);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Event listeners
searchBtn.addEventListener('click', getSearchResult);

filterFrontendBtn.addEventListener('click', () => {
    searchInput.value = '';
    getFrontend();
});

filterBackendBtn.addEventListener('click', () => {
    searchInput.value = '';
    getBackend();
});

filterGenerativeAiBtn.addEventListener('click', () => {
    searchInput.value = '';
    getGenerativeAi();
});

displayAllInternBtn.addEventListener('click', () => {
    searchInput.value = '';
    getPlacementList();
});



document.querySelector('.submit-btn').addEventListener('click', (e) => {
    e.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const subjectInput = document.getElementById('subject').value;
    const learningPath = document.querySelector('input[name="learningPath"]:checked').value;
    const learningStage = document.querySelector('input[name="learningStage"]:checked').value;
    const admin = document.querySelector('input[name="admin"]:checked').value;
    const userText = document.getElementById('message').value;

    const internFullName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase() + ' ' + lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();
    function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     return emailRegex.test(email);
    }

    const isFormValid = (
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    email.trim() !== "" &&
    isValidEmail(email.trim()) &&
    subjectInput.trim() !== "" &&
    userText.trim() !== ""
    );
      

    const message = `Good Day ${admin},` + '%0D%0A%0D%0A' + `${userText}` + '%0D%0A%0D%0A' + 'Kind Regards,' + '%0D%0A%0D%0A' + `${internFullName}` + '%0D%0A' + `${learningPath} Intern (${learningStage})`;
    const subject = subjectInput.charAt(0).toUpperCase() + subjectInput.slice(1).toLowerCase();
    const body = message;

    if (isFormValid) {
        let recipientEmail;

        if (admin === 'Ms. Mariam') {
            recipientEmail = 'mariam.ameh@flexisaf.com';
        } else if (admin === 'Mr Michael') {
            recipientEmail = 'michael.okoronu@flexisaf.com';
        } else {
            console.error("Invalid admin value:", admin);
             return;
        }


        const isMobile = () => {
            const isSmallScreen = window.innerWidth <= 768;
            const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            return isSmallScreen && hasTouchScreen;
        };

        if (isMobile()) {
            window.open(
        `mailto:${recipientEmail}?subject=Form%20Submission%20on%20SafIntern%20App%20-%20${subject}&cc=${email}&body=${body}`,
        '_blank'
        );
        } else {
            window.open(
        `https://mail.google.com/mail/?view=cm&fs=1&to=${recipientEmail}&cc=${email}&su=Form%20Submission%20on%20SafIntern%20App%20-%20${subject}&body=${body}`,
        '_blank'
       );
        };

        document.querySelector('.confirmationNotification').style.display = 'block';
        document.querySelector('.submit-btn').style.display = 'none';
    } else {
        if (email.trim() !== "" && !isValidEmail(email.trim())) {
        alert("Please enter a valid email address!");
        }

        document.querySelector('.confirmationNotification').style.display = 'none';
        document.querySelector('.submit-btn').style.display = 'block';
    }
  
});

  

// Display Contact Form
contactAdminBtn.onclick = () => {
    contactForm.style.display = 'block';
    internManagement.style.display = 'none';
    viewPlacementListBtn.style.display = 'block';
    contactAdminBtn.style.display = 'none';
}

viewPlacementListBtn.onclick = () => {
    contactForm.style.display = 'none';
    internManagement.style.display = 'block';
    contactAdminBtn.style.display = 'block';
    viewPlacementListBtn.style.display = 'none';
}


// Switch to Light Mode by Default
switchToLightMode();