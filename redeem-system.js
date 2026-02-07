// KeyGuardius Redeem & Credits System
// Simple, working version with SixSense-style UI

(function() {
    'use strict';

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        console.log('Redeem & Credits System loaded');
        setupRedeemButton();
        setupCreditsButton();
    }

    // Setup Redeem Key button click
    function setupRedeemButton() {
        const redeemBtn = document.getElementById('redeem-key-btn');
        if (redeemBtn) {
            redeemBtn.addEventListener('click', function(e) {
                e.preventDefault();
                openRedeemModal();
            });
            console.log('Redeem button connected');
        }
    }

    // Setup Credits Shop button
    function setupCreditsButton() {
        // Will be added to navbar
        const nav = document.querySelector('nav .flex.items-center.gap-6');
        if (!nav) return;

        // Check if already exists
        if (document.getElementById('credits-shop-btn')) return;

        const creditsBtn = document.createElement('a');
        creditsBtn.id = 'credits-shop-btn';
        creditsBtn.href = '#';
        creditsBtn.className = 'text-sm text-zinc-400 hover:text-yellow-400 transition-colors flex items-center gap-1.5';
        creditsBtn.innerHTML = `
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd"/>
            </svg>
            Credits Shop
        `;
        creditsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openCreditsShop();
        });

        const redeemBtn = nav.querySelector('#redeem-key-btn');
        if (redeemBtn) {
            redeemBtn.parentNode.insertBefore(creditsBtn, redeemBtn.nextSibling);
        }
    }

    // Open Redeem Modal (SixSense style)
    function openRedeemModal() {
        console.log('Opening redeem modal');
        
        // Remove existing modal
        const existing = document.getElementById('redeem-overlay');
        if (existing) {
            existing.remove();
            return;
        }

        const overlay = document.createElement('div');
        overlay.id = 'redeem-overlay';
        overlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(8px);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            animation: fadeIn 0.2s ease;
        `;

        overlay.innerHTML = `
            <style>
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            </style>
            <div style="
                max-width: 600px;
                width: 100%;
                background: #1a1d1f;
                border-radius: 16px;
                overflow: hidden;
                animation: slideUp 0.3s ease;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            ">
                <!-- Header -->
                <div style="
                    background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
                    padding: 24px;
                    position: relative;
                ">
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="
                                width: 40px;
                                height: 40px;
                                background: rgba(255, 255, 255, 0.2);
                                border-radius: 10px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            ">
                                <svg width="24" height="24" fill="none" stroke="white" stroke-width="2" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/>
                                </svg>
                            </div>
                            <h2 style="
                                color: white;
                                font-size: 24px;
                                font-weight: 700;
                                margin: 0;
                                font-family: 'DM Sans', sans-serif;
                            ">Redeem Key</h2>
                        </div>
                        <button id="close-redeem" style="
                            width: 32px;
                            height: 32px;
                            background: rgba(255, 255, 255, 0.2);
                            border: none;
                            border-radius: 8px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            cursor: pointer;
                            transition: background 0.2s;
                        " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                            <svg width="20" height="20" fill="none" stroke="white" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Content -->
                <div style="padding: 32px;">
                    <p style="
                        color: #9ca3af;
                        font-size: 14px;
                        margin: 0 0 24px 0;
                        font-family: 'DM Sans', sans-serif;
                    ">Have a key code? Enter it below to claim it to your account</p>

                    <!-- Input -->
                    <div style="position: relative; margin-bottom: 24px;">
                        <input 
                            type="text" 
                            id="redeem-input" 
                            placeholder="KG-XXXX-XXXX-XXXX"
                            style="
                                width: 100%;
                                padding: 16px 48px 16px 16px;
                                background: #0f1011;
                                border: 1px solid #2d3139;
                                border-radius: 10px;
                                color: white;
                                font-size: 14px;
                                font-family: 'Courier New', monospace;
                                text-transform: uppercase;
                                letter-spacing: 1px;
                                outline: none;
                                transition: all 0.2s;
                                box-sizing: border-box;
                            "
                            onfocus="this.style.borderColor='#16a34a'; this.style.boxShadow='0 0 0 3px rgba(22, 163, 74, 0.1)'"
                            onblur="this.style.borderColor='#2d3139'; this.style.boxShadow='none'"
                        />
                        <div style="
                            position: absolute;
                            right: 16px;
                            top: 50%;
                            transform: translateY(-50%);
                            pointer-events: none;
                        ">
                            <svg width="20" height="20" fill="none" stroke="#6b7280" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                            </svg>
                        </div>
                    </div>

                    <!-- Result message -->
                    <div id="redeem-result" style="display: none; margin-bottom: 20px;"></div>

                    <!-- Redeem Button -->
                    <button id="redeem-submit" style="
                        width: 100%;
                        padding: 14px;
                        background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
                        border: none;
                        border-radius: 10px;
                        color: white;
                        font-size: 15px;
                        font-weight: 600;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                        transition: all 0.2s;
                        font-family: 'DM Sans', sans-serif;
                    " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 20px rgba(22, 163, 74, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                        <svg width="18" height="18" fill="none" stroke="white" stroke-width="2.5" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        Redeem
                    </button>

                    <!-- Example keys -->
                    <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #2d3139;">
                        <p style="color: #6b7280; font-size: 12px; margin: 0 0 12px 0; font-family: 'DM Sans', sans-serif;">Example Keys (Testing):</p>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                            <code style="padding: 8px 12px; background: #0f1011; border: 1px solid #2d3139; border-radius: 6px; color: #9ca3af; font-size: 11px; font-family: 'Courier New', monospace; display: block; text-align: center;">KG-BETA-2026</code>
                            <code style="padding: 8px 12px; background: #0f1011; border: 1px solid #2d3139; border-radius: 6px; color: #9ca3af; font-size: 11px; font-family: 'Courier New', monospace; display: block; text-align: center;">KG-WELCOME-100</code>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Event listeners
        document.getElementById('close-redeem').addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });

        const input = document.getElementById('redeem-input');
        input.addEventListener('input', (e) => {
            e.target.value = e.target.value.toUpperCase();
        });

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                processRedeem();
            }
        });

        document.getElementById('redeem-submit').addEventListener('click', processRedeem);

        input.focus();
    }

    // Process redeem
    function processRedeem() {
        const input = document.getElementById('redeem-input');
        const code = input.value.trim();
        const resultDiv = document.getElementById('redeem-result');

        if (!code) {
            showResult('error', 'Please enter a key code');
            return;
        }

        // Predefined keys
        const keys = {
            'KG-BETA-2026': { points: 500, desc: 'Beta Tester Bonus' },
            'KG-WELCOME-100': { points: 100, desc: 'Welcome Gift' },
            'KG-PREMIUM-VIP': { unlock: 'vd_premium', desc: 'Premium Script Unlocked' },
            'KG-ULTIMATE-VIP': { unlock: 'vd_ultimate', desc: 'Ultimate Script Unlocked' }
        };

        if (!keys[code]) {
            showResult('error', 'Invalid key code. Please check and try again.');
            return;
        }

        const keyData = keys[code];

        // Check if already used
        const usedKeys = JSON.parse(localStorage.getItem('kg_used_redeem_keys') || '[]');
        if (usedKeys.includes(code)) {
            showResult('error', 'This key has already been redeemed.');
            return;
        }

        // Process reward
        if (keyData.points && window.RewardsSystem) {
            const userData = window.RewardsSystem.getUserData();
            window.RewardsSystem.addPoints(userData, keyData.points, keyData.desc);
            window.RewardsSystem.saveUserData(userData);
            window.RewardsSystem.updatePointsDisplay();
        }

        if (keyData.unlock && window.RewardsSystem) {
            const userData = window.RewardsSystem.getUserData();
            if (!userData.unlockedScripts.includes(keyData.unlock)) {
                userData.unlockedScripts.push(keyData.unlock);
                window.RewardsSystem.saveUserData(userData);
            }
        }

        // Mark as used
        usedKeys.push(code);
        localStorage.setItem('kg_used_redeem_keys', JSON.stringify(usedKeys));

        // Log activity
        if (window.RewardsSystem) {
            window.RewardsSystem.logActivity('redeemed key: ' + keyData.desc);
        }

        showResult('success', 'Key redeemed successfully! ' + keyData.desc);

        if (window.notify) {
            notify.success('Key redeemed: ' + keyData.desc);
        }

        input.disabled = true;
        document.getElementById('redeem-submit').disabled = true;

        setTimeout(() => {
            document.getElementById('redeem-overlay').remove();
        }, 2000);
    }

    function showResult(type, message) {
        const resultDiv = document.getElementById('redeem-result');
        resultDiv.style.display = 'block';

        const colors = {
            success: { bg: 'rgba(22, 163, 74, 0.1)', border: '#16a34a', text: '#4ade80' },
            error: { bg: 'rgba(239, 68, 68, 0.1)', border: '#dc2626', text: '#f87171' }
        };

        const style = colors[type];

        resultDiv.innerHTML = `
            <div style="
                background: ${style.bg};
                border: 1px solid ${style.border};
                border-radius: 8px;
                padding: 12px 16px;
                color: ${style.text};
                font-size: 13px;
                font-family: 'DM Sans', sans-serif;
                display: flex;
                align-items: center;
                gap: 10px;
            ">
                ${type === 'success' ? 
                    '<svg width="18" height="18" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>' :
                    '<svg width="18" height="18" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>'
                }
                <span>${message}</span>
            </div>
        `;
    }

    // Open Credits Shop
    function openCreditsShop() {
        console.log('Opening credits shop');
        
        const existing = document.getElementById('credits-overlay');
        if (existing) {
            existing.remove();
            return;
        }

        const overlay = document.createElement('div');
        overlay.id = 'credits-overlay';
        overlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(8px);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            animation: fadeIn 0.2s ease;
            overflow-y: auto;
        `;

        overlay.innerHTML = `
            <div style="
                max-width: 900px;
                width: 100%;
                background: #1a1d1f;
                border-radius: 16px;
                overflow: hidden;
                animation: slideUp 0.3s ease;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                margin: 40px 0;
            ">
                <!-- Header -->
                <div style="
                    background: linear-gradient(135deg, #eab308 0%, #ca8a04 100%);
                    padding: 24px;
                ">
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="
                                width: 40px;
                                height: 40px;
                                background: rgba(255, 255, 255, 0.2);
                                border-radius: 10px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            ">
                                <svg width="24" height="24" fill="white" viewBox="0 0 20 20">
                                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd"/>
                                </svg>
                            </div>
                            <h2 style="
                                color: white;
                                font-size: 24px;
                                font-weight: 700;
                                margin: 0;
                                font-family: 'DM Sans', sans-serif;
                            ">Credits Shop</h2>
                        </div>
                        <button id="close-credits" style="
                            width: 32px;
                            height: 32px;
                            background: rgba(255, 255, 255, 0.2);
                            border: none;
                            border-radius: 8px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            cursor: pointer;
                        " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                            <svg width="20" height="20" fill="none" stroke="white" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Content -->
                <div style="padding: 32px;">
                    <p style="color: #9ca3af; font-size: 14px; margin: 0 0 32px 0; font-family: 'DM Sans', sans-serif;">Purchase keys with different durations. Keys are generated instantly after payment.</p>

                    <!-- Pricing Grid -->
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 32px;">
                        ${generatePricingCards()}
                    </div>

                    <!-- Custom Duration -->
                    <div style="background: #0f1011; border: 1px solid #2d3139; border-radius: 12px; padding: 24px;">
                        <h3 style="color: white; font-size: 18px; font-weight: 600; margin: 0 0 16px 0; font-family: 'DM Sans', sans-serif;">Custom Duration</h3>
                        <div style="display: grid; grid-template-columns: 1fr 1fr auto; gap: 12px; align-items: end;">
                            <div>
                                <label style="display: block; color: #9ca3af; font-size: 12px; margin-bottom: 8px; font-family: 'DM Sans', sans-serif;">Duration (hours)</label>
                                <input type="number" id="custom-hours" min="1" max="720" value="24" style="
                                    width: 100%;
                                    padding: 12px;
                                    background: #1a1d1f;
                                    border: 1px solid #2d3139;
                                    border-radius: 8px;
                                    color: white;
                                    font-size: 14px;
                                    outline: none;
                                    box-sizing: border-box;
                                " onfocus="this.style.borderColor='#eab308'" onblur="this.style.borderColor='#2d3139'" oninput="updateCustomPrice()">
                            </div>
                            <div>
                                <label style="display: block; color: #9ca3af; font-size: 12px; margin-bottom: 8px; font-family: 'DM Sans', sans-serif;">Price</label>
                                <div style="
                                    width: 100%;
                                    padding: 12px;
                                    background: #1a1d1f;
                                    border: 1px solid #2d3139;
                                    border-radius: 8px;
                                    color: #eab308;
                                    font-size: 14px;
                                    font-weight: 600;
                                    font-family: 'DM Sans', sans-serif;
                                " id="custom-price">$2.00</div>
                            </div>
                            <button onclick="buyCustomKey()" style="
                                padding: 12px 24px;
                                background: linear-gradient(135deg, #eab308 0%, #ca8a04 100%);
                                border: none;
                                border-radius: 8px;
                                color: white;
                                font-size: 14px;
                                font-weight: 600;
                                cursor: pointer;
                                font-family: 'DM Sans', sans-serif;
                                white-space: nowrap;
                            " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">Purchase</button>
                        </div>
                        <p style="color: #6b7280; font-size: 11px; margin: 12px 0 0 0; font-family: 'DM Sans', sans-serif;">Formula: $2 per 24 hours (~$0.083/hour)</p>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        document.getElementById('close-credits').addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });

        // Make functions global for inline onclick
        window.updateCustomPrice = updateCustomPrice;
        window.buyCustomKey = buyCustomKey;
        window.buyKey = buyKey;
    }

    function generatePricingCards() {
        const plans = [
            { duration: '24h', hours: 24, price: 2 },
            { duration: '3 days', hours: 72, price: 6 },
            { duration: '1 week', hours: 168, price: 14 },
            { duration: '1 month', hours: 720, price: 60 }
        ];

        return plans.map(plan => `
            <div style="
                background: #0f1011;
                border: 1px solid #2d3139;
                border-radius: 12px;
                padding: 20px;
                transition: all 0.2s;
                cursor: pointer;
            " onmouseover="this.style.borderColor='#eab308'; this.style.transform='translateY(-4px)'" onmouseout="this.style.borderColor='#2d3139'; this.style.transform='translateY(0)'" onclick="buyKey(${plan.hours}, ${plan.price})">
                <div style="text-align: center;">
                    <div style="color: #eab308; font-size: 32px; font-weight: 700; margin-bottom: 8px; font-family: 'DM Sans', sans-serif;">$${plan.price}</div>
                    <div style="color: white; font-size: 18px; font-weight: 600; margin-bottom: 4px; font-family: 'DM Sans', sans-serif;">${plan.duration}</div>
                    <div style="color: #6b7280; font-size: 12px; font-family: 'DM Sans', sans-serif;">Key Duration</div>
                </div>
            </div>
        `).join('');
    }

    window.updateCustomPrice = function() {
        const hours = parseInt(document.getElementById('custom-hours').value) || 24;
        const pricePerDay = 2;
        const price = (hours / 24) * pricePerDay;
        document.getElementById('custom-price').textContent = '$' + price.toFixed(2);
    };

    window.buyKey = function(hours, price) {
        if (window.notify) {
            notify.info('Purchase system demo. In production, this would redirect to payment.');
        }
        alert(`Purchasing ${hours} hour key for $${price}\n\nIn production, this would:\n1. Redirect to payment gateway\n2. Generate key after payment\n3. Display or email the key to user`);
    };

    window.buyCustomKey = function() {
        const hours = parseInt(document.getElementById('custom-hours').value) || 24;
        const pricePerDay = 2;
        const price = (hours / 24) * pricePerDay;
        window.buyKey(hours, price.toFixed(2));
    };

})();
