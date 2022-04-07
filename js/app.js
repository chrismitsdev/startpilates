"use strict";

const navbar = document.querySelector('.navbar');
const offcanvasElement = document.querySelector('.offcanvas');
const offcanvasInstance = new bootstrap.Offcanvas(offcanvasElement);
const navLinks = navbar.querySelectorAll('.nav-link');
const navBrand = navbar.querySelector('.navbar-brand');
const navlinksOgPadding = window.getComputedStyle(navLinks[0]).getPropertyValue('padding');
const navBrandOgPadding = window.getComputedStyle(navBrand).getPropertyValue('padding');
const categoryButtons = Array.from(document.querySelector('.btn-group').children);
const productCards = document.querySelectorAll('.product');
const productSlides = document.querySelectorAll('.product-slides');
const productThumbs = document.querySelectorAll('.product-thumbs');
const yearPlaceholder = document.getElementById('year');
const currYear = new Date().getFullYear();
const productModals = document.querySelectorAll('.product-info-modal');
// Init visibleProducts with all products visible
let visibleProducts = Array.from(productCards);
let modalsArray = [];
// Make all products visible by default
visibleProducts.forEach(product => product.classList.add('show'));
yearPlaceholder.textContent = currYear;

// Simple function the sets the active category button
const setActiveCategoryButton = (array, clickedElement) => {
	array.forEach(arrayElement => arrayElement.classList.remove('active'));
	clickedElement.classList.add('active');
};

// Simple function that retrieves elements of an array that contain passed class
const setVisibleProducts = (array, classToCheck) => {
	array = Array.isArray(array) ? array : Array.from(array);
	return array.filter(arrayElement => arrayElement.classList.contains(classToCheck));
};

for(const categoryButton of categoryButtons) {
	categoryButton.addEventListener('click', e => {
		// (On button click) empty the visibleProducts array
		// We want only the clicked category products inside.
		visibleProducts = [];
		const clickedButton = e.target;
		const chosenCategory = clickedButton.getAttribute('data-category');
		setActiveCategoryButton(categoryButtons, clickedButton);
		
		switch(chosenCategory) {
			// If */all selected, then, all products of productCards array
			// should be in visibleProducts array.
			// Snatch products from productCards array that contain the
			// category class case, and add them to visibleProducts array
			case '*':
				visibleProducts = [...productCards];
				break;
			case 'wood':
				visibleProducts = setVisibleProducts(productCards, 'wood');
				break;
			case 'white':
				visibleProducts = setVisibleProducts(productCards, 'white');
				break;
			case 'accessory':
				visibleProducts = setVisibleProducts(productCards, 'accessory');
				break;
		}
		
		// Step 1: Remove the show class from all productCards array elements
		productCards.forEach(product => product.classList.remove('show'));
		// Step 2: Add the show class in all visibleProducts array elements
		visibleProducts.forEach(product => product.classList.add('show'));
	});
}

const navShrink = () => {
	if(document.documentElement.scrollTop > 130) {
		navbar.classList.remove('py-4');
		navbar.classList.add('scrolled');
		navBrand.style.padding = 0;
		navLinks.forEach(navlink => navlink.style.padding = '0 8px');
	} else {
		navbar.classList.add('py-4');
		navbar.classList.remove('scrolled');
		navBrand.style.padding = navBrandOgPadding;
		navLinks.forEach(navlink => navlink.style.padding = navlinksOgPadding);
	}
};

const swiper = new Swiper(".quality-modal-swiper", {
	preloadImages: false,
  lazy: true,
	pagination: {
		el: ".swiper-pagination",
		type: "progressbar",
	},
	navigation: {
		nextEl: ".swiper-button-next",
		prevEl: ".swiper-button-prev",
	},
});

for(let i = 0; i < productSlides.length; i++) {
	
	productThumbs[i].classList.add(`thumbs-${i}`);
	productSlides[i].classList.add(`slides-${i}`);
	
	const thumbsSwiper = new Swiper(`.thumbs-${i}`, {
		allowTouchMove: false,
		loop: false,
		freeMode: false,
		spaceBetween: 0,
		slidesPerView: 'auto',
		watchSlidesProgress: true,
		preloadImages: false,
		lazy: true,
	});
	
	const slidesSwiper = new Swiper(`.slides-${i}`, {
		preloadImages: false,
		lazy: true,
		navigation: {
			nextEl: ".swiper-button-next",
			prevEl: ".swiper-button-prev",
		},
		thumbs: {
			swiper: thumbsSwiper
		}
	});
}

// Push all the product modals into modalsArray
productModals.forEach(productModal => modalsArray.push(new bootstrap.Modal(productModal)));

// EVENT LISTENERS
// Shrink navbar on document scroll event
document.addEventListener('scroll', navShrink);

// Close the offcanvas menu after 450ms on navlink click event
navLinks.forEach(navlink => {
	navlink.addEventListener('click', () => setTimeout(() => offcanvasInstance.hide(), 450));
});

// Creator pop-up
document.addEventListener('click', e => {
	const promoBtn = document.querySelector('.promo-btn');
	if(e.target === promoBtn) { promoBtn.parentElement.classList.toggle('show') }
	else { promoBtn.parentElement.classList.remove('show') }
});

// Add the modal hash to the URL if modal is opened
productCards.forEach(productCard => {
	productCard.addEventListener('click', e => {
		const currentModalHash = e.target.offsetParent.parentElement.getAttribute('data-bs-target');
		window.location.hash = '#products/' + currentModalHash;
	});
});

// Remove the modal hash from the URL if modal closed
modalsArray.forEach(productModal => {
	productModal._element.addEventListener('click', e => {
		if(e.target.classList.contains('btn-close')) {
			window.location.hash = '#products/';
		}
	});
});

// Simple way to handle facebook/instagram visitors
document.addEventListener('DOMContentLoaded', () => {
	const urlHref = window.location.href;
	if(document.referrer.includes('instagram') || document.referrer.includes('facebook')) {
		const searchTerm = urlHref.split("#products/#")[1] || urlHref.split("#products/%23")[1];
		const modalToShow = modalsArray.find(modal => modal._element.id === searchTerm);
		modalToShow.show();
	} else {
		return;
	}
});