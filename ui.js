/* Icon Kin workspace preferences. Never written into the project archive. */
(() => {
  'use strict';
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themeLabel = document.getElementById('themeLabel');
  const navToggle = document.getElementById('navToggle');
  const safeGet = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const safeSet = (key, value) => { try { localStorage.setItem(key, value); } catch {} };
  const systemDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  const preferred = safeGet('iconkin.ui.theme');
  function setTheme(theme) {
    const dark = theme === 'dark';
    root.dataset.theme = dark ? 'dark' : 'light';
    if (themeLabel) themeLabel.textContent = dark ? 'Light mode' : 'Dark mode';
    themeToggle?.setAttribute('aria-pressed', String(dark));
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = dark ? '#171d29' : '#f0eee8';
    safeSet('iconkin.ui.theme', theme);
  }
  setTheme(['light','dark'].includes(preferred) ? preferred : (systemDark ? 'dark' : 'light'));
  themeToggle?.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
  const storedNav = safeGet('iconkin.ui.navCollapsed');
  const navCollapsed = storedNav === null ? (window.innerWidth > 900 && window.innerWidth <= 1180) : storedNav === 'true';
  document.body.classList.toggle('nav-collapsed', navCollapsed);
  navToggle?.setAttribute('aria-expanded', String(!navCollapsed));
  navToggle?.addEventListener('click', () => {
    const collapsed = document.body.classList.toggle('nav-collapsed');
    navToggle.setAttribute('aria-expanded', String(!collapsed));
    safeSet('iconkin.ui.navCollapsed', String(collapsed));
  });
})();
