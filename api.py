from flask import Flask, request, url_for, redirect, send_from_directory, render_template
import flask.ext.sqlalchemy
import flask.ext.restless
from flask.ext.restful import Api as FlaskRestfulAPI, Resource, reqparse, abort
import os
import config
from werkzeug import secure_filename, FileStorage

from cStringIO import StringIO
import datetime


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

ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png']
FILE_CONTENT_TYPES = { # these will be used to set the content type of S3 object. It is binary by default.
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png'
}

class FileStorageArgument(reqparse.Argument):
    """This argument class for flask-restful will be used in
    all cases where file uploads need to be handled."""
    
    def convert(self, value, op):
        print self.type
        if self.type is FileStorage:
            return value

        super(FileStorageArgument, self).convert(*args, **kwargs)

class UploadImage(Resource):
    #put_parser = reqparse.RequestParser(argument_class=FileStorageArgument)
    put_parser = reqparse.RequestParser()
    put_parser.add_argument('image', required=False, type=FileStorage, location='files')

    def post(self):
        args = self.put_parser.parse_args()
        image = args['image']

        # check logo extension
        #extension = image.filename.rsplit('.', 1)[1].lower()
        #if '.' in image.filename and not extension in app.config['ALLOWED_EXTENSIONS']:
        #    abort(400, message="File extension is not one of our supported types.")

        # create a file object of the image
        image_file = "file_{}".format(str(datetime.datetime.now()).replace(' ', '-'))
        path = os.path.join("/home/cjhin/www/chasjhin/twomoji/tmp/", image_file)
        image.save(path)

        return {'file_path': path}

manager = flask.ext.restless.APIManager(app, flask_sqlalchemy_db=db)

targets_includes = ['id', 'emoji_pair', 'weight', 'status', 'submissions']
manager.create_api(Targets, include_columns=targets_includes, methods=['GET'])
users_includes = ['id', 'username', 'usertargets']
manager.create_api(Users, include_columns=users_includes,  methods=['GET'])
manager.create_api(Submissions, methods=['GET', 'POST'])
manager.create_api(UserTargets, methods=['GET', 'POST', 'PATCH'])

api2 = FlaskRestfulAPI(app)
api2.add_resource(UploadImage, '/photos')

app.run()
