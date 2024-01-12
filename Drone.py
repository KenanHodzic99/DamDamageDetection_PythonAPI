from dronekit import connect, VehicleMode, LocationGlobalRelative
from pymavlink import mavutil
from sensor_msgs.msg import Image
from cv_bridge import CvBridge, CvBridgeError
from datetime import date
from threading import Thread
import datetime
import cv2
import rospy
import time


class DroneControll:
    height = 15
    width = 90

    def __init__(self, height, width):
        self.height = height
        self.width = width
    
    def startFlight(self):
        vehicle = connect('127.0.0.1:14550', wait_ready=False)
        vehicle.wait_ready(True, timeout=300)
        print("Mode: %s" % vehicle.mode.name)

        the_connection = mavutil.mavlink_connection('udpin:localhost:14551')
        the_connection.wait_heartbeat()
        print('Heartbeat from system (system %u component %u)' % (the_connection.target_system, the_connection.target_component))

        video = cv2.VideoWriter('Test' + datetime.datetime.now().strftime("%d-%m-%Y")  + '.mp4', cv2.VideoWriter_fourcc(*'mp4v'), 30, (640, 480))

        bridge = CvBridge()
        def image_callback(msg):
            try:
                cv2_img = bridge.imgmsg_to_cv2(msg, "bgr8")
            except CvBridgeError as e:
                print(e)
            else:
                video.write(cv2_img)
        rospy.init_node('camera_controller')
        image_topic = '/webcam/image_raw'
        rospy.Rate(30)
        rospy.Subscriber(image_topic, Image, image_callback)


        def send_local_ned_velocity(vx, vy, vz, yaw_rad):
            the_connection.mav.send(
                mavutil.mavlink.MAVLink_set_position_target_local_ned_message(
                    10, 
                    the_connection.target_system, the_connection.target_component,
                    mavutil.mavlink.MAV_FRAME_LOCAL_NED, 
                    int(0b001111000111), 
                    0, 0, 0, 
                    vx, vy, vz, 
                    0, 0, 0, 
                    yaw_rad, 0
                    ))

        def move_forward(meters):
            while meters > 0:
                send_local_ned_velocity(1, 0, 0, 0)
                time.sleep(1)
                meters = meters-1

        def move_backwards(meters):
            while meters > 0:
                send_local_ned_velocity(-1, 0, 0, 0)
                time.sleep(1)
                meters = meters-1

        def move_left(meters):
            while meters > 0:
                send_local_ned_velocity(0, -1, 0, 0)
                time.sleep(1)
                meters = meters-1

        def move_right(meters):
            while meters > 0:
                send_local_ned_velocity(0, 1, 0, 0)
                time.sleep(1)
                meters = meters-1

        def move_up(meters):
            while meters > 0:
                send_local_ned_velocity(0, 0, -1, 0)
                time.sleep(1)
                meters = meters-1

        def move_down(meters):
            while meters > 0:
                send_local_ned_velocity(0, 0, 1, 0)
                time.sleep(1)
                meters = meters-1


        while not vehicle.is_armable:
            print ("Waiting for vehicle to initialise...")
            time.sleep(1)

        if vehicle.mode.name == "INITIALISING":
            print ("Waiting for vehicle to initialise")
            time.sleep(1)

        while vehicle.gps_0.fix_type < 2:
            print ("Waiting for GPS...: %u", vehicle.gps_0.fix_type)
            time.sleep(1)

        vehicle.mode = VehicleMode("GUIDED")

        vehicle.armed = True

        while not vehicle.armed:
            print ("Waiting for arming...")
            time.sleep(1)

        vehicle.simple_takeoff(self.height + 3)

        while True:
                print ("Altitude: %u", vehicle.location.global_relative_frame.alt)
                if vehicle.location.global_relative_frame.alt >= 3*0.95:
                    print ("Reached target altitude")
                    break
                time.sleep(1)

        move_backwards(5)
        move_down(4)
        move_left(int(self.width/2) - 2)
        for x in range(int(self.height/2) - 1):
            move_down(1)
            move_right(self.width - 2)
            move_down(1)
            move_left(self.width - 2)

        move_up(self.height + 3)
        move_right(int(self.width/2) - 2)
        move_forward(5)
        move_down(3)

        vehicle.mode = VehicleMode('LAND')
        video.release()
        vehicle.close()