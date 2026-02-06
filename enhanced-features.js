// KeyGuardius Enhanced Features
// Features: Keyboard shortcuts, copy feedback, theme toggle, key history, mobile menu, PWA

(function() {
    'use strict';

    // ============================================
    // THEME TOGGLE - Dark/Light Mode
    // ============================================
    const ThemeManager = {
        init() {
            const savedTheme = localStorage.getItem('kg_theme') || 'dark';
            this.setTheme(savedTheme);
            this.createToggle();
        },

        setTheme(theme) {
            document.documentElement.classList.remove('dark', 'light');
            document.documentElement.classList.add(theme);
            localStorage.setItem('kg_theme', theme);
            
            // Update meta theme color
            const metaTheme = document.querySelector('meta[name="theme-color"]');
            if (metaTheme) {
                metaTheme.content = theme === 'dark' ? '#0a0a0a' : '#ffffff';
            }
        },

        toggle() {
            const current = localStorage.getItem('kg_theme') || 'dark';
            const newTheme = current === 'dark' ? 'light' : 'dark';
            this.setTheme(newTheme);
            
            if (window.notify) {
                notify.success(`Switched to ${newTheme} mode`, 2000);
            }
        },

        createToggle() {
            const nav = document.querySelector('nav .flex.items-center.gap-6');
            if (!nav) return;

            const toggle = document.createElement('button');
            toggle.id = 'theme-toggle';
            toggle.className = 'relative w-12 h-6 bg-white/10 rounded-full border border-white/20 transition-all hover:bg-white/15';
            toggle.setAttribute('aria-label', 'Toggle theme');
            
            toggle.innerHTML = `
                <div class="absolute top-0.5 left-0.5 w-5 h-5 bg-blue-500 rounded-full transition-transform duration-300 flex items-center justify-center theme-toggle-icon">
                    <svg class="w-3 h-3 text-white moon-icon" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
                    </svg>
                    <svg class="w-3 h-3 text-white sun-icon hidden" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>
                    </svg>
                </div>
            `;

            toggle.addEventListener('click', () => this.toggle());
            
            // Insert before "Get Key" button
            const getKeyBtn = nav.querySelector('a[href="/dashboard"]');
            if (getKeyBtn) {
                nav.insertBefore(toggle, getKeyBtn);
            } else {
                nav.appendChild(toggle);
            }

            this.updateToggleIcon();
        },

        updateToggleIcon() {
            const toggle = document.getElementById('theme-toggle');
            if (!toggle) return;

            const theme = localStorage.getItem('kg_theme') || 'dark';
            const icon = toggle.querySelector('.theme-toggle-icon');
            const moonIcon = toggle.querySelector('.moon-icon');
            const sunIcon = toggle.querySelector('.sun-icon');

            if (theme === 'light') {
                icon.style.transform = 'translateX(24px)';
                moonIcon.classList.add('hidden');
                sunIcon.classList.remove('hidden');
            } else {
                icon.style.transform = 'translateX(0)';
                moonIcon.classList.remove('hidden');
                sunIcon.classList.add('hidden');
            }
        }
    };

    // ============================================
    // MOBILE NAVIGATION - Hamburger Menu
    // ============================================
    const MobileMenu = {
        init() {
            this.createHamburger();
            this.handleResize();
            window.addEventListener('resize', () => this.handleResize());
        },

        createHamburger() {
            const nav = document.querySelector('nav .max-w-7xl');
            if (!nav) return;

            const hamburger = document.createElement('button');
            hamburger.id = 'mobile-menu-toggle';
            hamburger.className = 'lg:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all';
            hamburger.setAttribute('aria-label', 'Toggle menu');
            hamburger.innerHTML = `
                <svg class="w-5 h-5 hamburger-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
                <svg class="w-5 h-5 close-icon hidden" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            `;

            const navLinks = nav.querySelector('.flex.items-center.gap-6');
            if (navLinks) {
                navLinks.parentElement.insertBefore(hamburger, navLinks);
            }

            hamburger.addEventListener('click', () => this.toggleMenu());
            
            // Create mobile menu
            this.createMobileMenuPanel();
        },

        createMobileMenuPanel() {
            const existingPanel = document.getElementById('mobile-menu-panel');
            if (existingPanel) return;

            const panel = document.createElement('div');
            panel.id = 'mobile-menu-panel';
            panel.className = 'fixed inset-0 z-50 lg:hidden hidden';
            panel.innerHTML = `
                <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" id="mobile-menu-overlay"></div>
                <div class="absolute top-0 right-0 bottom-0 w-64 bg-black/95 border-l border-white/10 transform translate-x-full transition-transform duration-300" id="mobile-menu-content">
                    <div class="flex flex-col h-full">
                        <div class="p-6 border-b border-white/10 flex items-center justify-between">
                            <span class="font-semibold">Menu</span>
                            <button id="mobile-menu-close" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>
                        <div class="flex-1 overflow-y-auto p-4">
                            <nav class="space-y-2">
                                <a href="/dashboard" class="block px-4 py-3 rounded-lg hover:bg-white/5 transition-colors">
                                    <div class="flex items-center gap-3">
                                        <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                                        </svg>
                                        <span class="font-medium">Dashboard</span>
                                    </div>
                                </a>
                                <a href="/scripts" class="block px-4 py-3 rounded-lg hover:bg-white/5 transition-colors">
                                    <div class="flex items-center gap-3">
                                        <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                                        </svg>
                                        <span class="font-medium">Scripts</span>
                                    </div>
                                </a>
                                <a href="/executors" class="block px-4 py-3 rounded-lg hover:bg-white/5 transition-colors">
                                    <div class="flex items-center gap-3">
                                        <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/>
                                        </svg>
                                        <span class="font-medium">Executors</span>
                                    </div>
                                </a>
                                <a href="/faq" class="block px-4 py-3 rounded-lg hover:bg-white/5 transition-colors">
                                    <div class="flex items-center gap-3">
                                        <svg class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                        </svg>
                                        <span class="font-medium">FAQ</span>
                                    </div>
                                </a>
                                <a href="/changelog" class="block px-4 py-3 rounded-lg hover:bg-white/5 transition-colors">
                                    <div class="flex items-center gap-3">
                                        <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                                        </svg>
                                        <span class="font-medium">Changelog</span>
                                    </div>
                                </a>
                            </nav>
                        </div>
                        <div class="p-4 border-t border-white/10">
                            <a href="/dashboard" class="block w-full px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold text-center transition-all">
                                Get Key
                            </a>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(panel);

            // Add event listeners
            document.getElementById('mobile-menu-overlay').addEventListener('click', () => this.closeMenu());
            document.getElementById('mobile-menu-close').addEventListener('click', () => this.closeMenu());
        },

        toggleMenu() {
            const panel = document.getElementById('mobile-menu-panel');
            const hamburgerIcon = document.querySelector('.hamburger-icon');
            const closeIcon = document.querySelector('.close-icon');
            
            if (panel.classList.contains('hidden')) {
                this.openMenu();
            } else {
                this.closeMenu();
            }
        },

        openMenu() {
            const panel = document.getElementById('mobile-menu-panel');
            const content = document.getElementById('mobile-menu-content');
            const hamburgerIcon = document.querySelector('.hamburger-icon');
            const closeIcon = document.querySelector('.close-icon');

            panel.classList.remove('hidden');
            setTimeout(() => {
                content.style.transform = 'translateX(0)';
            }, 10);

            hamburgerIcon.classList.add('hidden');
            closeIcon.classList.remove('hidden');

            document.body.style.overflow = 'hidden';
        },

        closeMenu() {
            const panel = document.getElementById('mobile-menu-panel');
            const content = document.getElementById('mobile-menu-content');
            const hamburgerIcon = document.querySelector('.hamburger-icon');
            const closeIcon = document.querySelector('.close-icon');

            content.style.transform = 'translateX(100%)';
            setTimeout(() => {
                panel.classList.add('hidden');
            }, 300);

            hamburgerIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');

            document.body.style.overflow = '';
        },

        handleResize() {
            if (window.innerWidth >= 1024) {
                this.closeMenu();
            }
        }
    };

    // ============================================
    // KEYBOARD SHORTCUTS
    // ============================================
    const KeyboardShortcuts = {
        shortcuts: {
            'ctrl+k': () => window.location.href = '/scripts',
            'ctrl+h': () => window.location.href = '/dashboard',
            'ctrl+e': () => window.location.href = '/executors',
            'ctrl+/': () => this.showHelp(),
            'esc': () => MobileMenu.closeMenu()
        },

        init() {
            document.addEventListener('keydown', (e) => this.handleKeyPress(e));
            this.createHelpModal();
        },

        handleKeyPress(e) {
            const key = [];
            if (e.ctrlKey || e.metaKey) key.push('ctrl');
            if (e.shiftKey) key.push('shift');
            if (e.altKey) key.push('alt');
            
            const keyName = e.key.toLowerCase();
            if (keyName !== 'control' && keyName !== 'shift' && keyName !== 'alt' && keyName !== 'meta') {
                key.push(keyName === 'escape' ? 'esc' : keyName);
            }

            const combo = key.join('+');
            const handler = this.shortcuts[combo];

            if (handler) {
                e.preventDefault();
                handler();
            }

            // Copy key shortcut (Ctrl+C on access key)
            if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
                const keyElement = document.getElementById('access-key');
                if (keyElement && !window.getSelection().toString()) {
                    e.preventDefault();
                    CopyFeedback.copyKey(keyElement.textContent);
                }
            }
        },

        showHelp() {
            const modal = document.getElementById('keyboard-shortcuts-modal');
            if (modal) {
                modal.classList.remove('hidden');
                setTimeout(() => {
                    modal.querySelector('.modal-content').style.transform = 'scale(1)';
                    modal.querySelector('.modal-content').style.opacity = '1';
                }, 10);
            }
        },

        createHelpModal() {
            const modal = document.createElement('div');
            modal.id = 'keyboard-shortcuts-modal';
            modal.className = 'fixed inset-0 z-[9999] hidden flex items-center justify-center bg-black/80 backdrop-blur-sm';
            modal.innerHTML = `
                <div class="modal-content bg-zinc-900 border border-white/10 rounded-xl p-6 max-w-md w-full mx-4 transform scale-95 opacity-0 transition-all duration-300">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-xl font-bold">Keyboard Shortcuts</h3>
                        <button onclick="document.getElementById('keyboard-shortcuts-modal').classList.add('hidden')" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                    <div class="space-y-3">
                        <div class="flex items-center justify-between py-2 border-b border-white/5">
                            <span class="text-zinc-400">Dashboard</span>
                            <kbd class="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs font-mono">Ctrl+H</kbd>
                        </div>
                        <div class="flex items-center justify-between py-2 border-b border-white/5">
                            <span class="text-zinc-400">Scripts</span>
                            <kbd class="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs font-mono">Ctrl+K</kbd>
                        </div>
                        <div class="flex items-center justify-between py-2 border-b border-white/5">
                            <span class="text-zinc-400">Executors</span>
                            <kbd class="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs font-mono">Ctrl+E</kbd>
                        </div>
                        <div class="flex items-center justify-between py-2 border-b border-white/5">
                            <span class="text-zinc-400">Copy Key</span>
                            <kbd class="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs font-mono">Ctrl+C</kbd>
                        </div>
                        <div class="flex items-center justify-between py-2 border-b border-white/5">
                            <span class="text-zinc-400">Close Menu</span>
                            <kbd class="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs font-mono">Esc</kbd>
                        </div>
                        <div class="flex items-center justify-between py-2">
                            <span class="text-zinc-400">This Help</span>
                            <kbd class="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs font-mono">Ctrl+/</kbd>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                }
            });
        }
    };

    // ============================================
    // COPY TO CLIPBOARD FEEDBACK
    // ============================================
    const CopyFeedback = {
        init() {
            this.attachCopyListeners();
        },

        attachCopyListeners() {
            // Find all copy buttons
            document.addEventListener('click', (e) => {
                const copyBtn = e.target.closest('[data-copy]');
                if (copyBtn) {
                    e.preventDefault();
                    const text = copyBtn.getAttribute('data-copy') || copyBtn.textContent;
                    this.copyKey(text);
                }
            });
        },

        async copyKey(text) {
            try {
                await navigator.clipboard.writeText(text);
                this.showFeedback(true);
                
                if (window.notify) {
                    notify.success('Copied to clipboard!', 2000);
                }

                // Haptic feedback on mobile
                if (navigator.vibrate) {
                    navigator.vibrate(50);
                }
            } catch (err) {
                console.error('Copy failed:', err);
                this.showFeedback(false);
                
                if (window.notify) {
                    notify.error('Failed to copy', 2000);
                }
            }
        },

        showFeedback(success) {
            const feedback = document.createElement('div');
            feedback.className = 'fixed top-24 right-6 z-[9999] animate-slide-in';
            feedback.innerHTML = `
                <div class="bg-${success ? 'green' : 'red'}-500/20 border border-${success ? 'green' : 'red'}-500/50 rounded-lg px-4 py-3 flex items-center gap-3 shadow-xl">
                    <svg class="w-5 h-5 text-${success ? 'green' : 'red'}-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        ${success ? 
                            '<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>' :
                            '<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>'
                        }
                    </svg>
                    <span class="font-medium">${success ? 'Copied!' : 'Failed to copy'}</span>
                </div>
            `;

            document.body.appendChild(feedback);

            setTimeout(() => {
                feedback.style.opacity = '0';
                feedback.style.transform = 'translateX(100px)';
                setTimeout(() => feedback.remove(), 300);
            }, 2000);
        }
    };

    // ============================================
    // KEY HISTORY
    // ============================================
    const KeyHistory = {
        init() {
            this.createHistoryButton();
        },

        createHistoryButton() {
            // Add history button to dashboard if it exists
            const dashboard = document.querySelector('.max-w-7xl.mx-auto.px-6.py-12');
            if (!dashboard) return;

            const historyBtn = document.createElement('button');
            historyBtn.className = 'fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-500 rounded-full shadow-xl flex items-center justify-center transition-all z-50';
            historyBtn.innerHTML = `
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
            `;

            historyBtn.addEventListener('click', () => this.showHistory());
            document.body.appendChild(historyBtn);
        },

        showHistory() {
            const history = this.getHistory();
            
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm';
            modal.innerHTML = `
                <div class="bg-zinc-900 border border-white/10 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-2xl font-bold">Key History</h3>
                        <button onclick="this.closest('.fixed').remove()" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                    <div class="space-y-3">
                        ${history.length > 0 ? history.map(item => `
                            <div class="bg-white/5 border border-white/10 rounded-lg p-4">
                                <div class="flex items-start justify-between mb-2">
                                    <div class="flex-1">
                                        <div class="font-mono text-sm bg-white/5 px-3 py-2 rounded border border-white/10 mb-2">
                                            ${item.key}
                                        </div>
                                        <div class="flex items-center gap-4 text-xs text-zinc-500">
                                            <span>Generated: ${new Date(item.generated).toLocaleString()}</span>
                                            ${item.expired ? '<span class="text-red-400">Expired</span>' : '<span class="text-green-400">Active</span>'}
                                        </div>
                                    </div>
                                    <button onclick="navigator.clipboard.writeText('${item.key}')" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-medium transition-all">
                                        Copy
                                    </button>
                                </div>
                            </div>
                        `).join('') : '<p class="text-center text-zinc-500 py-8">No key history found</p>'}
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });
        },

        getHistory() {
            const keys = [];
            
            // Get all stored keys
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith('kg_key_')) {
                    try {
                        const data = JSON.parse(localStorage.getItem(key));
                        if (data.key) {
                            keys.push({
                                key: data.key,
                                generated: data.expiryTime - (24 * 60 * 60 * 1000),
                                expired: data.expiryTime < Date.now()
                            });
                        }
                    } catch (e) {}
                }
            }

            return keys.sort((a, b) => b.generated - a.generated);
        }
    };

    // ============================================
    // PWA INSTALLATION
    // ============================================
    const PWAInstaller = {
        deferredPrompt: null,

        init() {
            window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                this.deferredPrompt = e;
                this.showInstallButton();
            });

            window.addEventListener('appinstalled', () => {
                console.log('PWA installed successfully');
                if (window.notify) {
                    notify.success('App installed! You can now use KeyGuardius offline.', 5000);
                }
            });

            // Register service worker
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/service-worker.js')
                    .then(reg => console.log('Service Worker registered:', reg))
                    .catch(err => console.error('Service Worker registration failed:', err));
            }
        },

        showInstallButton() {
            const nav = document.querySelector('nav .flex.items-center.gap-6');
            if (!nav || document.getElementById('pwa-install-btn')) return;

            const installBtn = document.createElement('button');
            installBtn.id = 'pwa-install-btn';
            installBtn.className = 'hidden md:flex items-center gap-2 px-3 py-2 bg-purple-600/20 border border-purple-500/30 rounded-lg text-purple-400 text-sm font-medium hover:bg-purple-600/30 transition-all';
            installBtn.innerHTML = `
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                Install App
            `;

            installBtn.addEventListener('click', () => this.install());

            const themeToggle = document.getElementById('theme-toggle');
            if (themeToggle) {
                nav.insertBefore(installBtn, themeToggle);
            } else {
                nav.appendChild(installBtn);
            }
        },

        async install() {
            if (!this.deferredPrompt) return;

            this.deferredPrompt.prompt();
            const { outcome } = await this.deferredPrompt.userChoice;

            if (outcome === 'accepted') {
                console.log('User accepted the install prompt');
            }

            this.deferredPrompt = null;
            document.getElementById('pwa-install-btn')?.remove();
        }
    };

    // ============================================
    // INITIALIZE ALL FEATURES
    // ============================================
    function initEnhancedFeatures() {
        ThemeManager.init();
        MobileMenu.init();
        KeyboardShortcuts.init();
        CopyFeedback.init();
        KeyHistory.init();
        PWAInstaller.init();

        console.log('✅ KeyGuardius Enhanced Features v2.5 loaded');
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEnhancedFeatures);
    } else {
        initEnhancedFeatures();
    }

    // Export to window for external access
    window.KGFeatures = {
        ThemeManager,
        MobileMenu,
        KeyboardShortcuts,
        CopyFeedback,
        KeyHistory,
        PWAInstaller
    };

})();
