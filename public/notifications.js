// Enhanced Toast Notification System - KeyGuardius Dashboard
const NotificationSystem = {
    container: null,
    queue: [],
    
    init() {
        if (this.container) return;
        
        // Create notification container
        this.container = document.createElement('div');
        this.container.id = 'notification-container';
        this.container.style.cssText = `
            position: fixed;
            top: 24px;
            right: 24px;
            z-index: 99999;
            display: flex;
            flex-direction: column;
            gap: 12px;
            pointer-events: none;
            max-width: 420px;
        `;
        document.body.appendChild(this.container);
    },
    
    show(message, type = 'info', duration = 4000) {
        this.init();
        
        const notification = document.createElement('div');
        notification.className = 'notification-toast';
        notification.style.cssText = `
            pointer-events: all;
            background: rgba(10, 10, 10, 0.98);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 12px;
            padding: 14px 16px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(24px);
            display: flex;
            align-items: center;
            gap: 12px;
            transform: translateX(450px);
            opacity: 0;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            font-family: 'DM Sans', sans-serif;
            font-size: 14px;
            max-width: 420px;
            word-wrap: break-word;
        `;
        
        const colors = {
            success: { 
                border: '#22c55e', 
                icon: '#22c55e', 
                bg: 'rgba(34, 197, 94, 0.1)',
                ringColor: 'rgba(34, 197, 94, 0.2)'
            },
            error: { 
                border: '#ef4444', 
                icon: '#ef4444', 
                bg: 'rgba(239, 68, 68, 0.1)',
                ringColor: 'rgba(239, 68, 68, 0.2)'
            },
            warning: { 
                border: '#f59e0b', 
                icon: '#f59e0b', 
                bg: 'rgba(245, 158, 11, 0.1)',
                ringColor: 'rgba(245, 158, 11, 0.2)'
            },
            info: { 
                border: '#3b82f6', 
                icon: '#3b82f6', 
                bg: 'rgba(59, 130, 246, 0.1)',
                ringColor: 'rgba(59, 130, 246, 0.2)'
            }
        };
        
        const color = colors[type] || colors.info;
        notification.style.borderLeft = `3px solid ${color.border}`;
        notification.style.background = `linear-gradient(to right, ${color.bg}, rgba(10, 10, 10, 0.98))`;
        
        const icons = {
            success: `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${color.icon}" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
            `,
            error: `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${color.icon}" stroke-width="2.5">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
            `,
            warning: `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${color.icon}" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
                </svg>
            `,
            info: `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${color.icon}" stroke-width="2.5">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="16" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
            `
        };
        
        notification.innerHTML = `
            <div style="
                flex-shrink: 0; 
                width: 36px;
                height: 36px;
                border-radius: 8px;
                background: ${color.bg};
                border: 1px solid ${color.ringColor};
                display: flex;
                align-items: center;
                justify-content: center;
            ">
                ${icons[type] || icons.info}
            </div>
            <div style="flex: 1; color: #fafafa; line-height: 1.5; font-weight: 500;">
                ${message}
            </div>
            <button onclick="this.parentElement.remove()" style="
                flex-shrink: 0; 
                background: rgba(255, 255, 255, 0.05); 
                border: 1px solid rgba(255, 255, 255, 0.08);
                color: rgba(255, 255, 255, 0.6); 
                cursor: pointer; 
                padding: 0; 
                font-size: 18px; 
                line-height: 1; 
                width: 28px; 
                height: 28px; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                border-radius: 6px; 
                transition: all 0.2s;
                font-weight: 400;
            " onmouseover="this.style.background='rgba(255, 255, 255, 0.1)'; this.style.color='rgba(255, 255, 255, 0.9)';" onmouseout="this.style.background='rgba(255, 255, 255, 0.05)'; this.style.color='rgba(255, 255, 255, 0.6)';">
                ×
            </button>
        `;
        
        this.container.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        });
        
        // Auto remove
        if (duration > 0) {
            setTimeout(() => {
                notification.style.transform = 'translateX(450px)';
                notification.style.opacity = '0';
                setTimeout(() => notification.remove(), 400);
            }, duration);
        }
        
        return notification;
    },
    
    success(message, duration = 4000) {
        return this.show(message, 'success', duration);
    },
    
    error(message, duration = 5000) {
        return this.show(message, 'error', duration);
    },
    
    warning(message, duration = 4500) {
        return this.show(message, 'warning', duration);
    },
    
    info(message, duration = 4000) {
        return this.show(message, 'info', duration);
    },
    
    loading(message) {
        return this.show(`
            <div style="display: flex; align-items: center; gap: 8px;">
                <div style="
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(59, 130, 246, 0.3);
                    border-top-color: #3b82f6;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                "></div>
                <span>${message}</span>
            </div>
        `, 'info', 0);
    },
    
    clear() {
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
};

// Confetti animation for celebrations
const Confetti = {
    create() {
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 99999 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            
            // Create confetti particles
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: fixed;
                    width: 10px;
                    height: 10px;
                    background: hsl(${Math.random() * 360}, 100%, 50%);
                    left: ${Math.random() * 100}%;
                    top: -10px;
                    opacity: 1;
                    z-index: 99999;
                    pointer-events: none;
                    animation: confetti-fall ${randomInRange(2, 4)}s linear forwards;
                `;
                document.body.appendChild(particle);
                
                setTimeout(() => particle.remove(), 4000);
            }
        }, 250);
    }
};

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    @keyframes confetti-fall {
        to {
            transform: translateY(100vh) rotate(${Math.random() * 360}deg);
            opacity: 0;
        }
    }
    @keyframes pulse-glow {
        0%, 100% { 
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
        }
        50% { 
            box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
        }
    }
`;
document.head.appendChild(style);

// Global shortcuts
window.notify = NotificationSystem;
window.confetti = Confetti;
