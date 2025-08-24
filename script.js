const favoriteIcon = '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 1.01 4.5 2.09C13.09 4.01 14.76 3 16.5 3c3.08 0 5.5 2.42 5.5 5.5 0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';

let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

function initEmailJS() {
  console.log('Initializing EmailJS');
  if (!window.emailjs) {
    console.log('EmailJS not available');
    showToast('Email service not available. Please try again later.', 'error');
    return false;
  }
  try {
    emailjs.init("1-M8YnixK6q8bpVGw"); // Your Public Key
    console.log('EmailJS initialized successfully');
    return true;
  } catch (error) {
    console.log('EmailJS initialization failed:', error);
    showToast(`Email service initialization failed: ${error.message}. Please try again.`, 'error');
    return false;
  }
}

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  toastMessage.textContent = message;
  toast.classList.remove('hidden', 'toast-success', 'toast-error');
  toast.classList.add('show', `toast-${type}`);
  setTimeout(hideToast, 6000);
}

function hideToast() {
  const toast = document.getElementById('toast');
  toast.classList.remove('show');
  setTimeout(() => toast.classList.add('hidden'), 300);
}

function showBookingMessage(message, type = 'success') {
  const bookingMessage = document.getElementById('bookingMessage');
  bookingMessage.textContent = message;
  bookingMessage.classList.remove('hidden', 'booking-message-success', 'booking-message-error');
  bookingMessage.classList.add(`booking-message-${type}`);
  setTimeout(() => {
    bookingMessage.classList.add('hidden');
    bookingMessage.textContent = '';
  }, 6000);
}

function showBookingModal() {
  const modal = document.getElementById('bookingSuccessModal');
  modal.classList.remove('hidden');
  setTimeout(() => closeModal('bookingSuccessModal'), 6000);
}

function bookCar(car) {
  document.getElementById('carType').value = car;
  document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
}

function validateBookingForm(event) {
  event.preventDefault();
  let isValid = true;

  const name = document.getElementById('fullName').value.trim();
  const carType = document.getElementById('carType').value;
  const rentalDate = document.getElementById('rentalDate').value;
  const destination = document.getElementById('destination').value.trim();
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset to start of day (4:08 PM IST, Aug 24, 2025)

  document.getElementById('fullNameError').classList.toggle('hidden', name !== '');
  document.getElementById('carTypeError').classList.toggle('hidden', carType !== '');
  document.getElementById('destinationError').classList.toggle('hidden', destination !== '');

  if (rentalDate) {
    const selectedDate = new Date(rentalDate);
    const isFutureOrToday = selectedDate >= today;
    document.getElementById('rentalDateError').classList.toggle('hidden', isFutureOrToday);
    if (!isFutureOrToday) isValid = false;
  } else {
    document.getElementById('rentalDateError').classList.remove('hidden');
    isValid = false;
  }

  if (isValid) {
    submitBooking({ fullName: name, carType, rentalDate, destination });
  } else {
    showToast('Please correct the errors in the form.', 'error');
    showBookingMessage('Please correct the errors in the form.', 'error');
  }
  return false;
}

function submitBooking(formData) {
  const hasEmailJS = initEmailJS();
  if (!hasEmailJS) {
    showToast('Successfully booked! (Simulation)', 'success');
    showBookingMessage('Successfully booked! (Simulation)', 'success');
    showBookingModal();
    document.getElementById('bookingForm').reset();
    return;
  }
  emailjs.send('service_vgm7a92', 'template_sb0q5ts', formData) // Replace with your Service ID and Template ID
    .then((response) => {
      console.log('Email sent successfully, response:', response);
      showToast('Successfully booked!', 'success');
      showBookingMessage('Successfully booked!', 'success');
      showBookingModal();
      document.getElementById('bookingForm').reset();
    }, (error) => {
      console.log('EmailJS error:', error);
      const errorMsg = error.text || (error.message || 'Unknown error. Please try again.');
      showToast(`Booking failed: ${errorMsg}`, 'error');
      showBookingMessage(`Booking failed: ${errorMsg}`, 'error');
    });
}

function openModal(modalId) {
  document.getElementById(modalId).classList.remove('hidden');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.add('hidden');
}

function submitLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  document.getElementById('loginEmailError').classList.toggle('hidden', emailValid);
  document.getElementById('loginPasswordError').classList.toggle('hidden', password !== '');
  if (emailValid && password) {
    showToast('Login successful! Welcome to Su Sarige.', 'success');
    closeModal('loginModal');
  }
}

function submitRegister() {
  const name = document.getElementById('registerFullName').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const password = document.getElementById('registerPassword').value;
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordValid = password.length >= 6;
  document.getElementById('registerFullNameError').classList.toggle('hidden', name !== '');
  document.getElementById('registerEmailError').classList.toggle('hidden', emailValid);
  document.getElementById('registerPasswordError').classList.toggle('hidden', passwordValid);
  if (name && emailValid && passwordValid) {
    showToast('Registration successful! Please log in.', 'success');
    closeModal('registerModal');
    openModal('loginModal');
  }
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const hamburger = document.querySelector('.hamburger');
  menu.classList.toggle('hidden');
  hamburger.classList.toggle('open');
}

function toggleDarkMode() {
  document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
}

if (localStorage.getItem('theme') === 'dark') {
  document.documentElement.classList.add('dark');
}

window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  header.classList.toggle('header-shrink', window.scrollY > 70);
});

function insertCars() {
  const carContainer = document.getElementById('carContainer');
  const cars = [
    { type: 'Sedan', image: 'https://www.hdwallpapers.in/download/2018_audi_rs3_sedan_4k-3840x2160.jpg', price: '₹30/day', specs: '4 Seats, Automatic, 25 MPG', id: 'sedan' },
    { type: 'SUV', image: 'https://wallpapercave.com/wp/wc1733871.jpg', price: '₹50/day', specs: '6 Seats, Automatic, 20 MPG', id: 'suv' },
    { type: 'Luxury Car', image: 'https://wallpapercave.com/wp/wp9015836.jpg', price: '₹100/day', specs: '4 Seats, Premium, 18 MPG', id: 'luxury' }
  ];
  cars.forEach((car, index) => {
    setTimeout(() => insertCarCard(car, carContainer), index * 1000);
  });
}

function insertCarCard(car, container) {
  const isFavorite = favorites.includes(car.id);
  const carCard = document.createElement('div');
  carCard.className = `car-card bg-white rounded-lg shadow-xl p-8 border border-amber-500 transform transition-all animate-slide-in-left ${car.type.replace(' ', '-')}`;
  carCard.innerHTML = `
    <div class="relative overflow-hidden rounded-lg">
      <img src="${car.image}" alt="Su Sarige ${car.type}" class="w-full h-96 object-cover image-zoom" loading="lazy" aria-label="${car.type} image">
      <div class="absolute inset-0 bg-amber-500 opacity-0 hover:opacity-20 transition-all duration-300"></div>
      <button onclick="toggleFavorite('${car.id}')" class="absolute top-4 right-4 text-2xl" aria-label="${isFavorite ? 'Remove from' : 'Add to'} favorites">
        <span class="${isFavorite ? 'text-red-500' : 'text-gray-400'}">${favoriteIcon}</span>
      </button>
    </div>
    <h3 class="text-3xl font-playfair font-semibold mt-6 text-gray-800">${car.type}</h3>
    <p class="text-xl font-medium text-gray-600 mt-2">${car.price}</p>
    <p class="text-lg text-gray-600 mt-1">${car.specs}</p>
    <button onclick="bookCar('${car.type}')" class="mt-4 w-full bg-amber-500 text-gray-800 font-semibold px-6 py-3 rounded-lg hover:bg-amber-600 hover:animate-pulse transition-all" aria-label="Book ${car.type}">Book Now</button>
  `;
  container.appendChild(carCard);
}

function toggleFavorite(carId) {
  if (favorites.includes(carId)) {
    favorites = favorites.filter(c => c !== carId);
  } else {
    favorites.push(carId);
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
  const container = document.getElementById('carContainer');
  container.innerHTML = '';
  insertCars();
}

function filterCars(type) {
  const cards = document.querySelectorAll('.car-card');
  cards.forEach(card => {
    if (type === 'all' || card.classList.contains(type.replace(' ', '-'))) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

let teamIndex = 0;
const teamSlides = document.querySelectorAll('#teamCarousel .min-w-full');

function updateTeamCarousel() {
  document.getElementById('teamCarousel').style.transform = `translateX(-${teamIndex * 100}%)`;
}

function nextTeamSlide() {
  teamIndex = (teamIndex + 1) % teamSlides.length;
  updateTeamCarousel();
}

function prevTeamSlide() {
  teamIndex = (teamIndex - 1 + teamSlides.length) % teamSlides.length;
  updateTeamCarousel();
}