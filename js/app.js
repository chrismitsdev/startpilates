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

// Close the offcanvas menu after 450ms on navlink click event
navLinks.forEach(navlink => {
	navlink.addEventListener('click', () => setTimeout(() => offcanvasInstance.hide(), 450));
});

// Push all the product modals into modalsArray
productModals.forEach(productModal => modalsArray.push(new bootstrap.Modal(productModal)));

// EVENT LISTENERS

// Shrink navbar on document scroll event
document.addEventListener('scroll', navShrink);

// Logic for the promotional button about the owner
document.addEventListener('click', e => {
	const promoBtn = document.querySelector('.promo-btn');
	if(e.target === promoBtn) { promoBtn.parentElement.classList.toggle('show') }
	else { promoBtn.parentElement.classList.remove('show') }
});

// Add the modal hash to the URL if modal is opened
productCards.forEach(productCard => {
	productCard.addEventListener('click', e => {
		const currentModalHash = e.delegateTarget.getAttribute('data-bs-target');
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

// A way to handle external links on page load
document.addEventListener('DOMContentLoaded', () => {
	let modalToShow;

	if(window.location.href.includes('#woodCadillacReformerHigh')) {
		modalToShow = modalsArray.find(modal => modal._element.id === 'woodCadillacReformerHigh');
		modalToShow.show();
	} else if(window.location.href.includes('#woodCadillacReformerLow')) {
		modalToShow = modalsArray.find(modal => modal._element.id === 'woodCadillacReformerLow');
		modalToShow.show();
	} else if(window.location.href.includes('#woodCadillacTable')) {
		modalToShow = modalsArray.find(modal => modal._element.id === 'woodCadillacTable');
		modalToShow.show();
	} else if(window.location.href.includes('#woodReformerTower')) {
		modalToShow = modalsArray.find(modal => modal._element.id === 'woodReformerTower');
		modalToShow.show();
	} else if(window.location.href.includes('#woodReformer')) {
		modalToShow = modalsArray.find(modal => modal._element.id === 'woodReformer');
		modalToShow.show();
	} else if(window.location.href.includes('#woodFoldableReformer')) {
		modalToShow = modalsArray.find(modal => modal._element.id === 'woodFoldableReformer');
		modalToShow.show();
	} else if(window.location.href.includes('#woodWallTower')) {
		modalToShow = modalsArray.find(modal => modal._element.id === 'woodWallTower');
		modalToShow.show();
	} else if(window.location.href.includes('#whiteCadillacReformer')) {
		modalToShow = modalsArray.find(modal => modal._element.id === 'whiteCadillacReformer');
		modalToShow.show();
	} else if(window.location.href.includes('#whiteReformerTower')) {
		modalToShow = modalsArray.find(modal => modal._element.id === 'whiteReformerTower');
		modalToShow.show();
	} else if(window.location.href.includes('#whiteReformer')) {
		modalToShow = modalsArray.find(modal => modal._element.id === 'whiteReformer');
		modalToShow.show();
	} else if(window.location.href.includes('#accessoryOrbit')) {
		modalToShow = modalsArray.find(modal => modal._element.id === 'accessoryOrbit');
		modalToShow.show();
	} else if(window.location.href.includes('#accessoryArc')) {
		modalToShow = modalsArray.find(modal => modal._element.id === 'accessoryArc');
		modalToShow.show();
	} else if(window.location.href.includes('#accessoryBox')) {
		modalToShow = modalsArray.find(modal => modal._element.id === 'accessoryBox');
		modalToShow.show();
	} else if(window.location.href.includes('#accessorySpineCorrector')) {
		modalToShow = modalsArray.find(modal => modal._element.id === 'accessorySpineCorrector');
		modalToShow.show();
	} else if(window.location.href.includes('#accessorySpineSupporter')) {
		modalToShow = modalsArray.find(modal => modal._element.id === 'accessorySpineSupporter');
		modalToShow.show();
	} else if(window.location.href.includes('#accessoryLadderBarrel')) {
		modalToShow = modalsArray.find(modal => modal._element.id === 'accessoryLadderBarrel');
		modalToShow.show();
	} else if(window.location.href.includes('#accessoryPilatesChair')) {
		modalToShow = modalsArray.find(modal => modal._element.id === 'accessoryPilatesChair');
		modalToShow.show();
	} else if(window.location.href.includes('#accessoryPilatesPole')) {
		modalToShow = modalsArray.find(modal => modal._element.id === 'accessoryPilatesPole');
		modalToShow.show();
	}
});