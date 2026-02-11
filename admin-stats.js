// Admin Stats System - Only visible on /admin
// Auto-incrementing stats that actually work!

(function() {
    'use strict';

    const username = 'Tom';
    const isAdmin = window.location.pathname === '/admin' || window.location.pathname === '/admin.html';

    // Show admin features if on admin page
    if (isAdmin) {
        document.getElementById('admin-tabs')?.style.setProperty('display', 'flex');
        document.getElementById('admin-stats')?.style.setProperty('display', 'grid');
        console.log(' Admin mode enabled');
    }

    // Initialize checkpoints
    function initializeCheckpoints() {
        const workinkCheckpoint = {
            id: 'cp_workink_001',
            name: 'Work.ink Method',
            user: username,
            created: Date.now(),
            steps: [
                { num: 1, title: 'First Step', prov: 'Work.ink', url: 'https://work.ink/2dbK/GetKey' },
                { num: 2, title: 'Last Step', prov: 'Work.ink', url: 'https://work.ink/2dbK/Last%20Step' }
            ]
        };

        const lockrCheckpoint = {
            id: 'cp_lockr_001',
            name: 'Lockr Method',
            user: username,
            created: Date.now(),
            steps: [
                { num: 1, title: 'First Checkpoint', prov: 'Lockr.so', url: 'https://lockr.so/MIrQvlBS' },
                { num: 2, title: 'Second Checkpoint', prov: 'Lockr.so', url: 'https://lockr.so/2ePc3iqT' }
            ]
        };

        localStorage.setItem(`kg_checkpoint_${username}_${workinkCheckpoint.id}`, JSON.stringify(workinkCheckpoint));
        localStorage.setItem(`kg_checkpoint_${username}_${lockrCheckpoint.id}`, JSON.stringify(lockrCheckpoint));

        const userDataKey = `kg_data_${username}`;
        if (!localStorage.getItem(userDataKey)) {
            localStorage.setItem(userDataKey, JSON.stringify({
                username: username,
                sessionTokens: {},
                totalVerifications: 0
            }));
        }

        updateProgress();
        if (isAdmin) {
            updateAdminStats();
        }
    }

    // Update admin statistics
    function updateAdminStats() {
        if (!isAdmin) return;

        const userData = JSON.parse(localStorage.getItem(`kg_data_${username}`) || '{}');
        const deviceId = localStorage.getItem('device_id') || 'default';
        const now = Date.now();

        // Total verifications
        const totalVerifications = userData.totalVerifications || 0;
        document.getElementById('total-verifications').textContent = totalVerifications;

        // Get all keys
        let activeKeys = 0;
        let expiredKeys = 0;
        let totalTimeLeft = 0;

        // Check Work.ink key
        const workinkKey = JSON.parse(localStorage.getItem(`kg_key_workink_${deviceId}`) || 'null');
        if (workinkKey) {
            if (workinkKey.expiryTime > now) {
                activeKeys++;
                totalTimeLeft += (workinkKey.expiryTime - now);
            } else {
                expiredKeys++;
            }
        }

        // Check Lockr key
        const lockrKey = JSON.parse(localStorage.getItem(`kg_key_lockr_${deviceId}`) || 'null');
        if (lockrKey) {
            if (lockrKey.expiryTime > now) {
                activeKeys++;
                totalTimeLeft += (lockrKey.expiryTime - now);
            } else {
                expiredKeys++;
            }
        }

        // Update displays
        document.getElementById('active-keys').textContent = activeKeys;
        document.getElementById('expired-keys').textContent = expiredKeys;

        // Average time left
        if (activeKeys > 0) {
            const avgMs = totalTimeLeft / activeKeys;
            const avgHours = Math.floor(avgMs / 3600000);
            document.getElementById('avg-time').textContent = `${avgHours}h`;
        } else {
            document.getElementById('avg-time').textContent = '0h';
        }
    }

    // Update progress bars
    function updateProgress() {
        const userData = JSON.parse(localStorage.getItem(`kg_data_${username}`) || '{}');
        const sessionTokens = userData.sessionTokens || {};
        const deviceId = localStorage.getItem('device_id') || 'default';
        const now = Date.now();

        // Check and reset Work.ink progress if key expired
        const workinkKeyData = JSON.parse(localStorage.getItem(`kg_key_workink_${deviceId}`) || 'null');
        if (workinkKeyData && workinkKeyData.expiryTime <= now) {
            const step1KeyWorkink = `cp_workink_001-1-${deviceId}`;
            const step2KeyWorkink = `cp_workink_001-2-${deviceId}`;
            delete sessionTokens[step1KeyWorkink];
            delete sessionTokens[step2KeyWorkink];
            localStorage.setItem(`kg_data_${username}`, JSON.stringify({...userData, sessionTokens}));
            localStorage.removeItem(`kg_key_workink_${deviceId}`);
        }

        // Check and reset Lockr progress if key expired
        const lockrKeyData = JSON.parse(localStorage.getItem(`kg_key_lockr_${deviceId}`) || 'null');
        if (lockrKeyData && lockrKeyData.expiryTime <= now) {
            const step1KeyLockr = `cp_lockr_001-1-${deviceId}`;
            const step2KeyLockr = `cp_lockr_001-2-${deviceId}`;
            delete sessionTokens[step1KeyLockr];
            delete sessionTokens[step2KeyLockr];
            localStorage.setItem(`kg_data_${username}`, JSON.stringify({...userData, sessionTokens}));
            localStorage.removeItem(`kg_key_lockr_${deviceId}`);
        }

        // Update Work.ink progress
        let workinkCompletedSteps = 0;
        const step1KeyWorkink = `cp_workink_001-1-${deviceId}`;
        const step2KeyWorkink = `cp_workink_001-2-${deviceId}`;
        
        if (sessionTokens[step1KeyWorkink]?.verified) workinkCompletedSteps++;
        if (sessionTokens[step2KeyWorkink]?.verified) workinkCompletedSteps++;

        const workinkProgress = (workinkCompletedSteps / 2) * 100;
        document.getElementById('workink-progress-text').textContent = `${workinkCompletedSteps}/2 Complete`;
        document.getElementById('workink-progress-bar').style.width = `${workinkProgress}%`;

        // Update Lockr progress
        let lockrCompletedSteps = 0;
        const step1KeyLockr = `cp_lockr_001-1-${deviceId}`;
        const step2KeyLockr = `cp_lockr_001-2-${deviceId}`;
        
        if (sessionTokens[step1KeyLockr]?.verified) lockrCompletedSteps++;
        if (sessionTokens[step2KeyLockr]?.verified) lockrCompletedSteps++;

        const lockrProgress = (lockrCompletedSteps / 2) * 100;
        document.getElementById('lockr-progress-text').textContent = `${lockrCompletedSteps}/2 Complete`;
        document.getElementById('lockr-progress-bar').style.width = `${lockrProgress}%`;

        // Check Work.ink key
        if (workinkCompletedSteps === 2) {
            const keyData = JSON.parse(localStorage.getItem(`kg_key_workink_${deviceId}`) || 'null');
            
            if (keyData && keyData.expiryTime > now) {
                document.getElementById('workink-action').classList.add('hidden');
                document.getElementById('workink-key-display').classList.remove('hidden');
                document.getElementById('workink-dashboard-key').textContent = keyData.key;
                updateDashboardCountdown(keyData.expiryTime, 'workink-dashboard-countdown');
            } else {
                document.getElementById('workink-action').classList.remove('hidden');
                document.getElementById('workink-key-display').classList.add('hidden');
            }
        } else {
            document.getElementById('workink-action').classList.remove('hidden');
            document.getElementById('workink-key-display').classList.add('hidden');
        }

        // Check Lockr key
        if (lockrCompletedSteps === 2) {
            const keyData = JSON.parse(localStorage.getItem(`kg_key_lockr_${deviceId}`) || 'null');
            
            if (keyData && keyData.expiryTime > now) {
                document.getElementById('lockr-action').classList.add('hidden');
                document.getElementById('lockr-key-display').classList.remove('hidden');
                document.getElementById('lockr-dashboard-key').textContent = keyData.key;
                updateDashboardCountdown(keyData.expiryTime, 'lockr-dashboard-countdown');
            } else {
                document.getElementById('lockr-action').classList.remove('hidden');
                document.getElementById('lockr-key-display').classList.add('hidden');
            }
        } else {
            document.getElementById('lockr-action').classList.remove('hidden');
            document.getElementById('lockr-key-display').classList.add('hidden');
        }
    }

    // Update countdown timers
    function updateDashboardCountdown(expiryTime, countdownId) {
        const now = Date.now();
        const remaining = expiryTime - now;

        if (remaining <= 0) {
            document.getElementById(countdownId).textContent = '00:00:00';
            return;
        }

        const hours = Math.floor(remaining / 3600000);
        const minutes = Math.floor((remaining % 3600000) / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        
        document.getElementById(countdownId).textContent = 
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    // Copy key functionality
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('copy-key-btn') || e.target.closest('.copy-key-btn')) {
            const btn = e.target.classList.contains('copy-key-btn') ? e.target : e.target.closest('.copy-key-btn');
            const keyId = btn.getAttribute('data-key-id');
            const keyElement = document.getElementById(keyId);
            const keyText = keyElement.textContent;

            navigator.clipboard.writeText(keyText).then(() => {
                const originalText = btn.textContent;
                btn.textContent = '✓ Copied!';
                
                if (window.notify) {
                    notify.success('Key copied to clipboard!', 2000);
                }

                setTimeout(() => {
                    btn.textContent = originalText;
                }, 2000);
            });
        }
    });

    // Tab switching for admin
    window.switchTab = function(tabName) {
        if (!isAdmin) return;

        // Update buttons
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active', 'text-blue-400');
            btn.classList.add('text-zinc-400');
        });
        event.target.classList.remove('text-zinc-400');
        event.target.classList.add('active', 'text-blue-400');

        // Hide all panes
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.add('hidden');
        });

        // Show selected pane
        const pane = document.querySelector(`[data-tab-pane="${tabName}"]`);
        if (pane) {
            pane.classList.remove('hidden');
        }
    };

    // Initialize
    initializeCheckpoints();

    // Auto-refresh progress every 2 seconds
    setInterval(() => {
        updateProgress();
        if (isAdmin) {
            updateAdminStats();
        }
    }, 2000);

    console.log(' Admin Stats System loaded');
    if (isAdmin) {
        console.log(' Admin features are visible');
    } else {
        console.log(' User mode - admin features hidden');
    }
})();
