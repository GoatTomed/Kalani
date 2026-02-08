// KeyGuardius Live Activity Feed
// Real-time activity updates without emojis

(function() {
    'use strict';

    const LiveFeed = {
        updateInterval: null,
        
        init() {
            this.createFeedWidget();
            this.startUpdates();
        },

        createFeedWidget() {
            // Check if widget already exists
            if (document.getElementById('live-feed-widget')) return;

            // Only show on dashboard page
            if (!window.location.pathname.includes('dashboard')) return;

            const widget = document.createElement('div');
            widget.id = 'live-feed-widget';
            widget.className = 'fixed bottom-6 left-6 w-80 max-h-96 bg-black/90 border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden z-40';
            
            widget.innerHTML = `
                <div class="bg-gradient-to-r from-blue-600 to-blue-500 p-4 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <h3 class="font-bold text-white">Live Activity</h3>
                    </div>
                    <button id="toggle-feed" class="text-white/80 hover:text-white transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
                        </svg>
                    </button>
                </div>
                <div id="feed-content" class="max-h-80 overflow-y-auto">
                    <div id="activity-list" class="divide-y divide-white/5"></div>
                </div>
                <div class="p-3 bg-white/[0.02] border-t border-white/5 text-center">
                    <span class="text-xs text-zinc-500">Updates every 10 seconds</span>
                </div>
            `;

            document.body.appendChild(widget);

            // Toggle functionality
            document.getElementById('toggle-feed').addEventListener('click', () => {
                const content = document.getElementById('feed-content');
                const icon = document.querySelector('#toggle-feed svg');
                
                if (content.style.display === 'none') {
                    content.style.display = 'block';
                    icon.style.transform = 'rotate(0deg)';
                } else {
                    content.style.display = 'none';
                    icon.style.transform = 'rotate(180deg)';
                }
            });

            this.updateFeed();
        },

        updateFeed() {
            const activityList = document.getElementById('activity-list');
            if (!activityList) return;

            const activities = this.getRecentActivities();
            
            if (activities.length === 0) {
                activityList.innerHTML = `
                    <div class="p-4 text-center text-zinc-500 text-sm">
                        No recent activity
                    </div>
                `;
                return;
            }

            activityList.innerHTML = activities.map(activity => {
                const timeAgo = this.getTimeAgo(activity.timestamp);
                const icon = this.getActivityIcon(activity.activity);
                
                return `
                    <div class="p-3 hover:bg-white/[0.02] transition-colors">
                        <div class="flex items-start gap-3">
                            <div class="flex-shrink-0 w-8 h-8 rounded-lg ${icon.bg} flex items-center justify-center">
                                ${icon.svg}
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm text-white">
                                    <span class="font-semibold">${activity.user}</span>
                                    <span class="text-zinc-400"> ${activity.activity}</span>
                                </p>
                                <p class="text-xs text-zinc-600 mt-1">${timeAgo}</p>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        },

        getRecentActivities() {
            // Get activities from localStorage
            const activities = JSON.parse(localStorage.getItem('kg_activities') || '[]');
            
            // Get last 10 activities
            return activities.slice(0, 10);
        },

        getActivityIcon(activity) {
            if (activity.includes('earned') || activity.includes('points')) {
                return {
                    bg: 'bg-yellow-500/10',
                    svg: '<svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd"/></svg>'
                };
            } else if (activity.includes('generated') || activity.includes('key')) {
                return {
                    bg: 'bg-green-500/10',
                    svg: '<svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg>'
                };
            } else if (activity.includes('unlocked') || activity.includes('script')) {
                return {
                    bg: 'bg-purple-500/10',
                    svg: '<svg class="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>'
                };
            } else if (activity.includes('verified') || activity.includes('checkpoint')) {
                return {
                    bg: 'bg-blue-500/10',
                    svg: '<svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
                };
            } else if (activity.includes('streak') || activity.includes('milestone')) {
                return {
                    bg: 'bg-orange-500/10',
                    svg: '<svg class="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clip-rule="evenodd"/></svg>'
                };
            } else {
                return {
                    bg: 'bg-white/5',
                    svg: '<svg class="w-4 h-4 text-zinc-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>'
                };
            }
        },

        getTimeAgo(timestamp) {
            const now = Date.now();
            const diff = now - timestamp;
            
            const seconds = Math.floor(diff / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);

            if (days > 0) return `${days}d ago`;
            if (hours > 0) return `${hours}h ago`;
            if (minutes > 0) return `${minutes}m ago`;
            return `${seconds}s ago`;
        },

        startUpdates() {
            // Update every 10 seconds
            this.updateInterval = setInterval(() => {
                this.updateFeed();
            }, 10000);
        },

        refresh() {
            this.updateFeed();
        },

        stop() {
            if (this.updateInterval) {
                clearInterval(this.updateInterval);
            }
        }
    };

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => LiveFeed.init());
    } else {
        LiveFeed.init();
    }

    // Expose to window
    window.LiveFeed = LiveFeed;

})();
