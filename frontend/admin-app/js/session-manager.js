// Admin Session Management
class AdminSessionManager {
    constructor() {
        this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
        this.warningTime = 5 * 60 * 1000; // 5 minutes before timeout
        this.timeoutId = null;
        this.warningId = null;
        this.lastActivity = Date.now();
        
        this.init();
    }
    
    init() {
        // Track user activity
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
        events.forEach(event => {
            document.addEventListener(event, () => this.resetTimer(), true);
        });
        
        this.resetTimer();
        this.checkSession();
    }
    
    resetTimer() {
        this.lastActivity = Date.now();
        
        if (this.timeoutId) clearTimeout(this.timeoutId);
        if (this.warningId) clearTimeout(this.warningId);
        
        this.warningId = setTimeout(() => this.showWarning(), this.sessionTimeout - this.warningTime);
        this.timeoutId = setTimeout(() => this.logout(), this.sessionTimeout);
    }
    
    showWarning() {
        const modal = document.createElement('div');
        modal.id = 'sessionWarning';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-sm mx-4">
                <h3 class="text-lg font-bold text-gray-100 mb-2">Session Expiring</h3>
                <p class="text-gray-300 mb-4">Your admin session will expire in 5 minutes due to inactivity.</p>
                <div class="flex gap-2">
                    <button id="extendSession" class="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Stay Logged In
                    </button>
                    <button id="logoutNow" class="flex-1 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                        Logout
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        document.getElementById('extendSession').onclick = () => {
            this.resetTimer();
            document.body.removeChild(modal);
        };
        
        document.getElementById('logoutNow').onclick = () => {
            this.logout();
        };
    }
    
    logout() {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminSession');
        
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-sm mx-4">
                <h3 class="text-lg font-bold text-gray-100 mb-2">Session Expired</h3>
                <p class="text-gray-300 mb-4">Your admin session has expired. Please login again.</p>
                <button onclick="window.location.href='/admin/login.html'" class="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Go to Login
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    checkSession() {
        const adminSession = localStorage.getItem('adminSession');
        if (!adminSession) {
            localStorage.setItem('adminSession', Date.now().toString());
        }
    }
}

// Initialize admin session manager
if (typeof window !== 'undefined') {
    window.adminSessionManager = new AdminSessionManager();
}