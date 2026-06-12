/* Mock auth + memory data layer (localStorage-backed) for the static demo build. */
(function () {
    const SESSION_KEY = 'gma_session';
    const USERS_KEY = 'gma_users';
    const MEMORIES_KEY = 'gma_uploaded_memories';

    // Pages reachable without an active session
    const PUBLIC_PAGES = ['login.html', 'register.html', 'home.html', ''];

    const DEMO_USER = {
        name: 'Alex Mercer',
        email: 'demo@gamememory.ai',
        password: 'demo1234',
        rank: 'Pro Gamer Elite'
    };

    function getUsers() {
        const raw = localStorage.getItem(USERS_KEY);
        if (!raw) {
            const seeded = [DEMO_USER];
            localStorage.setItem(USERS_KEY, JSON.stringify(seeded));
            return seeded;
        }
        return JSON.parse(raw);
    }

    function saveUsers(users) {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    function getSession() {
        const raw = localStorage.getItem(SESSION_KEY);
        return raw ? JSON.parse(raw) : null;
    }

    function setSession(user) {
        localStorage.setItem(SESSION_KEY, JSON.stringify({
            name: user.name,
            email: user.email,
            rank: user.rank || 'Rookie Chronicler'
        }));
    }

    const MockAuth = {
        register(name, email, password) {
            const users = getUsers();
            if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
                return { ok: false, error: 'An account with this email already exists.' };
            }
            const user = { name, email, password, rank: 'Rookie Chronicler' };
            users.push(user);
            saveUsers(users);
            setSession(user);
            return { ok: true };
        },
        login(email, password) {
            const users = getUsers();
            const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
            if (!user || user.password !== password) {
                return { ok: false, error: 'Invalid email or password.' };
            }
            setSession(user);
            return { ok: true };
        },
        logout() {
            localStorage.removeItem(SESSION_KEY);
            window.location.href = 'login.html';
        },
        getUser() {
            return getSession();
        }
    };

    // ---- Memory library --------------------------------------------------

    const TAGS = ['Boss Fight', 'Story Beat', 'Quest Log', 'Achievement', 'Exploration', 'NPC Meet'];

    const TAG_STYLES = {
        'Boss Fight': { badge: 'bg-primary/20 border-primary/30 text-primary', icon: 'skull' },
        'Story Beat': { badge: 'bg-tertiary/20 border-tertiary/30 text-tertiary', icon: 'auto_stories' },
        'Quest Log': { badge: 'bg-secondary/20 border-secondary/30 text-secondary', icon: 'explore' },
        'Achievement': { badge: 'bg-error/20 border-error/30 text-error', icon: 'emoji_events' },
        'Exploration': { badge: 'bg-primary/20 border-primary/30 text-primary', icon: 'travel_explore' },
        'NPC Meet': { badge: 'bg-primary/20 border-primary/30 text-primary', icon: 'groups' }
    };

    const INSIGHT_TEMPLATES = [
        'AI detected a heart-rate spike and {n} perfect parries during this session. Logged as a Legendary milestone.',
        'Dialogue branch analyzed: a pivotal choice was made here. Emotion sync registered at {n}%.',
        'AI cataloged {n} new points of interest and flagged this moment as a key story beat.',
        'Combat analysis shows a critical strike accuracy of {n}%. This session was tagged as a standout performance.',
        'Exploration sync complete: {n} hidden areas uncovered. AI marked this as a memorable discovery.',
        'AI recorded a flawless encounter with {n} successful counters. Reflexes rated Inhuman.'
    ];

    const MEMORY_IMAGES = [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAwLQ9k4sw2GI8k7Y2aC13cNZEuAsr9WNAs0pQ9T4AL6Rda3cMk5gV9puWWWyAdEOB9cXgxxGLfkbsylLjOC0ffnwS027LJeLg1Mh2rv9rHGqvJoowVf7hhMRuMeWO7Jqjgq-LCSso6a-cl_n5CTdC_xNPPCL96fm_2Tfvbta2GbW6Paof32hE1F6Lf-FcWwQrSHG8ZItv9FGZxENhOuNiiwq4ONLSTX95QSuVv8iMZyI2Y2nOhprpSuLOMrvxGwBacRe0CQRqHDPU',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCEAoiHeZQM0pqs_g-6Kdj6NqDUCr7en-A_ZdBlQWr8817TJ2mM0wHKAkZ5YVunZnFi8_ZLfSoZff1-C2ofLi2_eDKufB1wwjc0J4I0-24Kn2KOl9vUW7wDKzrSiOuf_a5t9Vvoa4jf7TaR3ddsKFk97F0VBrif51kskZoRxE41ER_9ZYRm1fNOX57ZVeyAIlUicmMEpckYeaHW-BodXEpTnQPqhq18ZCxYapaKp8QiiUmSUD3bWvrbFfzMpNpiRIJI0bmtoqhBD2Q',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA45r9L3L-8fglOPnbhWsrvXlJKqg49By553OS2YYg3x4KvC6gVioooe1hZJg9SoTRT2J_BXsM15E87QufXhu1kjb997FwiJ7Ua-Fd7MDxGNKtH3tPsbr-W9UJIYClDDaTpAEcg2Iswj0Z_WvbA_suH1KiTcQzbh1DeCcKbKS998IQfZwyMUM3r6NLJz9z3SZlBEgFKovcKWVrilAWb-MulbyMvzmRluB1fEScXUvcbLrVDSu9HT9AzZG3fcGZVe2vwqLnVAhTE7yE',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBYPlUwraqHGM1t32C6Kqt1fiYKZCVKBbXeWJBKzsP01zewvYZDMaXCkgbYPnDexiBca0tmT7cn_rzFAPZ1wXzG4SoPrL_2MIIjhF4movGS7FV0F3jLDmvrKWczyXapheDfc3kBzZopiUIIkIlwErBQ3Sn2LzBHikHrKKa3na0gX9GNcxiHIy2CeomzoVB1eqcEmPM_ARke_EP7AU21akHSQYqe2v3VWbk8WxthERAiTACKU3xSCwelBb4RjNZWniZXSf0Ml_TlZk4',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDckkfzube5g9M8yG8_MdmACuOlItPt4DRfPf4YchvExl8LiyqSH8-LIMahIvjEEVOEjexRuMk3uVa86K16uqR7_pajjDD19EnGc56wuUNOx9zZthg0M5sRwgpQprB77qbJB2u2I9e2DKljvd8ygu8AoaGhlcaDN2HrEGMz1QQwZ-0VnLY7fAFuBr8wTsvDQzDXpjZCsjyJ_eifjFyO1LFsA2RK2-JYGZxAzHXm-gHDx7vUGKUsgBWbxjy1_OTCWp6T8w-4yG6oJ_E',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCcySm7JcG9E9E57RWn7n8Iey_sOgKwXsvgsTfGIBSwrHh0qGaWTM2AWcnJpHtkOCgxcd0h9SaAKGTqUUP_EUzI8GZXLmzudAdGaBnFbS3nrq9bLjRt7u0ZmZ7droU0K1aItdCEgZ_YUO5nzNAP-x9Np9tcHSMeUyRyXt8DzBIBOx6NjqeZpeWQRh2C3wzgBe185C_vM5vG8ucak7q5qFYwkludkM_YArRvj68sB3oWL1Fh8lvOOmDLHsSiu1RdaO-OFBokfJOJe0A'
    ];

    function pick(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function generateInsight() {
        const template = pick(INSIGHT_TEMPLATES);
        const n = Math.floor(Math.random() * 60) + 10;
        return template.replace('{n}', n);
    }

    function formatDate(date) {
        return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    }

    const MockMemories = {
        getAll() {
            const raw = localStorage.getItem(MEMORIES_KEY);
            return raw ? JSON.parse(raw) : [];
        },
        add({ title, game, notes, tag }) {
            const memories = MockMemories.getAll();
            const resolvedTag = tag && TAGS.includes(tag) ? tag : pick(TAGS);
            const memory = {
                id: Date.now(),
                title: title && title.trim() ? title.trim() : `${game || 'New'} Session Highlight`,
                game: game && game.trim() ? game.trim() : 'Unknown Game',
                tag: resolvedTag,
                description: notes && notes.trim() ? notes.trim() : generateInsight(),
                aiInsight: generateInsight(),
                date: formatDate(new Date()),
                image: pick(MEMORY_IMAGES)
            };
            memories.unshift(memory);
            localStorage.setItem(MEMORIES_KEY, JSON.stringify(memories));
            return memory;
        },
        tagStyle(tag) {
            return TAG_STYLES[tag] || TAG_STYLES['Story Beat'];
        },
        // Card used on memories.html
        cardHTML(memory) {
            const style = MockMemories.tagStyle(memory.tag);
            return `
                <div class="glass-card rounded-xl overflow-hidden group">
                    <div class="relative aspect-video">
                        <img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="${memory.image}" />
                        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                        <div class="absolute top-3 left-3 flex gap-2">
                            <span class="${style.badge} backdrop-blur-md border text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter">${memory.tag}</span>
                        </div>
                    </div>
                    <div class="p-5">
                        <div class="flex justify-between items-start mb-2">
                            <h3 class="text-headline-md font-headline-md text-on-surface group-hover:text-primary transition-colors">${memory.title}</h3>
                            <div class="glow-point mt-2"></div>
                        </div>
                        <p class="text-body-md font-body-md text-on-surface-variant/80 line-clamp-2 mb-4">${memory.description}</p>
                        <div class="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                            <div class="flex items-center gap-2">
                                <span class="material-symbols-outlined text-[16px] text-primary">calendar_today</span>
                                <span class="text-label-sm font-label-sm text-on-surface-variant">${memory.date}</span>
                            </div>
                            <span class="text-label-sm font-label-sm px-2 py-1 rounded bg-white/5 text-on-surface-variant">${memory.game}</span>
                        </div>
                    </div>
                </div>`;
        },
        // Card used on dashboard.html "Recent Memories"
        dashboardCardHTML(memory) {
            return `
                <div class="glass-surface p-6 rounded-2xl flex flex-col gap-4 group">
                    <div class="h-40 rounded-xl overflow-hidden relative">
                        <img class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="${memory.image}" />
                        <div class="absolute top-3 right-3 bg-tertiary/20 backdrop-blur-md border border-tertiary/30 px-2 py-1 rounded text-[10px] font-bold text-tertiary">${memory.tag.toUpperCase()}</div>
                    </div>
                    <div>
                        <div class="flex justify-between items-start mb-2">
                            <h5 class="text-body-lg font-bold">${memory.title}</h5>
                            <span class="text-label-sm text-on-surface-variant">${memory.game}</span>
                        </div>
                        <p class="text-label-md text-on-surface-variant line-clamp-2">${memory.aiInsight}</p>
                    </div>
                </div>`;
        },
        // Milestone block used on timeline.html (inserted before "Current State")
        timelineMilestoneHTML(memory) {
            const style = MockMemories.tagStyle(memory.tag);
            return `
                <div class="relative grid grid-cols-1 md:grid-cols-2 gap-12 mb-32 items-center">
                    <div class="order-2 md:order-1 text-right pr-8">
                        <div class="inline-flex flex-col items-end">
                            <span class="text-primary font-label-md text-label-md mb-2">${memory.date}</span>
                            <h3 class="text-headline-md font-headline-md mb-3 text-on-surface">${memory.title}</h3>
                            <p class="text-on-surface-variant text-body-md font-body-md leading-relaxed">${memory.aiInsight}</p>
                        </div>
                    </div>
                    <div class="absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full glass-card flex items-center justify-center z-10 border-primary/40 ring-4 ring-background">
                        <span class="material-symbols-outlined text-primary">${style.icon}</span>
                    </div>
                    <div class="order-1 md:order-2 pl-8">
                        <div class="glass-card rounded-2xl overflow-hidden aspect-video relative group">
                            <img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="${memory.image}" />
                            <div class="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
                            <div class="absolute top-3 left-3 bg-primary/20 backdrop-blur-md border border-primary/30 text-primary text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter">${memory.game}</div>
                        </div>
                    </div>
                </div>`;
        },
        // Updates "Last Played" / "Memories" counters on my_games.html for a matching game card
        syncGameCards() {
            const memories = MockMemories.getAll();
            if (!memories.length) return;
            const cards = document.querySelectorAll('.game-card');
            cards.forEach(card => {
                const titleEl = card.querySelector('.p-5 h3');
                if (!titleEl) return;
                const title = titleEl.textContent.trim().replace(/\s+/g, ' ');
                const count = memories.filter(m => m.game.trim().toLowerCase() === title.toLowerCase()).length;
                if (!count) return;

                const rows = card.querySelectorAll('.flex.items-center.justify-between.text-label-md');
                rows.forEach(row => {
                    const label = row.querySelector('span.flex');
                    if (!label) return;
                    if (label.textContent.includes('Last Played')) {
                        row.querySelector('span.text-on-surface').textContent = 'Just now';
                    } else if (label.textContent.includes('Memories')) {
                        const valueEl = row.querySelector('span.text-on-surface');
                        const match = valueEl.textContent.match(/(\d+)/);
                        const base = match ? parseInt(match[1], 10) : 0;
                        valueEl.textContent = `${base + count} Captures`;
                    }
                });
            });
        }
    };

    window.MockAuth = MockAuth;
    window.MockMemories = MockMemories;

    // ---- Route guard --------------------------------------------------------

    const page = location.pathname.split('/').pop();
    const session = getSession();

    if (page === 'login.html' || page === 'register.html') {
        if (session) window.location.replace('dashboard.html');
    } else if (!PUBLIC_PAGES.includes(page)) {
        if (!session) window.location.replace('login.html');
    }

    // ---- Shared UI: logout button + demo-account hint -----------------------

    document.addEventListener('DOMContentLoaded', () => {
        if (session && !PUBLIC_PAGES.includes(page)) {
            const btn = document.createElement('button');
            btn.id = 'mock-logout-btn';
            btn.title = `Logged in as ${session.name}`;
            btn.innerHTML = '<span class="material-symbols-outlined text-[16px]">logout</span><span>Logout</span>';
            btn.style.cssText = 'position:fixed;top:8px;right:8px;z-index:100;display:flex;align-items:center;gap:6px;padding:6px 14px;border-radius:9999px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.7);font-size:12px;font-weight:500;backdrop-filter:blur(8px);cursor:pointer;transition:all 0.2s;';
            btn.addEventListener('mouseenter', () => { btn.style.color = '#d2bbff'; btn.style.borderColor = 'rgba(210,187,255,0.4)'; });
            btn.addEventListener('mouseleave', () => { btn.style.color = 'rgba(255,255,255,0.7)'; btn.style.borderColor = 'rgba(255,255,255,0.1)'; });
            btn.addEventListener('click', () => MockAuth.logout());
            document.body.appendChild(btn);
        }

        if (page === 'login.html') {
            const form = document.querySelector('form');
            if (form) {
                const hint = document.createElement('p');
                hint.className = 'text-center mt-4 font-label-sm text-label-sm text-on-surface-variant/60';
                hint.textContent = 'Demo account: demo@gamememory.ai / demo1234';
                form.appendChild(hint);
            }
        }
    });
})();
