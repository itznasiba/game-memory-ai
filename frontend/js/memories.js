
        // Render uploaded mock memories into the library grid
        const memoriesGrid = document.getElementById('memories-grid');
        const uploadBtn = document.getElementById('upload-memory-btn');
        if (memoriesGrid) {
            const memories = MockMemories.getAll();
            memories.forEach(memory => {
                const wrapper = document.createElement('div');
                wrapper.innerHTML = MockMemories.cardHTML(memory);
                const card = wrapper.firstElementChild;
                if (uploadBtn) {
                    memoriesGrid.insertBefore(card, uploadBtn);
                } else {
                    memoriesGrid.appendChild(card);
                }
            });
        }
        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => {
                window.location.href = 'upload_memory.html';
            });
        }

        // Smooth entrance for AI insights
        window.addEventListener('load', () => {
            setTimeout(() => {
                const insight = document.getElementById('insight-1');
                if (insight) insight.classList.remove('translate-x-full');
            }, 1500);
        });

        // Hover effect for glow points - subtle interaction
        document.querySelectorAll('.glass-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                const glow = card.querySelector('.glow-point');
                if (glow) {
                    glow.style.boxShadow = "0 0 20px #7c3aed, 0 0 40px #7c3aed";
                    glow.style.transform = "scale(1.5)";
                    glow.style.transition = "all 0.4s ease";
                }
            });
            card.addEventListener('mouseleave', () => {
                const glow = card.querySelector('.glow-point');
                if (glow) {
                    glow.style.boxShadow = "0 0 10px #7c3aed";
                    glow.style.transform = "scale(1)";
                }
            });
        });
    