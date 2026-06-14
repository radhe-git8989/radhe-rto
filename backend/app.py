from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
import os

app = Flask(__name__)
CORS(app)

# Database Configuration
# Use DATABASE_URL from environment (e.g., Render/PostgreSQL) or fallback to local SQLite
database_url = os.getenv('DATABASE_URL')
if database_url and database_url.startswith('postgres://'):
    database_url = database_url.replace('postgres://', 'postgresql://', 1)

app.config['SQLALCHEMY_DATABASE_URI'] = database_url or 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Policy(db.Model):
    __tablename__ = 'policies'
    sr_no = db.Column(db.Integer, primary_key=True, autoincrement=True)
    customer_name = db.Column(db.String(100), nullable=False)
    phone_number = db.Column(db.String(20))
    vehicle_no = db.Column(db.String(20), nullable=False)
    vehicle_type = db.Column(db.String(20), default='Car')
    insurance_company = db.Column(db.String(100), nullable=False)
    issue_date = db.Column(db.String(10), nullable=False)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    expiry_date = db.Column(db.String(10), nullable=False)

    def to_dict(self):
        return {
            'sr_no': self.sr_no,
            'customer_name': self.customer_name,
            'phone_number': self.phone_number,
            'vehicle_no': self.vehicle_no,
            'vehicle_type': self.vehicle_type,
            'insurance_company': self.insurance_company,
            'issue_date': self.issue_date,
            'price': float(self.price),
            'expiry_date': self.expiry_date
        }

with app.app_context():
    db.create_all()

@app.route('/api/policies', methods=['GET'])
def get_policies():
    policies = Policy.query.order_by(Policy.expiry_date.asc()).all()
    return jsonify([p.to_dict() for p in policies])

@app.route('/api/policies', methods=['POST'])
def add_policy():
    data = request.json
    customer_name = data.get('customer_name')
    phone_number = data.get('phone_number')
    vehicle_no = data.get('vehicle_no')
    vehicle_type = data.get('vehicle_type', 'Car')
    insurance_company = data.get('insurance_company')
    issue_date_str = data.get('issue_date')
    price = data.get('price')

    if not all([customer_name, vehicle_no, insurance_company, issue_date_str, price]):
        return jsonify({'error': 'Missing data'}), 400

    try:
        issue_date = datetime.strptime(issue_date_str, '%Y-%m-%d')
        try:
            expiry_date = issue_date.replace(year=issue_date.year + 1)
        except ValueError:
            expiry_date = issue_date + timedelta(days=365)
        
        expiry_date_str = expiry_date.strftime('%Y-%m-%d')

        new_policy = Policy(
            customer_name=customer_name,
            phone_number=phone_number,
            vehicle_no=vehicle_no,
            vehicle_type=vehicle_type,
            insurance_company=insurance_company,
            issue_date=issue_date_str,
            price=price,
            expiry_date=expiry_date_str
        )
        db.session.add(new_policy)
        db.session.commit()
        return jsonify({'message': 'Policy added successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/policies/<int:sr_no>', methods=['PUT'])
def update_policy(sr_no):
    data = request.json
    policy = Policy.query.get(sr_no)
    if not policy:
        return jsonify({'error': 'Policy not found'}), 404

    try:
        policy.customer_name = data.get('customer_name', policy.customer_name)
        policy.phone_number = data.get('phone_number', policy.phone_number)
        policy.vehicle_no = data.get('vehicle_no', policy.vehicle_no)
        policy.vehicle_type = data.get('vehicle_type', policy.vehicle_type)
        policy.insurance_company = data.get('insurance_company', policy.insurance_company)
        
        issue_date_str = data.get('issue_date')
        if issue_date_str:
            policy.issue_date = issue_date_str
            issue_date = datetime.strptime(issue_date_str, '%Y-%m-%d')
            try:
                expiry_date = issue_date.replace(year=issue_date.year + 1)
            except ValueError:
                expiry_date = issue_date + timedelta(days=365)
            policy.expiry_date = expiry_date.strftime('%Y-%m-%d')
            
        policy.price = data.get('price', policy.price)

        db.session.commit()
        return jsonify({'message': 'Policy updated successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/policies/<int:sr_no>', methods=['DELETE'])
def delete_policy(sr_no):
    try:
        policy = Policy.query.get(sr_no)
        if not policy:
            return jsonify({'error': 'Policy not found'}), 404
        db.session.delete(policy)
        db.session.commit()
        return jsonify({'message': 'Policy deleted successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
