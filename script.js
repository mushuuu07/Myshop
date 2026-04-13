// Splash auto redirect
setTimeout(() => {
    showPage('homePage');
}, 10);

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.style.display = 'none';
    });
    document.getElementById(pageId).style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

const categoryImages = {
    'Phone': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=500&q=80',
    'Headphones': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80',
    'Watch': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80',
    'Laptop': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=500&q=80',
    'Camera': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=500&q=80'
};

const productNames = ['Elite', 'Pro Max', 'Air', 'Core', 'Infinity'];
const types = ['Phone', 'Headphones', 'Watch', 'Laptop', 'Camera'];

const products = Array.from({ length: 24 }, (_, i) => {
    const type = types[i % types.length];
    return {
        id: i + 1,
        name: `${productNames[i % productNames.length]} ${type} V${i + 1}`,
        price: 2000 + (i * 1500),
        img: categoryImages[type],
        desc: `The ${type} reimagined. This ShopCart exclusive features premium materials, optimized battery performance, and a sleek curved aesthetic designed to fit your lifestyle.`
    };
});

let user = JSON.parse(localStorage.getItem('sc_user')) || null;
let cart = [];

// ==================== API BASE URL (Important for Local + Online) ====================
const API_BASE = '';   // Empty = relative path (works perfectly on Vercel)                      // Empty = relative URL (works on Vercel/Render/Netlify when backend is on same domain)

// =================================================================================

function handleAccountNav() {
    if (!user) {
        const email = prompt("Enter email to sign in to ShopCart:");
        if (email) {
            user = { email, name: email.split('@')[0], addresses: [] };
            save(); 
            updateHeader();
        }
    } else {
        document.getElementById('p-email').innerText = user.email;
        document.getElementById('p-name-input').value = user.name || '';
        renderSavedAddresses();
        showPage('profilePage');
    }
}

function updateName() { 
    user.name = document.getElementById('p-name-input').value; 
    save(); 
    updateHeader(); 
    alert("Name saved!"); 
}

function logoutUser() {
    localStorage.removeItem('sc_user');
    user = null;
    document.getElementById('user-display').innerText = "Hello, Sign in";
    showPage('homePage');
    alert("You have been logged out.");
}

function save() { 
    localStorage.setItem('sc_user', JSON.stringify(user)); 
}

function updateHeader() { 
    document.getElementById('user-display').innerText = user ? `Hello, ${user.name || user.email}` : "Hello, Sign in"; 
}

function init() {
    const grid = document.getElementById('main-grid');
    grid.innerHTML = ''; // Clear first to avoid duplicates
    products.forEach(p => {
        grid.innerHTML += `
            <div class="p-card" onclick="viewProduct(${p.id})">
                <img src="${p.img}">
                <h4>${p.name}</h4>
                <p class="price-tag">₹${p.price.toLocaleString()}</p>
                <button class="btn btn-yellow" style="margin-top:15px; padding:8px;">View Item</button>
            </div>`;
    });
    updateHeader();
}

function viewProduct(id) {
    const p = products.find(x => x.id === id);
    document.getElementById('desc-content').innerHTML = `
        <div class="desc-img"><img src="${p.img}"></div>
        <div>
            <h1 style="font-size:36px;">${p.name}</h1>
            <p style="color:var(--sc-orange); font-size:28px; font-weight:bold; margin:15px 0;">₹${p.price.toLocaleString()}</p>
            <p style="line-height:1.8; color:#555;">${p.desc}</p><br>
            <button class="btn btn-yellow" onclick="addToCart(${p.id})">Add to Cart</button>
            <button class="btn btn-orange" style="margin-top:10px;" onclick="buyNow(${p.id})">Buy Now</button>
        </div>`;
    showPage('descPage');
}

function addToCart(id) {
    if (!user) return alert("Please sign in!");
    cart.push(products.find(x => x.id === id));
    document.getElementById('cart-count').innerText = cart.length;
    alert("Added to Cart!");
}

function buyNow(id) {
    if (!user) return alert("Please sign in!");
    cart = [products.find(x => x.id === id)];
    goToCheckout();
}

function goToCheckout() {
    if (!user) return alert("Sign in first!");
    if (!cart.length) return alert("Cart empty!");
    document.getElementById('sidebar').classList.remove('open');
    showPage('addressPage');
}

function goToPayment() {
    const street = document.getElementById('addr-street').value;
    if (!street) return alert("Fill address!");
    showPage('paymentPage');
}

async function submitToMongo() {
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const phone = document.getElementById('reg-phone').value.trim();

    if (!name || !email || !phone) {
        alert("Please fill all fields!");
        return;
    }

    const userData = { name, email, phone };

    try {
        const response = await fetch(`${API_BASE}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            alert("Account Created Successfully!");
            localStorage.setItem('sc_user', JSON.stringify(userData));
            user = userData;
            updateHeader();
            showPage('homePage');
        } else {
            alert("Registration failed. Try again.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Could not connect to the server.\nIs your backend (node server.js) running?");
    }
}

async function saveAddressToMongo() {
    const addressData = {
        fullName: document.getElementById('addr-name').value.trim(),
        phone: document.getElementById('addr-phone').value.trim(),
        street: document.getElementById('addr-street').value.trim(),
        city: document.getElementById('addr-city').value.trim(),
        state: document.getElementById('addr-state').value.trim(),
        pincode: document.getElementById('addr-pin').value.trim()
    };

    if (!addressData.fullName || !addressData.street) {
        alert("Please fill in the required address fields.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/save-address`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(addressData)
        });

        if (response.ok) {
            alert("Delivery address saved!");
            showPage('paymentPage');
        } else {
            alert("Failed to save address.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Could not save address. Is the server running?");
    }
}

let selectedMethod = 'card';

function showMethod(method) {
    selectedMethod = method;
    document.querySelectorAll('.payment-method').forEach(div => div.style.display = 'none');
    document.querySelectorAll('.method-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(`${method}-form`).style.display = 'block';
    event.target.classList.add('active');
}

async function savePaymentToMongo() {
    const paymentData = { 
        method: selectedMethod, 
        details: {} 
    };

    if (selectedMethod === 'card') {
        paymentData.details = {
            cardName: document.getElementById('card-name').value,
            cardNumber: document.getElementById('card-number').value,
            expiryDate: document.getElementById('card-expiry').value,
            cvv: document.getElementById('card-cvv').value
        };
    } else if (selectedMethod === 'upi') {
        paymentData.details = { upiId: document.getElementById('upi-id').value };
    } else {
        paymentData.details = { type: 'Cash on Delivery' };
    }

    try {
        const response = await fetch(`${API_BASE}/save-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paymentData)
        });

        if (response.ok) {
            alert("Order Placed Successfully!");
            finalOrder();
        } else {
            alert("Failed to save order.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Server error. Check your connection.");
    }
}

function finalOrder() {
    alert("Payment Successful! Order Placed 🎉");
    cart = [];
    document.getElementById('cart-count').innerText = "0";
    showPage('homePage');
}

function renderSavedAddresses() {
    const box = document.getElementById('address-history');
    box.innerHTML = user.addresses && user.addresses.length 
        ? '' 
        : 'No addresses saved.';
    (user.addresses || []).forEach(a => {
        box.innerHTML += `<div style="padding:15px; background:#f9f9f9; border-radius:12px; margin-bottom:10px; border:1px solid #eee;">${a}</div>`;
    });
}

function openCart() {
    const list = document.getElementById('cart-list');
    list.innerHTML = ''; 
    let sum = 0;
    cart.forEach(it => { 
        sum += it.price; 
        list.innerHTML += `<div style="padding:10px; border-bottom:1px solid #eee; margin-bottom:10px;"><b>${it.name}</b><br>₹${it.price}</div>`; 
    });
    document.getElementById('cart-total-text').innerText = "Total: ₹" + sum.toLocaleString();
    document.getElementById('sidebar').classList.add('open');
}

init();