import tensorflow as tf
import numpy as np
from tensorflow import keras
from keras.layers import  MaxPool2D
from keras.callbacks import ReduceLROnPlateau
from keras.optimizers import Adam
from keras.metrics import categorical_crossentropy
from keras.preprocessing.image import ImageDataGenerator
import keras.utils as image
from keras.utils import load_img, array_to_img, img_to_array
from sklearn.metrics import confusion_matrix
from datetime import datetime
import itertools
import time
import base64
import os
import uuid
import shutil
import matplotlib.pyplot as plt
import warnings
import cv2

warnings.simplefilter(action="ignore", category=FutureWarning)

class Model:
    id = None
    filename = None
    created = None
    accuracy = None
    graph = None

class Scan:
    date = None
    model_id = None
    scanned = 0
    cracked = 0
    non_cracked = 0

class DamageDetectionModel:
    img_width=256
    img_height=256
    train_path = 'Data/train'
    valid_path = 'Data/valid'
    test_path_ml = 'Data/test'
    test_path = 'Footage/Images'
    model_name = 'damageDetectionModel'
    model = None

    def __init__(self):
        self.loadModel(self.model_name)

    
    def loadModel(self, modelName):
        self.model = keras.models.load_model('Data/saved_model/' + modelName)
        self.model.compile(optimizer=Adam(learning_rate=0.0000001), loss='binary_crossentropy', metrics=['accuracy'])

    
    def moveFilesForTraining(self, cursor):
        cursor.execute('''SELECT filename FROM categorized_img WHERE threat_level_id != 0 AND addressed = true;''')
        files_to_move = cursor.fetchall()
        for file_path in files_to_move:
            shutil.move('Data/Cracked/' + file_path[0], 'Data/train/cracked')
        cursor.execute('''DELETE FROM categorized_img WHERE threat_level_id != 0 AND addressed = true;''')

    
    def retrain_model_with_new_data(self, cursor):
        self.moveFilesForTraining(cursor)

        db_model = Model()

        train_batches = ImageDataGenerator(preprocessing_function=tf.keras.applications.vgg19.preprocess_input).flow_from_directory(directory=self.train_path, target_size=(256,256), classes=['cracked', 'noncracked'], batch_size=10)
        valid_batches = ImageDataGenerator(preprocessing_function=tf.keras.applications.vgg19.preprocess_input).flow_from_directory(directory=self.valid_path, target_size=(256,256), classes=['cracked', 'noncracked'], batch_size=10)
        test_batches = ImageDataGenerator(preprocessing_function=tf.keras.applications.vgg19.preprocess_input).flow_from_directory(directory=self.test_path_ml, target_size=(256,256), classes=['cracked', 'noncracked'], batch_size=10, shuffle=False)

        reduce_lr = ReduceLROnPlateau(monitor='val_loss', factor=0.2, patience=3, min_lr=1.0e-15)
        
        with tf.device('/gpu:0'):
            history = self.model.fit(x=train_batches, validation_data=valid_batches, epochs=1, verbose=2, callbacks=[reduce_lr])
            db_model.accuracy = history.history['accuracy'][0]
        
        db_model.filename = 'damageDetectionModel-' + datetime.today().strftime(r"%d-%m-%Y")
        self.model.save('Data/saved_model/' + db_model.filename, save_format='tf')

        db_model.created = datetime.now()
        

        predictions = self.model.predict(x=test_batches, verbose=0)
        cm = confusion_matrix(y_true=test_batches.classes, y_pred=np.argmax(predictions, axis=-1))
        cm_plot_labels = ['cracked', 'noncracked']
        self.plot_confusion_matrix(cm=cm, classes=cm_plot_labels, title='Confusion matrix')

        image_base64 = None
        with open("graph.png", "rb") as image_file:
            image_base64 = base64.b64encode(image_file.read())

        cursor.execute('''INSERT INTO model(filename, created, accuracy, graph) VALUES ('{0}', '{1}', '{2}', '{3}');'''.format(db_model.filename, db_model.created.strftime(r"%Y-%m-%d %H:%M:%S"), str(db_model.accuracy), "data:image/png;base64, " + image_base64.decode('utf-8')))

        if os.path.isfile('graph.png'):
            os.remove('graph.png')
    
    def scanVideo(self, videoName):
        count = 0
        vidcap = cv2.VideoCapture('Footage/' + videoName)
        success,image = vidcap.read()
        success = True
        while success:
            vidcap.set(cv2.CAP_PROP_POS_MSEC,(count*1000))
            success,image = vidcap.read()
            if(success):
                image_uuid = str(uuid.uuid4())
                cv2.imwrite( 'Footage/Images/Sector' + str(round((count * 0.234) / 10)) + "_" + image_uuid + ".jpg", image) #0.234 calculated m/s drone speed
                count = count + 1

    def getScanAmount(self):
        counter = 0
        for file_path in os.listdir('Footage'):
            if os.path.isfile(os.path.join('Footage', file_path)):
               counter = counter + 1
        return counter
    
    def scanVideos(self, cursor):
        scan = Scan()
        scan.date = datetime.now()
        scan.model_id = cursor.execute('''SELECT id FROM model WHERE filename LIKE '{}';'''.format(self.model_name))
        for file_path in os.listdir('Footage'):
            if os.path.isfile(os.path.join('Footage', file_path)):
               self.scanVideo(file_path)
               os.remove('Footage/' + file_path)
        for file_path in os.listdir('Footage/Images'):
            if os.path.isfile(os.path.join('Footage/Images', file_path)):
                scan.scanned = scan.scanned + 1
                img = image.load_img('Footage/Images/' + file_path, target_size=(self.img_width, self.img_height))
                x = image.img_to_array(img)
                x = np.expand_dims(x, axis=0)
                images = np.vstack([x])
                classes = self.model.predict(images)
                if(classes[0][0] > classes[0][1]):
                    shutil.move('Footage/Images/' + file_path, 'Data/Cracked')
                    image_base64 = None
                    with open("Data/Cracked/" + file_path, "rb") as image_file:
                        image_base64 = base64.b64encode(image_file.read())
                    splitString = file_path.split('_')[0]
                    sector = splitString.split('r')[1]
                    cursor.execute('''INSERT INTO categorized_img(filename, img, sector) VALUES ('{0}', '{1}', {2});'''.format(file_path, "data:image/jpg;base64, " + image_base64.decode('utf-8'), int(sector)))
                    scan.cracked = scan.cracked + 1
                else:
                    shutil.move('Footage/Images/' + file_path, 'Data/Non-cracked')
                    scan.non_cracked = scan.non_cracked + 1
        cursor.execute('''INSERT INTO scan(date, model_id, scanned, cracked, non_cracked) VALUES ('{0}', {1}, {2}, {3}, {4})'''.format(scan.date.strftime(r"%Y-%m-%d %H:%M:%S"), scan.model_id, scan.scanned, scan.cracked, scan.non_cracked))
    

    def plot_confusion_matrix(self, cm, classes, normalize=False, title='Confusion matrix', cmap=plt.cm.Blues):
        plt.imshow(cm, interpolation='nearest', cmap=cmap)
        plt.title(title)
        plt.colorbar()
        tick_marks = np.arange(len(classes))
        plt.xticks(tick_marks, classes, rotation=45)
        plt.yticks(tick_marks, classes)

        if normalize:
            cm = cm.astype('float') / cm.sum(axis=1)[:, np.newaxis]

        thresh = cm.max() / 2.
        for i, j in itertools.product(range(cm.shape[0]), range(cm.shape[1])):
            plt.text(j, i, cm[i,j],
                    horizontalalignment="center",
                    color="white" if cm[i,j] > thresh else "black")
    
        plt.tight_layout()
        plt.ylabel('True label')
        plt.xlabel('Predicted label')
        plt.savefig('graph.png')