
        // Reflect uploaded mock memories in the game cards' stats
        document.addEventListener('DOMContentLoaded', () => {
            MockMemories.syncGameCards();
        });

        // Micro-interaction for hover effects on glass cards
        document.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    