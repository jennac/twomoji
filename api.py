import flask
import flask.ext.sqlalchemy
import flask.ext.restless

import config

app = flask.Flask(__name__)
app.config['DEBUG'] = config.DEBUG
app.config['SQLALCHEMY_DATABASE_URI'] = config.SQLALCHEMY_DATABASE_URI
db = flask.ext.sqlalchemy.SQLAlchemy
db = flask.ext.sqlalchemy.SQLAlchemy(app)


class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.Unicode, unique=True)
    usertargets = db.relationship('UserTargets', backref=db.backref('users'))


class Targets(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    emoji_pair = db.Column(db.Unicode, unique=True)
    weight = db.Column(db.Integer)
    status = db.Column(db.Integer)
    submissions = db.relationship('Submissions', backref=db.backref('users'))


class Submissions(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    target_id = db.Column(db.Integer, db.ForeignKey('targets.id'))
    score = db.Column(db.Integer)
    description = db.Column(db.Unicode)
    photo = db.Column(db.Unicode)


class UserTargets(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    target_id = db.Column(db.Integer, db.ForeignKey('targets.id'))
    points = db.Column(db.Integer)

db.create_all()

manager = flask.ext.restless.APIManager(app, flask_sqlalchemy_db=db)

targets_includes = ['id', 'emoji_pair', 'weight', 'status', 'submissions']
manager.create_api(Targets, include_columns=targets_includes, methods=['GET'])
users_includes = ['id', 'username', 'usertargets']
manager.create_api(Users, include_columns=users_includes,  methods=['GET'])
manager.create_api(Submissions, methods=['GET', 'POST'])
manager.create_api(UserTargets, methods=['GET', 'POST', 'PATCH'])

app.run()
