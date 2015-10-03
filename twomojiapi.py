import json

from flask import Flask
#from flask import request
from flask.ext.sqlalchemy import SQLAlchemy

import config

from sql_calls import (targets_sql, targets_id_sql, users_sql)


app = Flask(__name__)
app.secret_key = config.s_key
db = SQLAlchemy(app)


@app.route('/')
def main():
    return 'Welcome to the twomoji api!'


@app.route('/targets', methods=['GET'])
def get_targets():
    return json.dumps(targets_sql())


@app.route('/targets/<int:t_id>', methods=['GET'])
def get_target_id(t_id):
    return json.dumps(targets_id_sql(t_id))


@app.route('/users', methods=['GET'])
def get_users():
    return json.dumps(users_sql())


if __name__ == '__main__':
    app.run(debug=config.DEBUG)
