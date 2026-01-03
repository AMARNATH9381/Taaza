// Email API Client
class EmailAPI {
    constructor() {
        this.baseURL = '/api/v1/email';
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                const errorMessage = data.error || `HTTP error! status: ${response.status}`;
                throw new Error(errorMessage);
            }
            return data;
        } catch (error) {
            console.error('Email API request failed:', error);
            throw error;
        }
    }

    // Send notification email
    async sendStockNotification(to, customerName, phoneNumber, milkType, quantity, timeSlot) {
        const subject = `Milk Stock Available - ${milkType.charAt(0).toUpperCase() + milkType.slice(1)} Milk`;
        const templateData = {
            customer_name: customerName,
            phone_number: phoneNumber,
            milk_type: milkType.charAt(0).toUpperCase() + milkType.slice(1),
            quantity: quantity,
            time_slot: timeSlot.charAt(0).toUpperCase() + timeSlot.slice(1)
        };

        return this.request('/send', {
            method: 'POST',
            body: JSON.stringify({
                type: 'stock_available',
                to: to,
                subject: subject,
                template_name: 'stock-notification',
                data: templateData
            })
        });
    }
}

// Global instance
window.emailAPI = new EmailAPI();