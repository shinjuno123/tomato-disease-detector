from django.shortcuts import redirect, render
from django.http.response import JsonResponse
import PIL.Image as Image
import io
from django.views.decorators.csrf import csrf_exempt
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import cv2
import numpy as np
import urllib.request
import base64
from io import BytesIO
 
# pip3 install pillow
from PIL import Image


# Create your views here.

@csrf_exempt
def tomato_disease_recogntion_page(request):
    print("post신호")
    # read_firebase()
    if(request.method == "POST"):
        modified_img,label_and_confidence_dict= detect_disease_of_tomato(PIL_to_cv2(request.body))
        label_and_confidence_dict['image'] = image_to_base64(cv2_to_PIL(modified_img)).decode('utf-8','ignore')
        # print(label_and_confidence_dict)
        return JsonResponse(label_and_confidence_dict)

    return render(request,'tomato_disease_recognition.html')


def PIL_to_cv2(image):
    img = Image.open(io.BytesIO(image))
    numpy_image = np.array(img)
    opencv_image = cv2.cvtColor(numpy_image,cv2.COLOR_RGB2BGR)
    return opencv_image

def cv2_to_PIL(image):
    return Image.fromarray(image)


def image_to_base64(img):
    output_buffer = BytesIO()
    img.save(output_buffer, format='JPEG')
    byte_data = output_buffer.getvalue()
    base64_str = base64.b64encode(byte_data)
    return base64_str

def PIL_to_bytes(image:Image):
    imgByeArr = io.BytesIO()
    image.save(imgByeArr,format='PNG')
    imgByeArr = imgByeArr.getvalue()
    return imgByeArr

def read_firebase():
    cred = credentials.Certificate('static/tomato_disease_recognition_app/id.json')
    firebase_admin.initialize_app(cred,{
        'databaseURL': 'https://tomatodisease-edc98-default-rtdb.firebaseio.com'
    })
    dir = db.reference()
    print(dir.get())


def detect_disease_of_tomato(image):
    net= cv2.dnn.readNetFromDarknet('static/models/imageModel/yolov4_custom_of_custom.cfg','static/models/imageModel/yolov4_custom_last.weights')
    classes = []
    with open('static/models/imageModel/classes.names') as f:
        classes = [line.strip() for line in f.readlines()]
    wt,ht,_ =image.shape
    blob = cv2.dnn.blobFromImage(image,1/255,(416,416),(0,0,0),swapRB=True,crop=False)
    net.setInput(blob)
    last_layer = net.getUnconnectedOutLayersNames()
    layer_out = net.forward(last_layer)


    boxes = []
    confidences = []
    class_ids = []

    for output in layer_out:
        for detection in output:
            score = detection[5:]
            class_id =  np.argmax(score)
            confidence = score[class_id]
            if confidence > .5:
                center_x = int(detection[0] * wt)
                center_y = int(detection[1] * ht)
                w = int(detection[2]*wt)
                h = int(detection[3]*ht)
            
                x= int(center_x-w/2)
                y = int(center_y-h/2)
            
                boxes.append([x,y,w,h])
                confidences.append((float(confidence)))
                class_ids.append(class_id)


    indexes = cv2.dnn.NMSBoxes(boxes,confidences,0.3,0.9)
    font = cv2.FONT_HERSHEY_PLAIN
    colors = np.random.uniform(0,255,size=(len(boxes),3))


    
    label_and_confidence_dict = {'label':[],'confidence':[]}

    if(len(indexes) != 0):
        for i in indexes.flatten():
            x,y,w,h = boxes[i]
            label = str(classes[class_ids[i]])
            confidence = str(round(confidences[i],2))
            label_and_confidence_dict['label'].append(label)
            label_and_confidence_dict['confidence'].append(confidence)
            color = colors[i]
            cv2.rectangle(image,(x,y),(x+w,y+h),color,2)
            cv2.putText(image,label + ' '+confidence,(x,y+20),font,2,(0,0,0),2)
        
    

    return image,label_and_confidence_dict
