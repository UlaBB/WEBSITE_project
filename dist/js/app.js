/* global gsap */
/* global ScrollMagic */
/* global barba */



let controller;
let slideScene;
let pageScene;
let detailScene;

function animiateSlide() {

  //Init controller
  controller = new ScrollMagic.Controller();

  //selectors
  const sliders = document.querySelectorAll('.slide');
  //const nav = document.querySelector('.nav-header');

  //loop over each slide
  sliders.forEach((slide, index, slides) => {
    const revealImg = slide.querySelector('.reveal-image');
    const img = slide.querySelector('.hero-img img');
    const revealText = slide.querySelector('.reveal-text');
    //GSAP
    const slideTl = gsap.timeline({
      defaults: { duration: 0.5, ease: 'power2.inOut' }
    });
    slideTl.fromTo(revealImg, { x: '0%' }, { x: '100%' });
    slideTl.fromTo(img, { scale: 2 }, { scale: 1 }, '-=1');
    slideTl.fromTo(revealText, { x: '0%' }, { x: '100%' }, '-=0.75');
    
    //Create Scene

    slideScene = new ScrollMagic.Scene({
      triggerElement: slide,
      triggerHook: 0.15,
      reverse: false,
    })
      .setTween(slideTl)
      //.addIndicators({ colorStart: 'white', colorTrigger: 'white', name: 'slide' })
      .addTo(controller);

    console.log(slideScene);
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
      //.addIndicators({ colorStart: 'red', colorTrigger: 'red', name: 'page', indent: 200 })
      .addTo(controller);
  });
  console.log(pageScene);
}

function detailAnimation() {
  controller = new ScrollMagic.Controller();
  const slides = document.querySelectorAll('.detailSlide');
  slides.forEach((slide, index, slides) => {
    const slideTl = gsap.timeline({ defaults: { duration: 1 } });
    let nextSlide = slides.length - 1 === index ? 'end' : slides[index + 1];
    const nextImg = nextSlide.querySelector('img');
    slideTl.fromTo(slide, { opacity: 1 }, { opacity: 0 });
    slideTl.fromTo(nextSlide, { opacity: 0 }, { opacity: 1 }, '-=1');
    slideTl.fromTo(nextImg, { x: '50%' }, { x: '0%' });
    //Scene
    detailScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: '100%',
      triggerHook: 0
    })
      .setPin(slide, { pushFollowers: false })
      .setTween(slideTl)
      // .addIndicators({
      //   colorStart: 'white',
      //   colorTrigger: 'white',
      //   name: 'detailScene'
      // })
      .addTo(controller);
  });
}

const mouse = document.querySelector('.cursor');
const mouseTxt = mouse.querySelector('span');
const burger = document.querySelector('.burger');


window.addEventListener('mousemove', cursor);
window.addEventListener('mouseover', activeCursor);
burger.addEventListener('click', navToggle);

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

function navToggle(e) {
  if (!e.target.classList.contains('active')) {
    e.target.classList.add('active');
    gsap.to('.line1', 0.5, { rotate: '45', y: 5, background: 'black' });
    gsap.to('.line2', 0.5, { rotate: '-45', y: -5, background: 'black' });
    gsap.to('#logo', 0.5, { color: 'black' });
    gsap.to('.nav-bar', 1, { clipPath: 'circle(250rem at 100% -10%)' });
    document.body.classList.add('hiden');
  } else {
    e.target.classList.remove('active');
    gsap.to('.line1', 0.5, { rotate: '0', y: 0, background: 'white' });
    gsap.to('.line2', 0.5, { rotate: '0', y: 0, background: 'white' });
    gsap.to('#logo', 0.5, { color: 'white' });
    gsap.to('.nav-bar', 1, { clipPath: 'circle(50px at 100% -10%)' });
    document.body.classList.remove('hiden');
  }
}
const logo = document.querySelector('#logo');

barba.init({
  views: [{
    namespace: 'home',
    beforeEnter() {
      animiateSlide();
      logo.href = './index.html';
    },
    beforeLeave() {
      slideScene.destroy();
      pageScene.destroy();
      controller.destroy();
    }
  },
  {
    namespace: 'fashion',
    beforeEnter() {
      logo.href = '../index.html';
      detailAnimation();
      gsap.fromTo('.nav-header', 1, { y: '100%' }, { y: '0%', ease: 'power2.inOut' });
    },
    beforeLeave(){
      controller.destroy(),
      detailScene.destroy();
    }
  }
  ],
  transitions: [
    {
      leave({ current }) {
        let done = this.async();
        //An Animation
        const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
        tl.fromTo(current.container, 1, { opacity: 1 }, { opacity: 0 });
        tl.fromTo(
          '.swipe',
          0.75,
          { x: '-100%' },
          { x: '0%', onComplete: done },
          '-=0.5'
        );
      },
      enter({ next }) {
        let done = this.async();
        //Scroll to the top
        window.scrollTo(0, 0);
        //An Animation
        const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
        tl.fromTo(
          '.swipe',
          1,
          { x: '0%' },

          { x: '100%', stagger: 0.2, onComplete: done }
        );
        tl.fromTo(next.container, 1, { opacity: 0 }, { opacity: 1 });
        tl.fromTo(
          '.nav-header',
          1,
          { y: '-100%' },
          { y: '0%', ease: 'power2.inOut' },
          '-=1.5'
        );
      }
    }
  ]
});
