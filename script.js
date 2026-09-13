// ----- Scroll reveal -----
(function () {
    var reveals = document.querySelectorAll('.reveal, .reveal-fade, .reveal-line, .timeline-connector');
    if ('IntersectionObserver' in window && reveals.length) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
        reveals.forEach(function (el) { observer.observe(el); });
    } else {
        reveals.forEach(function (el) { el.classList.add('is-visible'); });
    }
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
// Replace the URL below with your own Apps Script Web App URL (see setup instructions provided separately)
var SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzM5vo5hzCgB3g3EvYCzQIuvd8k7iP0ND6vlVC-6GIekUoT4yJvvWjad70152Tko6s/exec";

var form = document.getElementById('rsvp-form');
var status = document.getElementById('form-status');

form.addEventListener('submit', function (e) {
    e.preventDefault();
    status.textContent = "Ուղարկվում է…";

    fetch(SCRIPT_URL, {
        method: 'POST',
        body: new FormData(form)
    }).then(function () {
        status.textContent = "Շնորհակալություն! Ձեր պատասխանը ստացվեց 🤍";
        form.reset();
    }).catch(function () {
        status.textContent = "Չհաջողվեց ուղարկել։ Խնդրում ենք փորձել կրկին։";
    });
});
