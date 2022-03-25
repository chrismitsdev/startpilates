"use strict";

const navbar = document.querySelector('.navbar');
const offcanvasElement = document.querySelector('.offcanvas');
const offcanvasInstance = new bootstrap.Offcanvas(offcanvasElement);
const navLinks = navbar.querySelectorAll('.nav-link');
const navBrand = navbar.querySelector('.navbar-brand');
const navlinksOgPadding = window.getComputedStyle(navLinks[0]).getPropertyValue('padding');
const navBrandOgPadding = window.getComputedStyle(navBrand).getPropertyValue('padding');
const categoryButtons = Array.from(document.querySelector('.btn-group').children);
const productList = document.querySelectorAll('.product');
const productSlides = document.querySelectorAll('.product-slides');
const productThumbs = document.querySelectorAll('.product-thumbs');
const yearPlaceholder = document.getElementById('year');
const currYear = new Date().getFullYear();
let visibleProducts = Array.from(productList); // Init visibleProducts with all products visible
visibleProducts.forEach(product => product.classList.add('show')); // Make all products visible by default
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

// Simple function that determines the active category
const determineActiveCategory = () => {
	const activeButton = categoryButtons.find(ctgBtn => ctgBtn.classList.contains('active'));
	return activeButton.getAttribute('data-category');
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
			// If */all selected, then, all products of productList array
			// should be in visibleProducts array.
			// Snatch products from productList array that contain the
			// category class case, and add them to visibleProducts array
			case '*':
				visibleProducts = [...productList];
				break;
			case 'wood':
				visibleProducts = setVisibleProducts(productList, 'wood');
				break;
			case 'white':
				visibleProducts = setVisibleProducts(productList, 'white');
				break;
			case 'accessory':
				visibleProducts = setVisibleProducts(productList, 'accessory');
				break;
		}
		
		// Step 1: Remove the show class from all productList array elements
		productList.forEach(product => product.classList.remove('show'));
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

console.log(`Slides: ${productSlides.length}`);
console.log(`Thumbs: ${productThumbs.length}`);

// EVENT LISTENERS
// Shrink navbar on document scroll event
document.addEventListener('scroll', navShrink);

// Close the offcanvas menu after 450ms on navlink click event
navLinks.forEach(navlink => {
	navlink.addEventListener('click', () => setTimeout(() => offcanvasInstance.hide(), 450));
});