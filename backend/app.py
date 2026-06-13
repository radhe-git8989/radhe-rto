from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from datetime import datetime, timedelta
import os

app = Flask(__name__)
CORS(app)

DB_PATH = os.path.join(os.path.dirname(__file__), 'database.db')

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS policies (
            sr_no INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_name TEXT NOT NULL,
            phone_number TEXT,
            vehicle_no TEXT NOT NULL,
            vehicle_type TEXT DEFAULT 'Car',
            insurance_company TEXT NOT NULL,
            issue_date DATE NOT NULL,
            price DECIMAL NOT NULL,
            expiry_date DATE NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

@app.route('/api/policies', methods=['GET'])
def get_policies():
    conn = get_db_connection()
    policies = conn.execute('SELECT * FROM policies ORDER BY expiry_date ASC').fetchall()
    conn.close()
    return jsonify([dict(ix) for ix in policies])

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

        conn = get_db_connection()
        conn.execute('''
            INSERT INTO policies (customer_name, phone_number, vehicle_no, vehicle_type, insurance_company, issue_date, price, expiry_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (customer_name, phone_number, vehicle_no, vehicle_type, insurance_company, issue_date_str, price, expiry_date_str))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Policy added successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/policies/<int:sr_no>', methods=['PUT'])
def update_policy(sr_no):
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

        conn = get_db_connection()
        conn.execute('''
            UPDATE policies 
            SET customer_name = ?, phone_number = ?, vehicle_no = ?, vehicle_type = ?, insurance_company = ?, 
                issue_date = ?, price = ?, expiry_date = ?
            WHERE sr_no = ?
        ''', (customer_name, phone_number, vehicle_no, vehicle_type, insurance_company, issue_date_str, price, expiry_date_str, sr_no))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Policy updated successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/policies/<int:sr_no>', methods=['DELETE'])
def delete_policy(sr_no):
    try:
        conn = get_db_connection()
        conn.execute('DELETE FROM policies WHERE sr_no = ?', (sr_no,))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Policy deleted successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    init_db()
    app.run(debug=True, host='0.0.0.0', port=5000)
