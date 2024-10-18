class ApiService {
    constructor() {
        this.baseURL = 'http://localhost:3000';
    }

    async get(endpoint) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error(`GET request to ${endpoint} failed:`, error);
            throw error; // Propagate the error for further handling
        }
    }

    async post(endpoint, data) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error('Failed to create resource');
            }
            return await response.json();
        } catch (error) {
            console.error(`POST request to ${endpoint} failed:`, error);
            throw error;
        }
    }

    async put(endpoint, data) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error('Failed to update resource');
            }
            return await response.json();
        } catch (error) {
            console.error(`PUT request to ${endpoint} failed:`, error);
            throw error;
        }
    }

    async delete(endpoint) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete resource');
            }
            return await response.json(); // Optionally return a success message
        } catch (error) {
            console.error(`DELETE request to ${endpoint} failed:`, error);
            throw error;
        }
    }
}

export default ApiService;
