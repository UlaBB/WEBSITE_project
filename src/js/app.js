/* global gsap */
/* global ScrollMagic */



let controller;
let slideScene;
let pageScene;

function animiateSlide() {

  //Init controller
  controller = new ScrollMagic.Controller();

  //select something
  const sliders = document.querySelectorAll('.slide');
  const nav = document.querySelector('.nav-header');

  //loop over each slide
  sliders.forEach((slide, index, slides) => {
    const revealImg = slide.querySelector('.reveal-image');
    const img = slide.querySelector('.hero-img img');
    const revealText = slide.querySelector('.reveal-text');
    //GSAP
    const slideTl = gsap.timeline({
      defaults: { duration: 1, ease: 'power2.inOut' }
    });
    slideTl.fromTo(revealImg, { x: '0%' }, { x: '100%' });
    slideTl.fromTo(img, { scale: 2 }, { scale: 1 }, '-=1');
    slideTl.fromTo(revealText, { x: '0%' }, { x: '100%' }, '-=0.75');
    slideTl.fromTo(nav, { y: '-100%' }, { y: '0%' }, '-=0.25');
    //Create Scene

    slideScene = new ScrollMagic.Scene({
      triggerElement: slide,
      triggerHook: 0.15,
      reverse: false,
    })
      .setTween(slideTl)
      .addIndicators({ colorStart: 'white', colorTrigger: 'white', name: 'slide' })
      .addTo(controller);

    //console.log(slideScene);
    const pageTl = gsap.timeline();
    let nextSlide = slides.length - 1 === index ? 'end' : slides[index + 1];
    pageTl.fromTo(nextSlide, { y: '0' }, { y: '50%' });
    pageTl.fromTo(slide, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.5 });
    pageTl.fromTo(nextSlide, { y: '50' }, { y: '0%' }, '-=0.5');
    //Create new scene
    pageScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: '100%',
      triggerHook: 0,
    })
      .setPin(slide, { pushFollowers: false })
      .setTween(pageTl)
      .addIndicators({ colorStart: 'red', colorTrigger: 'red', name: 'page', indent: 200 })
      .addTo(controller);
  });
  //console.log(pageScene);
}

window.addEventListener('mousemove', cursor);
window.addEventListener('mouseover', activeCursor);

let mouse = document.querySelector('.cursor');
let mouseTxt = mouse.querySelector('span');

function cursor(e) {

  mouse.style.top = e.pageY + 'px';
  mouse.style.left = e.pageX + 'px';
}

function activeCursor(e) {
  const item = e.target;
  // console.log(item);
  if (item.id === 'logo' || item.classList.contains('burger')) {
    mouse.classList.add('nav-active');
  } else {
    mouse.classList.remove('nav-active');
  }
  if (item.classList.contains('explore')) {
    mouse.classList.add('active-explore');
    gsap.to('.title-swipe', 1, { y: '0%' });
    mouseTxt.innerText = 'Tap';
  } else {
    mouse.classList.remove('active-explore');
    mouseTxt.innerText = '';
    gsap.to('.title-swipe', 1, { y: '100%' });
  }
}

animiateSlide();