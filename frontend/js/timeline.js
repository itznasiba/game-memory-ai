
        // Micro-interactions for the timeline
        document.addEventListener('DOMContentLoaded', () => {
            // Insert uploaded mock memories as milestones just before the "Current State" block
            const currentStateBlock = document.getElementById('current-state-block');
            if (currentStateBlock) {
                const memories = MockMemories.getAll();
                memories.slice().reverse().forEach(memory => {
                    const wrapper = document.createElement('div');
                    wrapper.innerHTML = MockMemories.timelineMilestoneHTML(memory);
                    currentStateBlock.parentNode.insertBefore(wrapper.firstElementChild, currentStateBlock);
                });
            }

            const cards = document.querySelectorAll('.glass-card');

            const observerOptions = {
                threshold: 0.2
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('opacity-100');
                        entry.target.classList.remove('translate-y-10');
                        entry.target.style.transition = 'all 0.8s ease-out';
                    }
                });
            }, observerOptions);

            cards.forEach(card => {
                card.classList.add('opacity-0', 'translate-y-10');
                observer.observe(card);
            });
        });
    