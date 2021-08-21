let controller;
let slideScene;

function animiateSlide() {
  //Init controller
  controller = new ScrollMagic.Controller();

  //select something
  const sliders = document.querySelectorAll('.slide');
  const nav = document.querySelector('.nav-header');

  //loop over each slide
  sliders.forEach(slide => {
    const revealImg = slide.querySelector('.reveal-image');
    const img = slide.querySelector('.hero-img img');
    const revealText = slide.querySelector('.reveal-text');
    //GSAP
    gsap.to(revealImg, 1, { x: 100 });
  });
}

animiateSlide();