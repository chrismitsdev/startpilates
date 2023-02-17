"use strict"

const categoryButtons = Array.from(document.querySelector('.btn-group').children)
const productCards = Array.from(document.querySelectorAll('.product'))
const productSlides = document.querySelectorAll('.product-slides')
const productThumbs = document.querySelectorAll('.product-thumbs')
const yearPlaceholder = document.getElementById('year')
const currYear = new Date().getFullYear()
const productModals = document.querySelectorAll('.product-info-modal')
let visibleProducts = productCards
let modalsArray = []

// Make all products visible by default
visibleProducts.forEach(product => product.classList.add('show'))
yearPlaceholder.textContent = currYear

// Simple function the sets the active category button
const setActiveCategoryButton = (array, clickedElement) => {
	array.forEach(arrayElement => arrayElement.classList.remove('active'))
	clickedElement.classList.add('active')
}

for(const categoryButton of categoryButtons) {
	categoryButton.addEventListener('click', e => {
		// (On button click) empty the visibleProducts array
		// We want only the clicked category products inside.
		visibleProducts = []
		const {category} = e.target.dataset
		const clickedBtn = e.target
		setActiveCategoryButton(categoryButtons, clickedBtn)

		if (category === '*') {
			visibleProducts = [...productCards]
		} else {
			visibleProducts = productCards.filter(product => product.classList.contains(category))
		}
		
		// Step 1: Remove the show class from all productCards array elements
		productCards.forEach(product => product.classList.remove('show'))
		// Step 2: Add the show class in all visibleProducts array elements
		visibleProducts.forEach(product => product.classList.add('show'))
	})
}

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
})

for(let i = 0; i < productSlides.length; i++) {
	
	productThumbs[i].classList.add(`thumbs-${i}`)
	productSlides[i].classList.add(`slides-${i}`)
	
	const thumbsSwiper = new Swiper(`.thumbs-${i}`, {
		allowTouchMove: false,
		loop: false,
		freeMode: false,
		spaceBetween: 0,
		slidesPerView: 'auto',
		watchSlidesProgress: true,
		preloadImages: false,
		lazy: true,
	})

	new Swiper(`.slides-${i}`, {
		preloadImages: false,
		lazy: true,
		navigation: {
			nextEl: ".swiper-button-next",
			prevEl: ".swiper-button-prev",
		},
		thumbs: {
			swiper: thumbsSwiper
		}
	})
}

// Push all the product modals into modalsArray
productModals.forEach(productModal => modalsArray.push(new bootstrap.Modal(productModal)))

// EVENT LISTENERS
// Creator pop-up
document.addEventListener('click', e => {
	const promoBtn = document.querySelector('.promo-btn')

	if (e.target === promoBtn) {
		promoBtn.parentElement.classList.toggle('show')
	} else {
		promoBtn.parentElement.classList.remove('show')
	}
})

// Add the modal hash to the URL if modal is opened
productCards.forEach(productCard => {
	productCard.addEventListener('click', e => {
		const currentModalHash = e.target.offsetParent.parentElement.getAttribute('data-bs-target')
		window.location.hash = '#products/' + currentModalHash
	})
})

// Remove the modal hash from the URL if modal close button is clicked
modalsArray.forEach(productModal => {
	productModal._element.addEventListener('click', e => {
		if (e.target.classList.contains('btn-close')) {
			window.location.hash = '#products/'
		}
	})

	productModal._element.addEventListener('keydown', e => {
		if (e.key === 'Escape') {
			window.location.hash = '#products/'
		}
	})
})

// Simple way to handle external linked visitors
document.addEventListener('DOMContentLoaded', () => {
	const urlHref = window.location.href;
	const searchTerm = urlHref.split("#products/#")[1] || urlHref.split("#products/%23")[1];

	if (searchTerm) {
		const modalToShow = modalsArray.find(modal => modal._element.id === searchTerm);
		modalToShow.show();
	} else {
		return
	}
});