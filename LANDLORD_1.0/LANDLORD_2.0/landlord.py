from flask import Flask, render_template
#from flask_pymongo import PyMongo

app = Flask(__name__)
#app.config["MONGO_URI"] = 'mongodb://127.0.0.1:27017/landlord2.0'
#mongo = PyMongo(app)

@app.route('/index')
def index():
    return render_template('index.html')

#@app.route('/')
if __name__ == '__main__':
    app.run(debug=True)
