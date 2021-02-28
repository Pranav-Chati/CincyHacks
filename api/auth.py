from flask import Blueprint, request, jsonify, current_app, request
from .extensions import db, guard
from .models import User

auth = Blueprint('auth', __name__)


@auth.route('/api/register', methods=['POST'])
def register():
    data = request.get_json(force=True)
    username = data.get('username', None)
    password = data.get('password', None)
    name = data.get('name', None)

    if username is None or password is None:
        return jsonify({'message': 'Username or Password missing', 'registered': False, 'error': 'incomplete-data'})

    username_check = User.query.filter_by(username=username).first()

    if username_check:
        return jsonify(
            {'message': 'Username already exists in database', 'registered': False, 'error': 'name-duplicate'})

    new_user = User(username=username, password=guard.hash_password(password), score=0, roles='operator')

    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'success', 'registered': True})


@auth.route('/api/login', methods=['POST'])
def login():
    data = request.get_json(force=True)
    username = data.get('username', None)
    password = data.get('password', None)

    user = guard.authenticate(username=username, password=password)

    return jsonify({'access_token': guard.encode_jwt_token(user), 'authenticated': True})


@auth.route('/api/refresh', methods=['POST'])
def refresh():
    old_token = request.get_data()
    return jsonify({{'access_token': guard.refresh_jwt_token(old_token)}})
