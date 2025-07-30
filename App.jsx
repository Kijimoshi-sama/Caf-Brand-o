import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { ShoppingCart, User, Menu, X, Plus, Minus } from 'lucide-react'
import './App.css'

// Importar imagens
import logo from './assets/logo.png'
import heroCoffee from './assets/hero-coffee.jpg'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // Estados para formulários
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  })

  // Carregar produtos e verificar usuário logado
  useEffect(() => {
    loadProducts()
    checkCurrentUser()
  }, [])

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkCurrentUser = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      })
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      }
    } catch (error) {
      console.error('Erro ao verificar usuário:', error)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(loginForm)
      })

      const data = await response.json()
      
      if (response.ok) {
        setUser(data.user)
        setIsLoginOpen(false)
        setLoginForm({ email: '', password: '' })
        alert('Login realizado com sucesso!')
      } else {
        alert(data.error || 'Erro ao fazer login')
      }
    } catch (error) {
      console.error('Erro no login:', error)
      alert('Erro ao fazer login')
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(registerForm)
      })

      const data = await response.json()
      
      if (response.ok) {
        setUser(data.user)
        setIsRegisterOpen(false)
        setRegisterForm({ username: '', email: '', password: '', phone: '', address: '' })
        alert('Cadastro realizado com sucesso!')
      } else {
        alert(data.error || 'Erro ao fazer cadastro')
      }
    } catch (error) {
      console.error('Erro no cadastro:', error)
      alert('Erro ao fazer cadastro')
    }
  }

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
      
      if (response.ok) {
        setUser(null)
        setCart([])
        alert('Logout realizado com sucesso!')
      }
    } catch (error) {
      console.error('Erro no logout:', error)
    }
  }

  const createOrder = async () => {
    if (!user) {
      setIsLoginOpen(true)
      return
    }

    if (cart.length === 0) {
      alert('Carrinho vazio!')
      return
    }

    if (!user.address) {
      alert('Por favor, adicione um endereço no seu perfil antes de finalizar o pedido.')
      return
    }

    try {
      const orderData = {
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        })),
        delivery_address: user.address
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(orderData)
      })

      const data = await response.json()
      
      if (response.ok) {
        setCart([])
        setIsCartOpen(false)
        alert(`Pedido criado com sucesso! Número do pedido: ${data.order.id}`)
      } else {
        alert(data.error || 'Erro ao criar pedido')
      }
    } catch (error) {
      console.error('Erro ao criar pedido:', error)
      alert('Erro ao criar pedido')
    }
  }

  // Função para adicionar item ao carrinho
  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id)
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      }
      return [...prevCart, { ...item, quantity: 1 }]
    })
  }

  // Função para remover item do carrinho
  const removeFromCart = (itemId) => {
    setCart(prevCart => {
      return prevCart.map(cartItem =>
        cartItem.id === itemId
          ? { ...cartItem, quantity: Math.max(0, cartItem.quantity - 1) }
          : cartItem
      ).filter(cartItem => cartItem.quantity > 0)
    })
  }

  // Calcular total do carrinho
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <img src={logo} alt="Café Express" className="h-10 w-10" />
              <span className="ml-2 text-xl font-bold text-amber-900">Café Express</span>
            </div>

            {/* Navigation Desktop */}
            <nav className="hidden md:flex space-x-8">
              <a href="#home" className="text-gray-700 hover:text-amber-700 font-medium">Início</a>
              <a href="#menu" className="text-gray-700 hover:text-amber-700 font-medium">Cardápio</a>
              <a href="#about" className="text-gray-700 hover:text-amber-700 font-medium">Sobre</a>
              <a href="#contact" className="text-gray-700 hover:text-amber-700 font-medium">Contato</a>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-700 hover:text-amber-700"
              >
                <ShoppingCart className="h-6 w-6" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              {/* User Button */}
              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">Olá, {user.username}</span>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="p-2 text-gray-700 hover:text-amber-700"
                >
                  <User className="h-6 w-6" />
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-700"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100">
              <nav className="flex flex-col space-y-2">
                <a href="#home" className="text-gray-700 hover:text-amber-700 font-medium py-2">Início</a>
                <a href="#menu" className="text-gray-700 hover:text-amber-700 font-medium py-2">Cardápio</a>
                <a href="#about" className="text-gray-700 hover:text-amber-700 font-medium py-2">Sobre</a>
                <a href="#contact" className="text-gray-700 hover:text-amber-700 font-medium py-2">Contato</a>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroCoffee})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Café Perfeito,
            <br />
            <span className="text-orange-400">Entregue na Sua Casa</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Desfrute dos melhores cafés artesanais com entrega rápida e sabor incomparável
          </p>
          <Button
            size="lg"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg"
            onClick={() => document.getElementById('menu').scrollIntoView({ behavior: 'smooth' })}
          >
            Ver Cardápio
          </Button>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nosso Cardápio</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Cafés especiais preparados com grãos selecionados e técnicas artesanais
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.name}</h3>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-amber-700">
                      R$ {item.price.toFixed(2)}
                    </span>
                    <Button
                      onClick={() => addToCart(item)}
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Adicionar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Sobre o Café Express</h2>
              <p className="text-lg text-gray-600 mb-6">
                Somos apaixonados por café e dedicados a oferecer a melhor experiência de delivery de café da cidade. 
                Nossos grãos são cuidadosamente selecionados e torrados para garantir o sabor perfeito em cada xícara.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Com entrega rápida e embalagens que preservam o aroma e temperatura, levamos o café perfeito 
                diretamente para sua casa ou escritório.
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-orange-500">500+</div>
                  <div className="text-gray-600">Pedidos Entregues</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-500">15min</div>
                  <div className="text-gray-600">Tempo Médio</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-500">4.9★</div>
                  <div className="text-gray-600">Avaliação</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src={heroCoffee}
                alt="Sobre nós"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Entre em Contato</h2>
          <p className="text-lg text-gray-600 mb-8">
            Dúvidas? Sugestões? Estamos aqui para ajudar!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Telefone</h3>
              <p className="text-gray-600">(11) 99999-9999</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">contato@cafeexpress.com</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Horário</h3>
              <p className="text-gray-600">Seg-Dom: 6h às 22h</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-amber-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img src={logo} alt="Café Express" className="h-8 w-8 brightness-0 invert" />
                <span className="ml-2 text-xl font-bold">Café Express</span>
              </div>
              <p className="text-amber-200">
                O melhor café, entregue com carinho na sua porta.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
              <ul className="space-y-2 text-amber-200">
                <li><a href="#home" className="hover:text-white">Início</a></li>
                <li><a href="#menu" className="hover:text-white">Cardápio</a></li>
                <li><a href="#about" className="hover:text-white">Sobre</a></li>
                <li><a href="#contact" className="hover:text-white">Contato</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contato</h3>
              <ul className="space-y-2 text-amber-200">
                <li>(11) 99999-9999</li>
                <li>contato@cafeexpress.com</li>
                <li>São Paulo, SP</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Redes Sociais</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-amber-200 hover:text-white">Facebook</a>
                <a href="#" className="text-amber-200 hover:text-white">Instagram</a>
                <a href="#" className="text-amber-200 hover:text-white">Twitter</a>
              </div>
            </div>
          </div>
          <div className="border-t border-amber-800 mt-8 pt-8 text-center text-amber-200">
            <p>&copy; 2024 Café Express. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsCartOpen(false)}></div>
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Carrinho</h2>
                <button onClick={() => setIsCartOpen(false)}>
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                {cart.length === 0 ? (
                  <p className="text-gray-500 text-center mt-8">Seu carrinho está vazio</p>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                        <div className="flex-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-gray-600">R$ {item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => addToCart(item)}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {cart.length > 0 && (
                <div className="border-t p-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-lg font-bold text-orange-500">
                      R$ {cartTotal.toFixed(2)}
                    </span>
                  </div>
                  <Button
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={createOrder}
                  >
                    Finalizar Pedido
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsLoginOpen(false)}></div>
          <div className="relative bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Login</h2>
              <button onClick={() => setIsLoginOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="seu@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Senha
                </label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="••••••••"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                Entrar
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Não tem conta?{' '}
                <button 
                  onClick={() => {
                    setIsLoginOpen(false)
                    setIsRegisterOpen(true)
                  }}
                  className="text-orange-500 hover:text-orange-600 font-medium"
                >
                  Cadastre-se
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsRegisterOpen(false)}></div>
          <div className="relative bg-white rounded-lg p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Cadastro</h2>
              <button onClick={() => setIsRegisterOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome de usuário
                </label>
                <input
                  type="text"
                  value={registerForm.username}
                  onChange={(e) => setRegisterForm({...registerForm, username: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Seu nome"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="seu@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Senha
                </label>
                <input
                  type="password"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <input
                  type="tel"
                  value={registerForm.phone}
                  onChange={(e) => setRegisterForm({...registerForm, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Endereço
                </label>
                <textarea
                  value={registerForm.address}
                  onChange={(e) => setRegisterForm({...registerForm, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Seu endereço completo"
                  rows="3"
                />
              </div>
              <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                Cadastrar
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Já tem conta?{' '}
                <button 
                  onClick={() => {
                    setIsRegisterOpen(false)
                    setIsLoginOpen(true)
                  }}
                  className="text-orange-500 hover:text-orange-600 font-medium"
                >
                  Faça login
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App

