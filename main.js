(function(){
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js');

  var intro = document.querySelector('.site-intro');
  if(intro){
    if(reduceMotion){
      intro.remove();
    } else {
      var removeIntro = function(){
        if(intro.isConnected){ intro.remove(); }
      };
      requestAnimationFrame(function(){ intro.classList.add('is-visible'); });
      window.setTimeout(function(){
        intro.classList.add('is-leaving');
        intro.querySelector('.site-intro-curtain-back').addEventListener('animationend', removeIntro, { once:true });
      }, 700);
      window.setTimeout(removeIntro, 2200);
    }
  }

  var siteNav = document.querySelector('.site-nav');
  var desktopNav = document.querySelector('.nav-links');
  if(siteNav && desktopNav){
    var menuToggle = document.createElement('button');
    var mobileNav = document.createElement('nav');
    menuToggle.type = 'button';
    menuToggle.className = 'menu-toggle';
    menuToggle.setAttribute('aria-label', 'Open navigation');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-controls', 'mobile-navigation');
    menuToggle.innerHTML = '<span></span><span></span><span></span>';
    mobileNav.className = 'mobile-nav';
    mobileNav.id = 'mobile-navigation';
    mobileNav.setAttribute('aria-label', 'Mobile navigation');
    mobileNav.hidden = true;
    mobileNav.innerHTML = '<div class="mobile-nav-inner"><button type="button" class="mobile-nav-close" aria-label="Close navigation">Close</button><ul>' + desktopNav.innerHTML + '</ul></div>';
    siteNav.appendChild(menuToggle);
    document.body.appendChild(mobileNav);

    function toggleMobileNav(open){
      mobileNav.hidden = !open;
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      document.body.classList.toggle('mobile-nav-open', open);
      if(open){ mobileNav.querySelector('.mobile-nav-close').focus(); }
      else { menuToggle.focus(); }
    }
    menuToggle.addEventListener('click', function(){ toggleMobileNav(mobileNav.hidden); });
    mobileNav.querySelector('.mobile-nav-close').addEventListener('click', function(){ toggleMobileNav(false); });
    mobileNav.querySelectorAll('a').forEach(function(link){ link.addEventListener('click', function(){ toggleMobileNav(false); }); });
    document.addEventListener('keydown', function(event){ if(event.key === 'Escape' && !mobileNav.hidden){ toggleMobileNav(false); } });
  }

  // split section titles into words wrapped in spans, for the scroll-reveal animation
  document.querySelectorAll('.split-title').forEach(function(el){
    var words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(function(w){
      return '<span class="reveal-word"><span>' + w + '&nbsp;</span></span>';
    }).join('');
  });

  // reveal-on-scroll via IntersectionObserver
  var revealTargets = document.querySelectorAll('.split-title, .reveal-fade');
  if(reduceMotion){
    revealTargets.forEach(function(t){ t.classList.add('in-view'); });
  } else {
    // immediately mark anything already in the viewport (e.g. on page load or anchor navigation)
    revealTargets.forEach(function(t){
      var r = t.getBoundingClientRect();
      if(r.top < window.innerHeight){ t.classList.add('in-view'); }
    });
    // observe everything else with a generous rootMargin so it fires 100px before entering the viewport
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){ entry.target.classList.add('in-view'); }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px 100px 0px' });
    revealTargets.forEach(function(t){ if(!t.classList.contains('in-view')){ io.observe(t); } });
  }

  // nav goes solid + sticky once the page is scrolled past the hero
  var header = document.querySelector('.site-header');
  var topBtn = document.querySelector('.fab-top');
  window.addEventListener('scroll', function(){
    if(header){ header.classList.toggle('scrolled', window.scrollY > 80); }
    if(topBtn){ topBtn.classList.toggle('visible', window.scrollY > 400); }
  });

  // scroll-to-top button
  if(topBtn){
    topBtn.addEventListener('click', function(){
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  // hero carousel: autoplay + arrows + dots
  var hero = document.querySelector('.hero');
  if(!hero){ return; }
  var slides = hero.querySelectorAll('.hero-slide');
  var dots = hero.querySelectorAll('.hero-dot');
  var eyebrow = hero.querySelector('.hero-slide-eyebrow');
  var title = hero.querySelector('.hero-slide-title');
  var slideData = [
    { cat: 'Architecture', name: 'Siriului Office' },
    { cat: 'Interior Design', name: 'Studio Alb' },
    { cat: 'Hospitality', name: 'Restaurant Kuib' }
  ];
  var current = 0, timer;
  function goTo(i){
    current = (i + slides.length) % slides.length;
    slides.forEach(function(s, idx){ s.classList.toggle('is-active', idx === current); });
    dots.forEach(function(d, idx){ d.classList.toggle('is-active', idx === current); });
    eyebrow.textContent = slideData[current].cat;
    title.textContent = slideData[current].name;
  }
  function next(){ goTo(current + 1); }
  function startAutoplay(){ if(reduceMotion) return; timer = setInterval(next, 5500); }
  function stopAutoplay(){ clearInterval(timer); }
  hero.querySelector('.hero-prev').addEventListener('click', function(){ goTo(current - 1); stopAutoplay(); startAutoplay(); });
  hero.querySelector('.hero-next').addEventListener('click', function(){ goTo(current + 1); stopAutoplay(); startAutoplay(); });
  dots.forEach(function(d){
    d.addEventListener('click', function(){ goTo(parseInt(d.dataset.index, 10)); stopAutoplay(); startAutoplay(); });
  });
  hero.addEventListener('mouseenter', stopAutoplay);
  hero.addEventListener('mouseleave', startAutoplay);
  startAutoplay();
})();
