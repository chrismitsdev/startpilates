const primaryNav = document.querySelector('.primary-navigation')
const navToggle = document.querySelector('.mobile-nav-toggle')
const header = document.getElementById('header')
const carousel = document.getElementById('carousel')
const headerHeight = header.getBoundingClientRect().height
const carouselHeight = carousel.getBoundingClientRect().height
const navLinks = primaryNav.querySelectorAll('li')

const expanded = navToggle.addEventListener('click', function() {
  const isExpanded = this.ariaExpanded
  
  isExpanded === 'false' 
    ? this.setAttribute('aria-expanded', true)
    : this.setAttribute('aria-expanded', false)
    
  primaryNav.classList.toggle('visible')
})

const getHeaderStyles = function() {
  const root = document.documentElement
  const lightnessThreshold = 100
  const percentage = Math.floor(
    root.scrollTop / (carouselHeight - headerHeight) * lightnessThreshold
  )

  if (!(percentage <= lightnessThreshold)) {
    return
  }

  header.style.backgroundColor = `hsl(0 0% 0% / ${percentage}%)`
}

document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement
  const {type} = window.performance.getEntriesByType("navigation")[0]
  
  if (type === 'reload') {
    root.scrollTop = 0 // Scroll to top
    window.location.href = '' //  Clean the url
  } else if (type !== 'reload' && Boolean(root.scrollTop)) {
    header.style.backgroundColor = 'hsl(0 0% 0% / 100%)'
  }

  this.addEventListener('scroll', getHeaderStyles)
})


navLinks.forEach(link => link.addEventListener('mouseup', e => {
  navLinks.forEach(link => link.classList.remove('active'))
  e.currentTarget.classList.add('active')
  primaryNav.classList.remove('visible')
  navToggle.setAttribute('aria-expanded', false);
}))