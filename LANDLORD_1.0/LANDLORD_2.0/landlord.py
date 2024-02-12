from flask import Flask, render_template, request, redirect, url_for, session

from flask_pymongo import PyMongo
import pymongo


from bson.json_util import dumps
from flask_bcrypt import Bcrypt
import logging

app = Flask(__name__)
app.config["MONGO_URI"] = 'mongodb://127.0.0.1:27017/landlord2.0'
mongo = PyMongo(app)
bcrypt = Bcrypt(app)

@app.route('/index')
def index():
    return render_template('index.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        try:
            username = request.form['username']
            password = request.form['password']
            email = request.form['email']

            print("Username: ", username)
            print("Password: ", password)
            print("Email: ", email)

            hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
            user = {'username': username, 'password': hashed_password, 'email': email}
            mongo.db.users.insert_one(user)
            return redirect(url_for('index'))
        except Exception as e:
            logging.error(f"Error occurred during sign-up: {e}")
            return "An error occurred during sign-up. Please try again later.", 500
    return render_template('signup.html')
    
@app.route('/login', methods=['POST', 'GET'])
def login():
    if request.method == "POST":
        try:
            username = request.form['username']
            password = request.form['password']

            user = mongo.db.users.find_one({'username': username})
            if user and bcrypt.check_password_hash(user['password'],  password):
                session['username'] = username
                return redirect(url_for('index'))
            else:
                return 'Invalid username or password'
        except Exception as e:
            logging.error(f"An error occurred during login: {e}")
            return "An error occurred during login. Please try again later.", 500
    return render_template('login.html')
    
@app.route('/dashboard', methods=['POST', 'GET'])
def dashboard():
    try:
        if 'username' in session:
            username = session['username']
            user = mongo.db.users.find_one({'username': username})
            if user:
                email = user.get('email')
                return render_template('dashboard.html', username=username, email=email)
            else:
                return "User data not found. Please log in again."
        else:
            return redirect(url_for('login'))
    except Exception as e:
        logging.error(f"An error occurred in the dashboard route: {e}")
        return "An error occurred. Please try again later.", 500

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)
