'use strict';
// Modal window
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const header = document.querySelector('.header');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const imgTargets = document.querySelectorAll('img[data-src]');
const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const allSections = document.querySelectorAll('.section');
const navHeight = nav.getBoundingClientRect().height;

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(modal => modal.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// const message = document.createElement('div');
// message.classList.add('c-message');
// // message.textContent = 'we use cookies to improve functionality and analytics';
// message.innerHTML =
//   'we use cookies to improve functionality and analytics <button class="btn btn--close-cookie">Got It!</button>';

// // header.prepend(message);
// // header.before(message);
// header.append(message);
// // header.append(message.cloneNode(true));
// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     message.remove();
//   });

// message.style.height =
//   Number.parseInt(getComputedStyle(message).height, 10) + 40 + 'px';

// smooth scrolling
btnScrollTo.addEventListener('click', function (e) {
  const sec1Coords = section1.getBoundingClientRect();
  // window.scrollTo({
  //   left: sec1Coords.left + window.scrollX,
  //   top: sec1Coords.top + window.screenY,
  //   behavior: 'smooth',
  // });
  section1.scrollIntoView({ behavior: 'smooth' });
});

// implementing smooth scrolling old way
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// modern way
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // matching strategy to exclude the parent and the button
  if (
    e.target.classList.length === 1 &&
    e.target.classList.contains('nav__link')
  ) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// tabbed component
tabContainer.addEventListener('click', function (e) {
  e.preventDefault();
  // closest could return the same element we picked
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return;
  // remove active classes
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  tabContent.forEach(content =>
    content.classList.remove('operations__content--active')
  );
  // activate the tab
  clicked.classList.add('operations__tab--active');
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// fade the nonelected item in nav
const handleHover = function (e) {
  // matching strategy
  // we didn't use closest() because there are not children we can click by default
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
//using the bind method to pass the handleHover as a function the event listener
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// // sticky navigation using scroll event
// // this method is bad for performance
// const initialCoords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function () {
//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });
const stickyNav = function (entires) {
  const [entry] = entires;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// reveal sections
const revealSection = function (entires, observer) {
  const [entry] = entires;
  // console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  // stop observing (we don't want the function to keep running)
  observer.unobserve(entry.target); // this will stop the observer function from running again and again
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.2,
});
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// lazy loading images

const loadImg = function (entires, observer) {
  const [entry] = entires;
  if (!entry.isIntersecting) return;
  //replace src attr with data-src
  entry.target.src = entry.target.dataset.src;
  //remove the blur filter using event listener
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  //stop observing
  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0.2,
  rootMargin: '200px', // load image before it intersect with viewport
});

imgTargets.forEach(img => imgObserver.observe(img));

// slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const sliderBtnLeft = document.querySelector('.slider__btn--left');
  const sliderBtnRight = document.querySelector('.slider__btn--right');
  const slideLength = slides.length;
  const dotContainer = document.querySelector('.dots');
  let currentSlide = 0;

  // creating dots
  const createDots = function () {
    slides.forEach((_, idx) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${idx}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    //remove the active class from all dots
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    // add active class to current dot by using the dataset selector
    document
      .querySelector(`.dots__dot[data-slide='${slide}']`)
      .classList.add('dots__dot--active');
  };
  const gotoSlide = function (currSlide) {
    slides.forEach((slide, i) => {
      slide.style.transform = `translateX(${100 * (i - currSlide)}%)`;
    });
  };

  const nextSlide = function () {
    if (currentSlide === slideLength - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    gotoSlide(currentSlide);
    activateDot(currentSlide);
  };

  const prevSlide = function () {
    if (currentSlide === 0) {
      currentSlide = slideLength - 1;
    } else {
      currentSlide--;
    }
    gotoSlide(currentSlide);
    activateDot(currentSlide);
  };

  // putting all functions in an init function
  const init = function () {
    createDots();
    // reset the slide
    gotoSlide(0);
    activateDot(0);
  };
  init();

  sliderBtnRight.addEventListener('click', nextSlide);
  sliderBtnLeft.addEventListener('click', prevSlide);

  // add right and left keys to slider
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });

  // add functionality to dots
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      gotoSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
