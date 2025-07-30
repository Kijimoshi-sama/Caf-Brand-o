import os
import sys
# DON'T CHANGE THIS LINE
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from flask import Flask, render_template
from flask_cors import CORS
from models.user import db
from models.product import Product
from models.order import Order
from routes.user import user_bp
from routes.auth import auth_bp
from routes.product import product_bp
from routes.order import order_bp

def create_app():
    app = Flask(__name__, 
                static_folder='static',
                template_folder='templates')
    
    # Configuração do banco de dados
    db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'database', 'app.db')
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = 'sua-chave-secreta-aqui'
    
    # Inicializar extensões
    db.init_app(app)
    CORS(app, supports_credentials=True)
    
    # Registrar blueprints
    app.register_blueprint(user_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(product_bp, url_prefix='/api')
    app.register_blueprint(order_bp, url_prefix='/api')
    
    # Rota para servir o frontend React
    @app.route('/')
    def index():
        return render_template('index.html')
    
    # Rota catch-all para SPA routing
    @app.route('/<path:path>')
    def catch_all(path):
        # Se o arquivo existe no static, serve ele
        if os.path.exists(os.path.join(app.static_folder, path)):
            return app.send_static_file(path)
        # Senão, serve o index.html para SPA routing
        return render_template('index.html')
    
    # Rota de health check
    @app.route('/api/health')
    def health():
        return {'message': 'Café Express API está funcionando!'}
    
    # Criar tabelas e dados de exemplo
    with app.app_context():
        # Criar diretório do banco se não existir
        db_dir = os.path.dirname(app.config['SQLALCHEMY_DATABASE_URI'].replace('sqlite:///', ''))
        if not os.path.exists(db_dir):
            os.makedirs(db_dir)
        
        db.create_all()
        
        # Adicionar produtos de exemplo se não existirem
        if Product.query.count() == 0:
            products = [
                Product(
                    name='Espresso',
                    description='Café puro e intenso, extraído na pressão perfeita',
                    price=4.50,
                    category='espresso',
                    image='/assets/espresso.jpg'
                ),
                Product(
                    name='Cappuccino',
                    description='Espresso com leite vaporizado e espuma cremosa',
                    price=6.50,
                    category='leite',
                    image='/assets/cappuccino.jpg'
                ),
                Product(
                    name='Latte',
                    description='Café suave com muito leite vaporizado e latte art',
                    price=7.00,
                    category='leite',
                    image='/assets/latte.jpg'
                ),
                Product(
                    name='Americano',
                    description='Espresso diluído em água quente, sabor encorpado',
                    price=5.00,
                    category='espresso',
                    image='/assets/americano.jpg'
                )
            ]
            
            for product in products:
                db.session.add(product)
            
            db.session.commit()
            print("Produtos de exemplo adicionados ao banco de dados")
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)

