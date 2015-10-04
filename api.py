from flask import Flask, request, url_for, redirect, send_from_directory, render_template
import flask.ext.sqlalchemy
import flask.ext.restless
from flask.ext.restful import Api as FlaskRestfulAPI, Resource, reqparse, abort
import os
import config
from werkzeug import secure_filename, FileStorage

from cStringIO import StringIO
import datetime
import psycopg2
import json


app = flask.Flask(__name__)
app.config['DEBUG'] = config.DEBUG
app.config['SQLALCHEMY_DATABASE_URI'] = config.SQLALCHEMY_DATABASE_URI
#db = flask.ext.sqlalchemy.SQLAlchemy
db = flask.ext.sqlalchemy.SQLAlchemy(app)


class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.Unicode, unique=True)
    points = db.Column(db.Integer)
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

from config import DB_HOST, DB_NAME, DB_USERNAME, DB_PASSWORD

class SubmissionSave(Resource):
    put_parser = reqparse.RequestParser()
    put_parser.add_argument('photo', required=True, type=str)
    put_parser.add_argument('user_id', required=True, type=int)
    put_parser.add_argument('target_id', required=False, type=int)
    put_parser.add_argument('score', required=False, type=int, default=0)
    put_parser.add_argument('description', required=False, type=str, default='')

    def post(self):
        args = self.put_parser.parse_args()
        con = psycopg2.connect(host=DB_HOST, database=DB_NAME,
                               user=DB_USERNAME, password=DB_PASSWORD)
        cur = con.cursor()

        query = "INSERT INTO submissions (user_id, target_id, score, description, photo) VALUES ({}, {}, {}, '{}', '{}');".format(args['user_id'], args['target_id'], args['score'], args['description'], args['photo'])
        print query
        cur.execute(query)
        con.commit()

        user_count_sql = "SELECT COUNT(*) FROM submissions WHERE target_id = {};".format(args['target_id'])
        cur.execute(user_count_sql)
        user_count = int(cur.fetchone()[0])
    
        user_points_sql = "SELECT points FROM users WHERE id = {}".format(args['user_id'])
        cur.execute(user_points_sql)
        user_points = int(cur.fetchone()[0])
        print 'THIS IS USER COUNT {}'.format(user_count)
        print 'THIS IS USER COUNT {}'.format(user_points)
        if user_count ==  1:
            points = user_points + 945
            print points
            most_points = "UPDATE users SET points = {} WHERE id = {};".format(points, args['user_id'])
            print most_points
            cur.execute(most_points)
            con.commit()
        if user_count == 2:
            points = user_points + 673
            print points
            more_points = "UPDATE users SET points = {} WHERE id = {};".format(points, args['user_id'])
            print more_points
            cur.execute(more_points)
            con.commit()
        if user_count == 3:
            points = user_points + 1
            print points
            points_i_guess = "UPDATE users SET points = {} WHERE id = {};".format(points, args['user_id'])
            cur.execute(points_i_guess)
            con.commit()
            next_round_one = "UPDATE targets SET status = 0 WHERE id={};".format(args['target_id'])
            cur.execute(next_round_one)
            print next_round_one
            next_round_id = args['target_id'] + 1
            next_round_two = "UPDATE targets SET status = 1 WHERE id={};".format(next_round_id)
            cur.execute(next_round_two)
            print next_round_two
            con.commit()
            
        return { 'success': True }

manager = flask.ext.restless.APIManager(app, flask_sqlalchemy_db=db)

targets_includes = ['id', 'emoji_pair', 'weight', 'status', 'submissions']
manager.create_api(Targets, include_columns=targets_includes, methods=['GET'])
users_includes = ['id', 'username', 'usertargets']
manager.create_api(Users, include_columns=users_includes,  methods=['GET'])
manager.create_api(Submissions, methods=['GET', 'POST'])
manager.create_api(UserTargets, methods=['GET', 'POST', 'PATCH'])

api2 = FlaskRestfulAPI(app)
api2.add_resource(UploadImage, '/photos')
api2.add_resource(SubmissionSave, '/submission')

app.run()

## first person gets POINTZ
## Add row to user targets
