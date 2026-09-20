// Mock Data (Real website me ye data backend API se aayega)
const services = [
    { id: 1, name: "WhatsApp", country: "Vietnam", price: 23.13, icon: "fa-brands fa-whatsapp" },
    { id: 2, name: "Telegram", country: "India", price: 15.50, icon: "fa-brands fa-telegram" },
    { id: 3, name: "Facebook", country: "USA", price: 30.00, icon: "fa-brands fa-facebook" },
    { id: 4, name: "Instagram", country: "UK", price: 25.00, icon: "fa-brands fa-instagram" }
];

let userBalance = 75.48;

// Function to render services
function renderServices(filteredServices) {
    const list = document.getElementById('servicesList');
    list.innerHTML = '';

    if (filteredServices.length === 0) {
        list.innerHTML = '<p style="text-align:center; color:#777;">No services found.</p>';
        return;
    }

    filteredServices.forEach(service => {
        const div = document.createElement('div');
        div.className = 'service-item';
        div.innerHTML = `
            <div class="service-info">
                <i class="${service.icon}" style="color:#5a47e9;"></i>
                <div>
                    <h4>${service.name}</h4>
                    <p>${service.country}</p>
                </div>
            </div>
            <div class="service-price">
                <span>₹${service.price.toFixed(2)}</span>
                <button class="buy-btn" onclick="buyOTP(${service.id})">Buy</button>
            </div>
        `;
        list.appendChild(div);
    });
}

// Search Functionality
document.getElementById('searchInput').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = services.filter(s => 
        s.name.toLowerCase().includes(query) || 
        s.country.toLowerCase().includes(query)
    );
    renderServices(filtered);
});

// Buy OTP Function
function buyOTP(serviceId) {
    const service = services.find(s => s.id === serviceId);
    
    if (userBalance >= service.price) {
        // Yahan API call karni hai backend par jane ke liye
        // fetch('/api/buy-otp', { method: 'POST', body: JSON.stringify({ serviceId }) })
        
        userBalance -= service.price;
        document.getElementById('userBalance').innerText = userBalance.toFixed(2);
        alert(`Success! OTP ordered for ${service.name}. Balance deducted: ₹${service.price}`);
    } else {
        alert("Insufficient Balance! Please add funds.");
    }
}

// Initial Load
renderServices(services);