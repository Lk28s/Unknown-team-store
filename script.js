// Carrinho de compras
let cart = [];
const cartBtn = document.querySelector('.cart-btn');
const cartModal = document.querySelector('.cart-modal');
const closeCart = document.querySelector('.close-cart');
const overlay = document.querySelector('.overlay');
const cartItems = document.querySelector('.cart-items');
const cartCount = document.querySelector('.cart-count');
const totalPrice = document.querySelector('.total-price');
const checkoutBtn = document.querySelector('.checkout-btn');

// WhatsApp number
const WHATSAPP_NUMBER = '5511960140371';

// Abrir carrinho
cartBtn.addEventListener('click', () => {
    cartModal.classList.add('open');
    overlay.classList.add('open');
});

// Fechar carrinho
closeCart.addEventListener('click', () => {
    cartModal.classList.remove('open');
    overlay.classList.remove('open');
});

overlay.addEventListener('click', () => {
    cartModal.classList.remove('open');
    overlay.classList.remove('open');
});

// Adicionar produtos ao carrinho
document.querySelectorAll('.btn-buy').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Efeito visual de clique
        this.style.transform = 'scale(0.95)';
        this.style.backgroundColor = '#6A1CB8';
        
        setTimeout(() => {
            this.style.transform = '';
            this.style.backgroundColor = '';
            
            // Adicionar produto ao carrinho
            const id = this.dataset.id;
            const name = this.dataset.name;
            const price = parseFloat(this.dataset.price);
            
            addToCart(id, name, price);
        }, 200);
    });
});

// Função para adicionar item ao carrinho
function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id,
            name,
            price,
            quantity: 1
        });
    }
    
    updateCart();
    
    // Mostrar mensagem de sucesso
    alert(`${name} adicionado ao carrinho!`);
}

// Função para remover item do carrinho
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

// Atualizar carrinho
function updateCart() {
    // Atualizar contador
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Atualizar itens
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Seu carrinho está vazio</p>';
    } else {
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <div class="item-info">
                    <div class="item-name">${item.name}</div>
                    <div class="item-price">R$ ${item.price.toFixed(2)} x ${item.quantity}</div>
                </div>
                <button class="remove-item" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            cartItems.appendChild(cartItem);
        });
        
        // Adicionar event listeners aos botões de remover
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.dataset.id;
                removeFromCart(id);
            });
        });
    }
    
    // Atualizar total
    const total = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    totalPrice.textContent = `R$ ${total.toFixed(2)}`;
}

// Finalizar compra
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    
    // Criar mensagem para WhatsApp
    let message = 'Olá! Gostaria de comprar os seguintes produtos:\n\n';
    
    cart.forEach(item => {
        message += `- ${item.name} (Quantidade: ${item.quantity})\n`;
    });
    
    message += `\nTotal: R$ ${cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}`;
    message += '\n\nPor favor, entre em contato para finalizar a compra.';
    
    // Codificar mensagem para URL
    const encodedMessage = encodeURIComponent(message);
    
    // Criar link do WhatsApp
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    // Abrir WhatsApp
    window.open(whatsappURL, '_blank');
});

// Inicializar carrinho
updateCart();

// Adicionar efeitos de interação às categorias
document.querySelectorAll('.category').forEach(category => {
    category.addEventListener('click', function() {
        // Remover seleção anterior
        document.querySelectorAll('.category').forEach(cat => {
            cat.style.backgroundColor = '';
        });
        
        // Destacar categoria selecionada
        this.style.backgroundColor = '#FF5722';
        
        // Scroll para produtos correspondentes (simulação)
        const platform = this.textContent.trim();
        alert(`Mostrando produtos para ${platform}`);
    });
});