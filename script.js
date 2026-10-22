(function () {
    const THEMES = ['auto', 'theme-morning', 'theme-day', 'theme-sunset', 'theme-night'];
    const THEME_LABELS = {
        'theme-morning': 'Morning',
        'theme-day': 'Day',
        'theme-sunset': 'Sunset',
        'theme-night': 'Night'
    };

    const timeEl = document.getElementById('local-time');
    const badgeEl = document.getElementById('time-badge');

    let manualMode = 'auto';
    try {
        const saved = sessionStorage.getItem('mh_theme_mode');
        if (saved && THEMES.includes(saved)) {
            manualMode = saved;
        }
    } catch (_) {
        // Ignore storage errors in restricted environments
    }

    function getMalaysiaThemeClass(now) {
        const hourStr = now.toLocaleString('en-US', {
            timeZone: 'Asia/Kuala_Lumpur',
            hour: 'numeric',
            hour12: false
        });
        const hour = parseInt(hourStr, 10);

        if (hour >= 6 && hour < 10) return 'theme-morning';
        if (hour >= 10 && hour < 17) return 'theme-day';
        if (hour >= 17 && hour < 20) return 'theme-sunset';
        return 'theme-night';
    }

    function applyThemeAndTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            timeZone: 'Asia/Kuala_Lumpur',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });

        const autoTheme = getMalaysiaThemeClass(now);
        const activeTheme = manualMode === 'auto' ? autoTheme : manualMode;

        document.body.classList.remove('theme-morning', 'theme-day', 'theme-sunset', 'theme-night');
        document.body.classList.add(activeTheme);

        if (timeEl) {
            if (manualMode === 'auto') {
                timeEl.textContent = timeString + ' MYT';
            } else {
                timeEl.textContent = timeString + ' MYT · ' + THEME_LABELS[activeTheme];
            }
        }
    }

    if (badgeEl) {
        badgeEl.addEventListener('click', function () {
            const nextIndex = (THEMES.indexOf(manualMode) + 1) % THEMES.length;
            manualMode = THEMES[nextIndex];
            try {
                sessionStorage.setItem('mh_theme_mode', manualMode);
            } catch (_) {}
            applyThemeAndTime();
        });

        badgeEl.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                badgeEl.click();
            }
        });
    }

    applyThemeAndTime();
    setInterval(applyThemeAndTime, 1000);
})();
