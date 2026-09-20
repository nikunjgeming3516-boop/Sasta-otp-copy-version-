// ==========================================
// 1. MOCK DATA (Dummy Database)
// Real website me ye data backend API se aayega
// ==========================================

let users = [
    { id: "#USR-001", email: "john_doe@email.com", balance: 150.00, status: "Active" },
    { id: "#USR-002", email: "sarah_k@email.com", balance: 45.50, status: "Active" },
    { id: "#USR-003", email: "spam_user@email.com", balance: 0.00, status: "Blocked" },
    { id: "#USR-004", email: "mike_ross@email.com", balance: 500.00, status: "Active" }
];

let services = [
    { id: 1, name: "WhatsApp", icon: "fa-brands fa-whatsapp text-green-500", country: "Vietnam", buyPrice: 18.00, sellPrice: 23.13, status: "Active" },
    { id: 2, name: "Telegram", icon: "fa-brands fa-telegram text-blue-500", country: "India", buyPrice: 10.00, sellPrice: 15.50, status: "Active" },
    { id: 3, name: "Facebook", icon: "fa-brands fa-facebook text-blue-700", country: "USA", buyPrice: 22.00, sellPrice: 30.00, status: "Inactive" }
];

let apis = [
    { id: 1, name: "SMS-Activate", apiKey: "sk_live_••••••••••••", balance: 8450.00, status: "Connected" },
    { id: 2, name: "5SIM", apiKey: "5sim_••••••••••••", balance: 4000.00, status: "Connected" }
];

let orders = [
    { id: "#ORD-8921", user: "john_doe@email.com", service: "WhatsApp - Vietnam", otp: "482910", status: "Completed", date: "Just now" },
    { id: "#ORD-8920", user: "sarah_k@email.com", service: "Telegram - India", otp: "-", status: "Pending", date: "5 mins ago" },
    { id: "#ORD-8919", user: "mike_ross@email.com", service: "Facebook - USA", otp: "-", status: "Cancelled", date: "10 mins ago" }
];

// ==========================================
// 2. INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    renderDashboard();
    renderUsers();
    renderServices();
    renderAPIs();
    renderOrders();
    setupSearch();
});

// ==========================================
// 3. NAVIGATION & TAB SWITCHING
// ==========================================
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section-content').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show the selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) targetSection.classList.remove('hidden');

    // Update Active Link in Sidebar
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Find the clicked link and add active class (handled by onclick inline, but just in case)
    const activeLink = Array.from(document.querySelectorAll('.sidebar-link')).find(link => 
        link.getAttribute('onclick')?.includes(sectionId)
    );
    if (activeLink) activeLink.classList.add('active');

    // Update Page Title
    const titles = {
        'dashboard': 'Dashboard Overview',
        'users': 'User Management',
        'services': 'Services & Pricing',
        'apis': 'API Providers',
        'orders': 'Order History',
        'settings': 'Website Settings'
    };
    document.getElementById('pageTitle').innerText = titles[sectionId] || 'Dashboard';
}

// ==========================================
// 4. RENDER FUNCTIONS (Dynamic Data Loading)
// ==========================================

// --- Dashboard Stats & Recent Orders ---
function renderDashboard() {
    // Update Stats
    const totalUsersEl = document.querySelector('#dashboard .border-indigo-500 h3');
    const totalRevenueEl = document.querySelector('#dashboard .border-green-500 h3');
    const totalOrdersEl = document.querySelector('#dashboard .border-purple-500 h3');
    
    if(totalUsersEl) totalUsersEl.innerText = users.length.toLocaleString();
    if(totalOrdersEl) totalOrdersEl.innerText = orders.length.toLocaleString();
    
    // Calculate Total Revenue (Mock)
    let revenue = orders.filter(o => o.status === 'Completed').length * 25; // Assuming avg ₹25 per order
    if(totalRevenueEl) totalRevenueEl.innerText = `₹${revenue.toLocaleString()}`;

    // Render Recent Orders on Dashboard
    const tbody = document.querySelector('#dashboard table tbody');
    if (tbody) {
        tbody.innerHTML = orders.slice(0, 3).map(order => `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 font-medium">${order.id}</td>
                <td class="px-6 py-4">${order.user}</td>
                <td class="px-6 py-4">${order.service}</td>
                <td class="px-6 py-4">₹${(Math.random() * 20 + 10).toFixed(2)}</td>
                <td class="px-6 py-4">
                    <span class="${getStatusBadge(order.status)}">${order.status}</span>
                </td>
                <td class="px-6 py-4 text-gray-500">${order.date}</td>
            </tr>
        `).join('');
    }
}

// --- Render Users Table ---
function renderUsers() {
    // Find the tbody in the Users section
    const tbody = document.querySelector('#users table tbody');
    if (!tbody) return;

    if (users.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-gray-500">No users found.</td></tr>`;
        return;
    }

    tbody.innerHTML = users.map(user => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 font-medium">${user.id}</td>
            <td class="px-6 py-4">${user.email}</td>
            <td class="px-6 py-4 font-bold ${user.balance > 0 ? 'text-green-600' : 'text-gray-500'}">₹${user.balance.toFixed(2)}</td>
            <td class="px-6 py-4">
                <span class="${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} px-2 py-1 rounded text-xs font-medium">
                    ${user.status}
                </span>
            </td>
            <td class="px-6 py-4">
                <button onclick="addBalance('${user.id}')" class="text-indigo-600 hover:text-indigo-900 mr-3" title="Add Balance">
                    <i class="fa-solid fa-plus-circle"></i>
                </button>
                <button onclick="toggleBlock('${user.id}')" class="${user.status === 'Active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}" title="${user.status === 'Active' ? 'Block User' : 'Unblock User'}">
                    <i class="fa-solid ${user.status === 'Active' ? 'fa-ban' : 'fa-check-circle'}"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// --- Render Services Table ---
function renderServices() {
    const tbody = document.querySelector('#services table tbody');
    if (!tbody) return;

    tbody.innerHTML = services.map(service => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 font-medium"><i class="${service.icon} mr-2"></i> ${service.name}</td>
            <td class="px-6 py-4">${service.country}</td>
            <td class="px-6 py-4 text-gray-500">₹${service.buyPrice.toFixed(2)}</td>
            <td class="px-6 py-4 font-bold text-indigo-600">₹${service.sellPrice.toFixed(2)}</td>
            <td class="px-6 py-4">
                <span class="${service.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} px-2 py-1 rounded text-xs font-medium">
                    ${service.status}
                </span>
            </td>
            <td class="px-6 py-4">
                <button onclick="editService(${service.id})" class="text-indigo-600 hover:text-indigo-900 mr-3"><i class="fa-solid fa-pen-to-square"></i></button>
                <button onclick="deleteService(${service.id})" class="text-red-600 hover:text-red-900"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

// --- Render API Providers ---
function renderAPIs() {
    const container = document.querySelector('#apis .grid');
    if (!container) return;

    container.innerHTML = apis.map(api => `
        <div class="border rounded-lg p-4 bg-gray-50">
            <div class="flex justify-between items-start mb-2">
                <h3 class="font-bold text-gray-800">${api.name}</h3>
                <span class="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">${api.status}</span>
            </div>
            <p class="text-sm text-gray-500 mb-1">API Key: <span class="font-mono text-gray-800">${api.apiKey}</span></p>
            <p class="text-sm text-gray-500 mb-3">Balance: <span class="font-bold ${api.balance > 5000 ? 'text-green-600' : 'text-orange-600'}">₹${api.balance.toFixed(2)}</span></p>
            <div class="flex gap-2">
                <button onclick="editAPI(${api.id})" class="bg-white border text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-100">Edit</button>
                <button onclick="disconnectAPI(${api.id})" class="bg-white border text-red-600 px-3 py-1 rounded text-sm hover:bg-red-50">Disconnect</button>
            </div>
        </div>
    `).join('');
}

// --- Render All Orders Table ---
function renderOrders() {
    const tbody = document.querySelector('#orders table tbody');
    if (!tbody) return;

    tbody.innerHTML = orders.map(order => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 font-medium">${order.id}</td>
            <td class="px-6 py-4">${order.user}</td>
            <td class="px-6 py-4">${order.service}</td>
            <td class="px-6 py-4 font-mono font-bold ${order.otp !== '-' ? 'text-indigo-600' : 'text-gray-400'}">${order.otp}</td>
            <td class="px-6 py-4">
                <span class="${getStatusBadge(order.status)}">${order.status}</span>
            </td>
            <td class="px-6 py-4 text-gray-500">${order.date}</td>
        </tr>
    `).join('');
}

// ==========================================
// 5. ACTION HANDLERS (Mock Functions)
// ==========================================

// --- User Actions ---
function addBalance(userId) {
    const amount = prompt(`Enter amount to add for ${userId}:`);
    if (amount && !isNaN(amount)) {
        const user = users.find(u => u.id === userId);
        if (user) {
            user.balance += parseFloat(amount);
            renderUsers();
            renderDashboard();
            alert(`Success! ₹${amount} added to ${user.email}. New Balance: ₹${user.balance.toFixed(2)}`);
        }
    }
}

function toggleBlock(userId) {
    const user = users.find(u => u.id === userId);
    if (user) {
        user.status = user.status === 'Active' ? 'Blocked' : 'Active';
        renderUsers();
        alert(`User ${user.email} is now ${user.status}.`);
    }
}

// --- Service Actions ---
function editService(serviceId) {
    const service = services.find(s => s.id === serviceId);
    if (service) {
        const newPrice = prompt(`Enter new Sell Price for ${service.name} (Current: ₹${service.sellPrice}):`, service.sellPrice);
        if (newPrice && !isNaN(newPrice)) {
            service.sellPrice = parseFloat(newPrice);
            renderServices();
            alert(`${service.name} price updated successfully!`);
        }
    }
}

function deleteService(serviceId) {
    if (confirm("Are you sure you want to delete this service?")) {
        services = services.filter(s => s.id !== serviceId);
        renderServices();
        alert("Service deleted.");
    }
}

// --- API Actions ---
function editAPI(apiId) {
    const api = apis.find(a => a.id === apiId);
    if (api) {
        const newKey = prompt(`Enter new API Key for ${api.name}:`, api.apiKey);
        if (newKey) {
            api.apiKey = newKey;
            renderAPIs();
            alert(`${api.name} API key updated!`);
        }
    }
}

function disconnectAPI(apiId) {
    if (confirm("Are you sure you want to disconnect this API provider?")) {
        apis = apis.filter(a => a.id !== apiId);
        renderAPIs();
        alert("API Provider disconnected.");
    }
}

// ==========================================
// 6. SEARCH FUNCTIONALITY
// ==========================================
function setupSearch() {
    const searchInput = document.querySelector('header input[type="text"]');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        
        // Determine which section is currently active
        const activeSection = document.querySelector('.section-content:not(.hidden)').id;

        if (activeSection === 'users') {
            const filtered = users.filter(u => u.email.toLowerCase().includes(query) || u.id.toLowerCase().includes(query));
            renderFilteredUsers(filtered);
        } else if (activeSection === 'services') {
            const filtered = services.filter(s => s.name.toLowerCase().includes(query) || s.country.toLowerCase().includes(query));
            renderFilteredServices(filtered);
        } else if (activeSection === 'orders') {
            const filtered = orders.filter(o => o.id.toLowerCase().includes(query) || o.user.toLowerCase().includes(query) || o.service.toLowerCase().includes(query));
            renderFilteredOrders(filtered);
        }
    });
}

// Helper renders for search
function renderFilteredUsers(filteredUsers) {
    const tbody = document.querySelector('#users table tbody');
    if(filteredUsers.length === 0) { tbody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-gray-500">No users found.</td></tr>`; return; }
    // (Reuse render logic with filtered array)
    tbody.innerHTML = filteredUsers.map(user => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 font-medium">${user.id}</td>
            <td class="px-6 py-4">${user.email}</td>
            <td class="px-6 py-4 font-bold ${user.balance > 0 ? 'text-green-600' : 'text-gray-500'}">₹${user.balance.toFixed(2)}</td>
            <td class="px-6 py-4"><span class="${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} px-2 py-1 rounded text-xs font-medium">${user.status}</span></td>
            <td class="px-6 py-4">
                <button onclick="addBalance('${user.id}')" class="text-indigo-600 hover:text-indigo-900 mr-3"><i class="fa-solid fa-plus-circle"></i></button>
                <button onclick="toggleBlock('${user.id}')" class="${user.status === 'Active' ? 'text-red-600' : 'text-green-600'}"><i class="fa-solid ${user.status === 'Active' ? 'fa-ban' : 'fa-check-circle'}"></i></button>
            </td>
        </tr>
    `).join('');
}

function renderFilteredServices(filteredServices) {
    const tbody = document.querySelector('#services table tbody');
    if(filteredServices.length === 0) { tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-gray-500">No services found.</td></tr>`; return; }
    tbody.innerHTML = filteredServices.map(service => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 font-medium"><i class="${service.icon} mr-2"></i> ${service.name}</td>
            <td class="px-6 py-4">${service.country}</td>
            <td class="px-6 py-4 text-gray-500">₹${service.buyPrice.toFixed(2)}</td>
            <td class="px-6 py-4 font-bold text-indigo-600">₹${service.sellPrice.toFixed(2)}</td>
            <td class="px-6 py-4"><span class="${service.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} px-2 py-1 rounded text-xs font-medium">${service.status}</span></td>
            <td class="px-6 py-4">
                <button onclick="editService(${service.id})" class="text-indigo-600 hover:text-indigo-900 mr-3"><i class="fa-solid fa-pen-to-square"></i></button>
                <button onclick="deleteService(${service.id})" class="text-red-600 hover:text-red-900"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function renderFilteredOrders(filteredOrders) {
    const tbody = document.querySelector('#orders table tbody');
    if(filteredOrders.length === 0) { tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-gray-500">No orders found.</td></tr>`; return; }
    tbody.innerHTML = filteredOrders.map(order => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 font-medium">${order.id}</td>
            <td class="px-6 py-4">${order.user}</td>
            <td class="px-6 py-4">${order.service}</td>
            <td class="px-6 py-4 font-mono font-bold ${order.otp !== '-' ? 'text-indigo-600' : 'text-gray-400'}">${order.otp}</td>
            <td class="px-6 py-4"><span class="${getStatusBadge(order.status)}">${order.status}</span></td>
            <td class="px-6 py-4 text-gray-500">${order.date}</td>
        </tr>
    `).join('');
}

// Helper function for status badge colors
function getStatusBadge(status) {
    switch(status) {
        case 'Completed': return 'bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium';
        case 'Pending': return 'bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-medium';
        case 'Cancelled': return 'bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium';
        default: return 'bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium';
    }
}