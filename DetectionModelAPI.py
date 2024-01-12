from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from threading import Thread
from datetime import datetime, time
import time
import schedule
import rospy
from DamageDetection import DamageDetectionModel
from Drone import DroneControll
from flask_cors import CORS, cross_origin

app = Flask(__name__)

app.config['MYSQL_HOST'] = '192.168.0.15'
app.config['MYSQL_PORT'] = 3307
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'pw'
app.config['MYSQL_DB'] = 'damagedetection'
app.config['CORS_HEADERS'] = 'Content-Type'

mydb = MySQL(app)
cors = CORS(app)

damageDetectionModel = DamageDetectionModel()
droneControll = DroneControll(15,90)

flightCancelled = False
job = None

def run_drone_scan():
    droneControll.startFlight()

run_time = datetime.strptime("09:00", '%H:%M').time()

def schedule_job():
    global job
    job = schedule.every().day.at(str(run_time)).do(run_drone_scan)

schedule_job()

def do_job():
    while True:
        schedule.run_pending()
        time.sleep(10)

droneThread = Thread(target = do_job)
droneThread.start()

@app.route("/scan/amount")
@cross_origin()
def get_scan_amount():
    try:
        amount = damageDetectionModel.getScanAmount()
        return jsonify(amount), 200
    except Exception as e:
        return "Something went wrong! " + e, 500

@app.route("/scan/time")
@cross_origin()
def get_scan_time():
    global flightCancelled
    if flightCancelled:
        return "Canceled", 200
    else:
        return run_time.strftime(r"%H:%M"), 200

@app.route("/scan/time/<time>")
@cross_origin()
def change_scan_time(time):
    try:
        global flightCancelled
        global run_time
        global job
        flightCancelled = False
        run_time = datetime.strptime(time, '%H:%M').time()
        schedule.cancel_job(job)
        schedule_job()
        return "Successfully changed scan time", 200
    except Exception as e:
        return "Something went wrong! " + e, 500

@app.route("/scan/cancel")
@cross_origin()
def cancel_scan():
    try:
        global job
        global flightCancelled
        schedule.cancel_job(job)
        flightCancelled = True
        return "Successfully canceled scan", 200
    except Exception as e:
        return "Something went wrong! " + e, 500

@app.route("/scan/<model_filename>")
@cross_origin()
def run_scan(model_filename):
    try:
        cursor = mydb.connection.cursor()
        damageDetectionModel.loadModel(model_filename)
        damageDetectionModel.scanVideos(cursor)
        mydb.connection.commit()
        cursor.close()
        return "Successfull scan", 200
    except Exception as e:
        return "Something went wrong! " + e, 500
    
@app.route("/scan/now")
@cross_origin()
def run_drone_scan():
    try:
        droneControll.startFlight()
        return "Successfully ran scan with drone", 200
    except Exception as e:
        return "Something went wrong! " + e, 500


@app.route("/model/retrain/<model_filename>")
@cross_origin()
def retrain_model(model_filename):
    try:
        cursor = mydb.connection.cursor()
        damageDetectionModel.loadModel(model_filename)
        damageDetectionModel.retrain_model_with_new_data(cursor)
        mydb.connection.commit()
        cursor.close()
        return "Successfully retrained model", 200
    except Exception as e:
        return "Something went wrong! " + e, 500



if __name__ == "__main__":
    app.run(host="192.168.0.25", port=int("5000"))


