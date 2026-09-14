
// ----- Scroll reveal -----
(function () {
    var reveals = document.querySelectorAll('.reveal, .reveal-fade');
    if ('IntersectionObserver' in window && reveals.length) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.05, rootMargin: '0px 0px 0px 0px' });
        reveals.forEach(function (el) { observer.observe(el); });
    } else {
        reveals.forEach(function (el) { el.classList.add('is-visible'); });
    }
})();

// ----- Scroll-linked divider fill -----
(function () {
    var dividers = document.querySelectorAll('.event-divider');
    if (!dividers.length) return;

    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
        dividers.forEach(function (el) { el.style.setProperty('--fill', '100%'); });
        return;
    }

    var ticking = false;

    function updateDividers() {
        var vh = window.innerHeight;
        var startLine = vh * 0.85;
        var endLine = vh * 0.35;

        dividers.forEach(function (el) {
            var rect = el.getBoundingClientRect();
            var progress = (startLine - rect.top) / (startLine - endLine);
            if (progress < 0) progress = 0;
            if (progress > 1) progress = 1;
            el.style.setProperty('--fill', (progress * 100) + '%');
        });
        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(updateDividers);
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    updateDividers();
})();

// ----- Countdown -----
var target = new Date("2026-10-02T00:00:00");

function updateCountdown() {
    var now = new Date();
    var diff = target - now;
    var el = document.getElementById('countdown');

    if (diff <= 0) {
        el.innerHTML = '<div class="countdown-done">Երջանիկ Հարսանիք&nbsp;! 🤍</div>';
        return;
    }
    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    var secs = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('cd-days').textContent = String(days);
    document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('cd-mins').textContent = String(mins).padStart(2, '0');
    document.getElementById('cd-secs').textContent = String(secs).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ----- RSVP form via Google Sheets (Apps Script Web App) -----
var SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzpPbs-uDaYakxZMVW2wh8PV22Rm3vK5ArZpNGd3HOz6X_o95_L9j6BnJc6WnayF7k/exec";

var rsvpForm = document.getElementById('rsvp-form');
var rsvpStatus = document.getElementById('form-status');

rsvpForm.setAttribute('action', SCRIPT_URL);

rsvpForm.addEventListener('submit', function () {
    rsvpStatus.textContent = "Ուղարկվում է…";
    // The actual POST is handled natively by the browser (target="hidden_iframe"),
    // so we don't block on it — just give the guest clear, immediate feedback.
    setTimeout(function () {
        rsvpStatus.textContent = "Շնորհակալություն! Ձեր պատասխանը ստացվեց 🤍";
        rsvpForm.reset();
    }, 900);
});

// ----- Background music (starts on first scroll) -----
(function () {
    var YT_VIDEO_ID = 'sdTWmPMyeMo';
    var ytPlayer = null;
    var musicStarted = false;
    var musicPlaying = false;

    var toggleBtn = document.getElementById('music-toggle');
    var iconOn = document.getElementById('music-icon-on');
    var iconOff = document.getElementById('music-icon-off');

    function setIcon(playing) {
        iconOn.style.display = playing ? 'block' : 'none';
        iconOff.style.display = playing ? 'none' : 'block';
    }
    setIcon(false);

    // Load the YouTube IFrame API script
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);

    window.onYouTubeIframeAPIReady = function () {
        ytPlayer = new YT.Player('yt-player', {
            height: '1',
            width: '1',
            videoId: YT_VIDEO_ID,
            playerVars: {
                autoplay: 0,
                controls: 0,
                disablekb: 1,
                loop: 1,
                playlist: YT_VIDEO_ID,
                playsinline: 1
            },
            events: {
                onStateChange: function (e) {
                    if (e.data === YT.PlayerState.PLAYING) {
                        musicPlaying = true;
                        setIcon(true);
                    } else if (e.data === YT.PlayerState.PAUSED) {
                        musicPlaying = false;
                        setIcon(false);
                    }
                }
            }
        });
    };

    function startMusic() {
        if (musicStarted || !ytPlayer || typeof ytPlayer.playVideo !== 'function') return;
        musicStarted = true;
        try {
            ytPlayer.playVideo();
        } catch (err) { }
    }

    // Try to start on the first scroll (and as a fallback, first click/touch)
    window.addEventListener('scroll', startMusic, { once: true, passive: true });
    window.addEventListener('click', startMusic, { once: true });
    window.addEventListener('touchstart', startMusic, { once: true, passive: true });

    toggleBtn.addEventListener('click', function () {
        if (!ytPlayer || typeof ytPlayer.playVideo !== 'function') return;
        musicStarted = true;
        if (musicPlaying) {
            ytPlayer.pauseVideo();
        } else {
            ytPlayer.playVideo();
        }
    });
})();

