import { useState, useEffect } from 'react';

export default function AdBlockerDetector() {
  const [isBlocked, setIsBlocked] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    detectAdBlocker();
  }, []);

  const detectAdBlocker = async () => {
    let detected = false;

    // Test 1: Try to load a fake ad element
    try {
      const adTest = document.createElement('div');
      adTest.className = 'ad ads advertisement banner-ad google-ad doubleclick';
      adTest.style.cssText = 'position:absolute;height:1px;width:1px;';
      document.body.appendChild(adTest);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const computed = window.getComputedStyle(adTest);
      if (computed.display === 'none' || 
          computed.visibility === 'hidden' || 
          adTest.offsetHeight === 0) {
        detected = true;
      }
      
      document.body.removeChild(adTest);
    } catch (e) {
      detected = true;
    }

    // Test 2: Check if common ad-blocker variables exist
    if (typeof window.canRunAds === 'undefined' || 
        window.canRunAds === false) {
      detected = true;
    }

    // Test 3: Test popup blocker
    try {
      const testPopup = window.open('', '_blank', 'width=1,height=1');
      if (!testPopup || testPopup.closed || typeof testPopup.closed === 'undefined') {
        detected = true;
      } else {
        testPopup.close();
      }
    } catch (e) {
      detected = true;
    }

    // Test 4: Check for common ad-blocker extensions
    const extensionTests = [
      'blockAdBlock',
      'adBlockDetected',
      'AdBlocker',
      'uBlock'
    ];

    extensionTests.forEach(prop => {
      if (window[prop]) {
        detected = true;
      }
    });

    // Test 5: Try to fetch a common ad script URL
    try {
      const response = await fetch('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js', {
        method: 'HEAD',
        mode: 'no-cors'
      });
    } catch (e) {
      detected = true;
    }

    setIsBlocked(detected);
    setIsChecking(false);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  if (isChecking) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000',
        color: '#fff',
        fontFamily: '"DM Sans", -apple-system, BlinkMacSystemFont, sans-serif'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '16px',
          fontWeight: 500,
          color: '#a3a3a3'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            border: '2px solid rgba(220, 38, 38, 0.3)',
            borderTopColor: '#dc2626',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}/>
          Checking for blockers...
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isBlocked) {
    return null;
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .blocked-overlay {
          position: fixed;
          inset: 0;
          background: #0a0a0a;
          z-index: 999999;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.3s ease-out;
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        /* Grain texture */
        .blocked-overlay::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.03;
          pointer-events: none;
        }

        /* Dot pattern */
        .blocked-overlay::after {
          content: '';
          position: fixed;
          inset: 0;
          background-image: radial-gradient(rgba(220, 38, 38, 0.15) 1px, transparent 1px);
          background-size: 20px 20px;
          pointer-events: none;
        }
        
        .blocked-content {
          position: relative;
          max-width: 560px;
          width: 90%;
          animation: slideUp 0.5s ease-out;
          z-index: 1;
        }
        
        .icon-container {
          width: 140px;
          height: 140px;
          margin: 0 auto 32px;
          animation: float 3s ease-in-out infinite;
          filter: drop-shadow(0 10px 30px rgba(220, 38, 38, 0.4));
        }
        
        .alert-box {
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(220, 38, 38, 0.3);
          border-radius: 20px;
          padding: 48px 40px;
          text-align: center;
          box-shadow: 
            0 20px 60px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.03);
          position: relative;
          overflow: hidden;
        }

        /* Subtle glow effect */
        .alert-box::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(220, 38, 38, 0.5), transparent);
        }
        
        .warning-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(220, 38, 38, 0.1);
          border: 1px solid rgba(220, 38, 38, 0.3);
          padding: 8px 18px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 700;
          color: #dc2626;
          margin-bottom: 24px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .warning-pulse {
          width: 6px;
          height: 6px;
          background: #dc2626;
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
          box-shadow: 0 0 10px rgba(220, 38, 38, 0.8);
        }
        
        h1 {
          font-size: 36px;
          font-weight: 800;
          color: #fff;
          margin: 0 0 12px;
          line-height: 1.2;
          letter-spacing: -0.5px;
        }
        
        .subtitle {
          font-size: 16px;
          color: #a3a3a3;
          margin: 0 0 32px;
          font-weight: 400;
          line-height: 1.5;
        }
        
        .steps {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 14px;
          padding: 24px;
          margin-bottom: 32px;
          text-align: left;
        }
        
        .step {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 14px 0;
        }
        
        .step:not(:last-child) {
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }
        
        .step-number {
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 15px;
          color: #fff;
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
        }
        
        .step-text {
          flex: 1;
          color: #e5e5e5;
          font-size: 15px;
          line-height: 1.6;
          padding-top: 4px;
        }

        .step-text strong {
          color: #fff;
          font-weight: 600;
        }
        
        .refresh-button {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          color: #fff;
          font-size: 16px;
          font-weight: 700;
          padding: 16px 36px;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 
            0 10px 30px rgba(220, 38, 38, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }
        
        .refresh-button:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 15px 40px rgba(220, 38, 38, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }
        
        .refresh-button:active {
          transform: translateY(0);
        }

        .refresh-icon {
          animation: none;
        }

        .refresh-button:hover .refresh-icon {
          animation: spin 0.6s ease-in-out;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .footer-text {
          margin-top: 24px;
          font-size: 13px;
          color: #525252;
          font-weight: 400;
        }

        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          margin: 28px 0;
        }

        .info-box {
          background: rgba(220, 38, 38, 0.05);
          border: 1px solid rgba(220, 38, 38, 0.2);
          border-radius: 10px;
          padding: 16px;
          margin-bottom: 24px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          text-align: left;
        }

        .info-icon {
          flex-shrink: 0;
          width: 20px;
          height: 20px;
          color: #dc2626;
        }

        .info-text {
          flex: 1;
          font-size: 13px;
          color: #d4d4d4;
          line-height: 1.6;
        }
      `}</style>

      <div className="blocked-overlay">
        <div className="blocked-content">
          {/* Block Icon */}
          <div className="icon-container">
            <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Red circle background */}
              <circle cx="60" cy="60" r="56" fill="#dc2626"/>
              
              {/* White shield with X */}
              <g transform="translate(60, 60)">
                {/* Shield outline */}
                <path d="M 0 -28 L 20 -20 L 20 5 Q 20 15 12 22 Q 5 28 0 30 Q -5 28 -12 22 Q -20 15 -20 5 L -20 -20 Z" 
                      fill="#fff" 
                      stroke="#dc2626" 
                      strokeWidth="2"/>
                
                {/* X mark inside shield */}
                <line x1="-10" y1="-5" x2="10" y2="15" stroke="#dc2626" strokeWidth="3.5" strokeLinecap="round"/>
                <line x1="10" y1="-5" x2="-10" y2="15" stroke="#dc2626" strokeWidth="3.5" strokeLinecap="round"/>
              </g>
            </svg>
          </div>

          <div className="alert-box">
            <div className="warning-badge">
              <div className="warning-pulse"></div>
              ACCESS BLOCKED
            </div>
            
            <h1>Ad Blocker Detected</h1>
            <p className="subtitle">
              Please disable your ad blocker or popup blocker to continue accessing this site
            </p>

            <div className="info-box">
              <svg className="info-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              <div className="info-text">
                <strong>Why?</strong> This page requires popup functionality to work correctly. Ad blockers interfere with essential features.
              </div>
            </div>
            
            <div className="steps">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-text">
                  <strong>Disable</strong> your ad blocker or popup blocker extension
                </div>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-text">
                  <strong>Whitelist</strong> this website in your blocker settings
                </div>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-text">
                  <strong>Refresh</strong> the page to continue
                </div>
              </div>
            </div>
            
            <button onClick={handleRefresh} className="refresh-button">
              <svg className="refresh-icon" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/>
              </svg>
              Refresh Page
            </button>
            
            <p className="footer-text">
              Protected by KeyGuardius Security
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
