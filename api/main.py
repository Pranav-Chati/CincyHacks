from flask import Blueprint, request, jsonify, current_app
from .extensions import db
from flask_praetorian import auth_required, current_user_id, current_user
from .models import User
from datetime import date
import time

main = Blueprint('main', __name__)


@main.route('/')
def index():
    return "Hello World!"


@main.route("/api/testauth")
@auth_required
def testauth():
    return "Hey! You're authorized!"

@main.route("/api/addworkout", methods=["POST"])
@auth_required
def addworkout():
    data = request.get_json(force=True)
    current_user().score += data['score']

    db.session.commit()
    return jsonify({"message": "success"})

@main.route("/api/leaderboards", methods=['GET'])
def getleaderboard():
    users = User.query.all()
    out = []

    for i in users:
        t = {}
        t['name'] = i.username
        t['score'] = i.score
        out.append(t)
    
    return jsonify(sorted(out, key=lambda k: k['score']))
