// KeyGuardius Rewards System
// Points, Daily Login, Streaks, Exclusive Scripts

(function() {
    'use strict';

    const RewardsSystem = {
        // Points configuration
        POINTS: {
            VERIFICATION: 10,        // Points per checkpoint verification
            DAILY_LOGIN: 25,         // Points for daily login
            STREAK_BONUS: 5,         // Extra points per streak day
            KEY_GENERATED: 15        // Points when full key is generated
        },

        // Streak thresholds
        STREAKS: {
            5: { bonus: 50, name: '5 Day Streak' },
            10: { bonus: 150, name: '10 Day Streak' },
            15: { bonus: 300, name: '15 Day Streak' },
            30: { bonus: 1000, name: '30 Day Streak' },
            50: { bonus: 2500, name: '50 Day Streak' },
            100: { bonus: 10000, name: '100 Day Streak' }
        },

        // Exclusive scripts that can be unlocked with points
        EXCLUSIVE_SCRIPTS: [
            {
                id: 'vd_premium',
                name: 'Violence District Premium',
                description: 'Enhanced Violence District with exclusive features and auto-updates',
                cost: 500,
                script: 'loadstring(game:HttpGet("https://pastebin.com/raw/PREMIUM_VD"))()',
                thumbnail: 'https://i.imgur.com/1hwYNcw.png',
                status: 'active'
            },
            {
                id: 'vd_ultimate',
                name: 'Violence District Ultimate',
                description: 'Ultimate edition with all premium features, custom configs, and priority support',
                cost: 1500,
                script: 'loadstring(game:HttpGet("https://pastebin.com/raw/ULTIMATE_VD"))()',
                thumbnail: 'https://i.imgur.com/1hwYNcw.png',
                status: 'active'
            },
            {
                id: 'universal_esp',
                name: 'Universal ESP Pro',
                description: 'Advanced ESP with customizable colors, filters, and distance settings',
                cost: 750,
                script: 'loadstring(game:HttpGet("https://pastebin.com/raw/ESP_PRO"))()',
                thumbnail: 'https://i.imgur.com/XqM9Y2L.png',
                status: 'active'
            }
        ],

        init() {
            this.checkDailyLogin();
            this.updatePointsDisplay();
            this.createRewardsButton();
        },

        // Get user data
        getUserData() {
            const username = 'Tom'; // Default username
            const key = `kg_rewards_${username}`;
            const defaultData = {
                points: 0,
                totalPoints: 0,
                lastLogin: null,
                currentStreak: 0,
                bestStreak: 0,
                totalVerifications: 0,
                totalKeysGenerated: 0,
                unlockedScripts: [],
                streakMilestones: []
            };
            
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultData;
        },

        // Save user data
        saveUserData(data) {
            const username = 'Tom';
            const key = `kg_rewards_${username}`;
            localStorage.setItem(key, JSON.stringify(data));
        },

        // Check daily login and streak
        checkDailyLogin() {
            const userData = this.getUserData();
            const now = Date.now();
            const lastLogin = userData.lastLogin;
            const oneDayMs = 24 * 60 * 60 * 1000;

            if (!lastLogin) {
                // First time login
                userData.currentStreak = 1;
                userData.lastLogin = now;
                this.addPoints(userData, this.POINTS.DAILY_LOGIN, 'Daily Login Bonus');
                this.saveUserData(userData);
                this.showNotification('Welcome! Daily login bonus: +' + this.POINTS.DAILY_LOGIN + ' points');
                return;
            }

            const timeSinceLastLogin = now - lastLogin;

            if (timeSinceLastLogin < oneDayMs) {
                // Already logged in today
                return;
            }

            if (timeSinceLastLogin > oneDayMs * 2) {
                // Missed a day - reset streak
                const oldStreak = userData.currentStreak;
                userData.currentStreak = 1;
                userData.lastLogin = now;
                this.addPoints(userData, this.POINTS.DAILY_LOGIN, 'Daily Login Bonus');
                this.saveUserData(userData);
                
                if (oldStreak > 1) {
                    this.showNotification('Streak reset! Daily login bonus: +' + this.POINTS.DAILY_LOGIN + ' points', 'warning');
                } else {
                    this.showNotification('Daily login bonus: +' + this.POINTS.DAILY_LOGIN + ' points');
                }
                return;
            }

            // Valid daily login - increment streak
            userData.currentStreak++;
            if (userData.currentStreak > userData.bestStreak) {
                userData.bestStreak = userData.currentStreak;
            }
            userData.lastLogin = now;

            // Calculate total bonus
            let totalBonus = this.POINTS.DAILY_LOGIN + (userData.currentStreak * this.POINTS.STREAK_BONUS);
            
            // Check for streak milestone
            if (this.STREAKS[userData.currentStreak]) {
                const milestone = this.STREAKS[userData.currentStreak];
                totalBonus += milestone.bonus;
                
                if (!userData.streakMilestones.includes(userData.currentStreak)) {
                    userData.streakMilestones.push(userData.currentStreak);
                    this.addPoints(userData, totalBonus, milestone.name + ' Milestone!');
                    this.saveUserData(userData);
                    this.showNotification(milestone.name + ' achieved! +' + totalBonus + ' points!', 'success');
                    return;
                }
            }

            this.addPoints(userData, totalBonus, 'Daily Login + Streak Bonus');
            this.saveUserData(userData);
            this.showNotification('Day ' + userData.currentStreak + ' streak! +' + totalBonus + ' points');
        },

        // Add points to user
        addPoints(userData, amount, reason) {
            userData.points += amount;
            userData.totalPoints += amount;
            this.logActivity('earned ' + amount + ' points - ' + reason);
        },

        // Award points for verification
        awardVerificationPoints() {
            const userData = this.getUserData();
            userData.totalVerifications++;
            this.addPoints(userData, this.POINTS.VERIFICATION, 'Checkpoint Verified');
            this.saveUserData(userData);
            this.updatePointsDisplay();
            this.showNotification('Verification complete! +' + this.POINTS.VERIFICATION + ' points');
        },

        // Award points for key generation
        awardKeyPoints() {
            const userData = this.getUserData();
            userData.totalKeysGenerated++;
            this.addPoints(userData, this.POINTS.KEY_GENERATED, 'Key Generated');
            this.saveUserData(userData);
            this.updatePointsDisplay();
            this.showNotification('Key generated! +' + this.POINTS.KEY_GENERATED + ' points');
        },

        // Update points display in navbar
        updatePointsDisplay() {
            const userData = this.getUserData();
            let pointsDisplay = document.getElementById('points-display');
            
            if (!pointsDisplay) {
                const nav = document.querySelector('nav .flex.items-center.gap-6');
                if (!nav) return;

                pointsDisplay = document.createElement('div');
                pointsDisplay.id = 'points-display';
                pointsDisplay.className = 'flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-lg cursor-pointer hover:bg-yellow-500/20 transition-all';
                pointsDisplay.innerHTML = `
                    <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd"/>
                    </svg>
                    <span class="text-sm font-bold text-yellow-400" id="points-value">${userData.points}</span>
                `;

                pointsDisplay.addEventListener('click', () => this.openRewardsPanel());

                const getKeyBtn = nav.querySelector('a[href="/dashboard"]');
                if (getKeyBtn) {
                    nav.insertBefore(pointsDisplay, getKeyBtn);
                }
            } else {
                document.getElementById('points-value').textContent = userData.points;
            }
        },

        // Create rewards button
        createRewardsButton() {
            // Check if button already exists
            if (document.getElementById('rewards-btn')) return;

            const nav = document.querySelector('nav .flex.items-center.gap-6');
            if (!nav) return;

            const rewardsBtn = document.createElement('a');
            rewardsBtn.id = 'rewards-btn';
            rewardsBtn.href = '#';
            rewardsBtn.className = 'text-sm text-zinc-400 hover:text-yellow-400 transition-colors';
            rewardsBtn.textContent = 'Rewards';
            rewardsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openRewardsPanel();
            });

            const scriptsLink = nav.querySelector('a[href="/scripts"]');
            if (scriptsLink) {
                scriptsLink.parentNode.insertBefore(rewardsBtn, scriptsLink.nextSibling);
            }
        },

        // Open rewards panel
        openRewardsPanel() {
            // Remove existing panel if any
            const existing = document.getElementById('rewards-panel');
            if (existing) {
                existing.remove();
                return;
            }

            const userData = this.getUserData();
            
            const panel = document.createElement('div');
            panel.id = 'rewards-panel';
            panel.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6';
            
            panel.innerHTML = `
                <div class="max-w-4xl w-full bg-black/90 border border-white/[0.08] rounded-2xl p-8 max-h-[90vh] overflow-y-auto">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">Rewards Center</h2>
                        <button id="close-rewards" class="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/10">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>

                    <!-- Stats Grid -->
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div class="border border-white/[0.08] rounded-xl p-4 bg-white/[0.02] text-center">
                            <div class="text-2xl font-bold text-yellow-400 mb-1">${userData.points}</div>
                            <div class="text-xs text-zinc-500">Current Points</div>
                        </div>
                        <div class="border border-white/[0.08] rounded-xl p-4 bg-white/[0.02] text-center">
                            <div class="text-2xl font-bold text-blue-400 mb-1">${userData.currentStreak}</div>
                            <div class="text-xs text-zinc-500">Day Streak</div>
                        </div>
                        <div class="border border-white/[0.08] rounded-xl p-4 bg-white/[0.02] text-center">
                            <div class="text-2xl font-bold text-green-400 mb-1">${userData.totalVerifications}</div>
                            <div class="text-xs text-zinc-500">Verifications</div>
                        </div>
                        <div class="border border-white/[0.08] rounded-xl p-4 bg-white/[0.02] text-center">
                            <div class="text-2xl font-bold text-purple-400 mb-1">${userData.bestStreak}</div>
                            <div class="text-xs text-zinc-500">Best Streak</div>
                        </div>
                    </div>

                    <!-- Streak Milestones -->
                    <div class="mb-8">
                        <h3 class="text-xl font-bold mb-4">Streak Milestones</h3>
                        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                            ${Object.entries(this.STREAKS).map(([days, data]) => {
                                const achieved = userData.streakMilestones.includes(parseInt(days));
                                return `
                                    <div class="border ${achieved ? 'border-green-500/30 bg-green-500/5' : 'border-white/[0.08] bg-white/[0.02]'} rounded-lg p-3">
                                        <div class="flex items-center justify-between mb-1">
                                            <span class="text-sm font-semibold ${achieved ? 'text-green-400' : 'text-zinc-400'}">${data.name}</span>
                                            ${achieved ? '<svg class="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>' : ''}
                                        </div>
                                        <div class="text-xs text-zinc-500">+${data.bonus} points</div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>

                    <!-- Exclusive Scripts -->
                    <div>
                        <h3 class="text-xl font-bold mb-4">Exclusive Scripts</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            ${this.EXCLUSIVE_SCRIPTS.map(script => {
                                const unlocked = userData.unlockedScripts.includes(script.id);
                                const canAfford = userData.points >= script.cost;
                                return `
                                    <div class="border border-white/[0.08] rounded-xl bg-white/[0.02] overflow-hidden">
                                        <div class="p-4">
                                            <div class="flex items-start justify-between mb-2">
                                                <h4 class="text-lg font-bold">${script.name}</h4>
                                                ${unlocked ? '<span class="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded text-xs font-bold text-green-400">UNLOCKED</span>' : `<span class="px-2 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded text-xs font-bold text-yellow-400">${script.cost} pts</span>`}
                                            </div>
                                            <p class="text-sm text-zinc-400 mb-4">${script.description}</p>
                                            ${unlocked ? 
                                                `<button class="w-full h-10 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold text-sm transition-all copy-script-btn" data-script="${script.script}">Copy Script</button>` :
                                                canAfford ?
                                                `<button class="w-full h-10 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg font-semibold text-sm transition-all unlock-script-btn" data-id="${script.id}" data-cost="${script.cost}">Unlock for ${script.cost} Points</button>` :
                                                `<button class="w-full h-10 bg-white/5 text-zinc-600 rounded-lg font-semibold text-sm cursor-not-allowed" disabled>Need ${script.cost - userData.points} more points</button>`
                                            }
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(panel);

            // Event listeners
            document.getElementById('close-rewards').addEventListener('click', () => panel.remove());
            panel.addEventListener('click', (e) => {
                if (e.target === panel) panel.remove();
            });

            // Unlock script buttons
            document.querySelectorAll('.unlock-script-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const scriptId = btn.getAttribute('data-id');
                    const cost = parseInt(btn.getAttribute('data-cost'));
                    this.unlockScript(scriptId, cost);
                });
            });

            // Copy script buttons
            document.querySelectorAll('.copy-script-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const script = btn.getAttribute('data-script');
                    navigator.clipboard.writeText(script);
                    btn.textContent = 'Copied!';
                    this.showNotification('Script copied to clipboard!');
                    setTimeout(() => btn.textContent = 'Copy Script', 2000);
                });
            });
        },

        // Unlock script with points
        unlockScript(scriptId, cost) {
            const userData = this.getUserData();
            
            if (userData.points < cost) {
                this.showNotification('Not enough points!', 'error');
                return;
            }

            userData.points -= cost;
            userData.unlockedScripts.push(scriptId);
            this.saveUserData(userData);
            this.updatePointsDisplay();
            
            const script = this.EXCLUSIVE_SCRIPTS.find(s => s.id === scriptId);
            this.logActivity('unlocked ' + script.name);
            this.showNotification('Script unlocked: ' + script.name + '!', 'success');
            
            // Refresh panel
            document.getElementById('rewards-panel').remove();
            this.openRewardsPanel();
        },

        // Show notification
        showNotification(message, type = 'info') {
            if (window.notify) {
                if (type === 'success') {
                    notify.success(message);
                } else if (type === 'error') {
                    notify.error(message);
                } else if (type === 'warning') {
                    notify.warning(message);
                } else {
                    notify.info(message);
                }
            }
        },

        // Log activity for live feed
        logActivity(activity) {
            const activities = JSON.parse(localStorage.getItem('kg_activities') || '[]');
            activities.unshift({
                user: 'Tom',
                activity: activity,
                timestamp: Date.now()
            });
            
            // Keep only last 50 activities
            if (activities.length > 50) {
                activities.splice(50);
            }
            
            localStorage.setItem('kg_activities', JSON.stringify(activities));
            
            // Trigger activity feed update if it exists
            if (window.LiveFeed && window.LiveFeed.refresh) {
                window.LiveFeed.refresh();
            }
        }
    };

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => RewardsSystem.init());
    } else {
        RewardsSystem.init();
    }

    // Expose to window
    window.RewardsSystem = RewardsSystem;

})();
