
    // Micro-interaction: Active state logic for nav
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.forEach(l => {
          l.classList.remove('text-primary', 'font-bold', 'border-r-2', 'border-primary', 'bg-white/5', 'scale-95');
          l.classList.add('text-on-surface-variant');
        });
        link.classList.remove('text-on-surface-variant');
        link.classList.add('text-primary', 'font-bold', 'border-r-2', 'border-primary', 'bg-white/5', 'scale-95');
      });
    });

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.glass-surface').forEach(card => {
      card.classList.add('opacity-0', 'translate-y-10', 'transition-all', 'duration-700');
      observer.observe(card);
    });
  