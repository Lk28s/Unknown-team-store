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
const toast = document.getElementById('toast');

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
        this.style.background = 'linear-gradient(90deg, var(--primary-dark), var(--primary-color))';
        
        setTimeout(() => {
            this.style.transform = '';
            this.style.background = 'linear-gradient(90deg, var(--primary-color), var(--primary-dark))';
            
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
    
    // Mostrar toast de sucesso
    showToast(`${name} adicionado ao carrinho!`);
}

// Função para remover item do carrinho
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
    showToast('Produto removido do carrinho!');
}

// Atualizar carrinho
function updateCart() {
    // Atualizar contador
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Animar o contador
    cartCount.style.animation = 'none';
    setTimeout(() => {
        cartCount.style.animation = 'bounce 1s infinite alternate';
    }, 10);
    
    // Atualizar itens
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart" style="text-align: center; padding: 20px; color: var(--text-secondary);">Seu carrinho está vazio</p>';
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

// Mostrar toast de notificação
function showToast(message) {
    const toastMessage = toast.querySelector('.toast-message');
    toastMessage.textContent = message;
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Finalizar compra
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        showToast('Seu carrinho está vazio!');
        return;
    }
    
    // Criar mensagem para WhatsApp
    let message = 'Olá! Gostaria de comprar os seguintes produtos:\n\n';
    
    cart.forEach(item => {
        message += `- ${item.name} (Quantidade: ${item.quantity})\n`;
    });
    
    const total = cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    message += `\nTotal: R$ ${total}`;
    message += '\n\nPor favor, entre em contato para finalizar a compra.';
    
    // Registrar log da compra
    logPurchase(cart, total);
    
    // Codificar mensagem para URL
    const encodedMessage = encodeURIComponent(message);
    
    // Criar link do WhatsApp
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    // Abrir WhatsApp
    window.open(whatsappURL, '_blank');
    
    // Limpar carrinho após finalizar compra
    cart = [];
    updateCart();
    showToast('Compra finalizada! Entraremos em contato em breve.');
});

// Função para registrar log de compras
function logPurchase(cartItems, total) {
    const timestamp = new Date().toISOString();
    const logData = {
        timestamp,
        items: cartItems,
        total
    };
    
    // Em um ambiente real, isso enviaria os dados para um servidor
    console.log('LOG DE COMPRA:', logData);
    
    // Simular salvamento de log (em um ambiente real, isso seria uma requisição para uma API)
    try {
        // Armazenar no localStorage para persistência (apenas para demonstração)
        const existingLogs = JSON.parse(localStorage.getItem('purchaseLogs') || '[]');
        existingLogs.push(logData);
        localStorage.setItem('purchaseLogs', JSON.stringify(existingLogs));
        
        console.log('Log salvo com sucesso!');
    } catch (error) {
        console.error('Erro ao salvar log:', error);
    }
}

// Inicializar carrinho
updateCart();

// Adicionar efeitos de interação às categorias
document.querySelectorAll('.category').forEach(category => {
    category.addEventListener('click', function() {
        // Remover seleção anterior
        document.querySelectorAll('.category').forEach(cat => {
            cat.style.background = 'linear-gradient(145deg, var(--primary-color), var(--primary-dark))';
        });
        
        // Destacar categoria selecionada
        this.style.background = 'linear-gradient(145deg, var(--accent-color), #E64A19)';
        
        // Filtrar produtos (simulação)
        const platform = this.dataset.category;
        filterProducts(platform);
    });
});

// Filtrar produtos por categoria
function filterProducts(platform) {
    const allProducts = document.querySelectorAll('.product-card');
    
    allProducts.forEach(product => {
        const productPlatform = product.querySelector('.platform');
        if (platform === 'all' || (productPlatform && productPlatform.textContent.toLowerCase() === platform)) {
            product.style.display = 'block';
            setTimeout(() => {
                product.style.opacity = '1';
                product.style.transform = 'translateY(0)';
            }, 10);
        } else {
            product.style.opacity = '0';
            product.style.transform = 'translateY(20px)';
            setTimeout(() => {
                product.style.display = 'none';
            }, 300);
        }
    });
    
    showToast(`Mostrando produtos para ${platform.toUpperCase()}`);
}

// Efeito de digitação no título
function typeWriterEffect() {
    const logo = document.querySelector('.logo');
    const text = logo.getAttribute('data-text');
    let i = 0;
    let speed = 150;
    
    function type() {
        if (i < text.length) {
            logo.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    // Iniciar efeito após um breve delay
    setTimeout(() => {
        logo.textContent = '';
        type();
    }, 1000);
}

// Iniciar efeitos quando a página carregar
window.addEventListener('load', () => {
    typeWriterEffect();
    
    // Animar elementos ao rolar a página
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.product-card, .certificate-item');
        
        elements.forEach(element => {
            const position = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (position < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Configurar observador de interseção para animações de scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar elementos para animação
    document.querySelectorAll('.product-card, .certificate-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(item);
    });
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Executar uma vez ao carregar
});
