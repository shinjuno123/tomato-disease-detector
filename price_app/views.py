from django.shortcuts import render

import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
from django.http.response import JsonResponse
from keras.models import Sequential
from keras.layers import Dense
from sklearn.model_selection import train_test_split
from keras.callbacks import ModelCheckpoint
from keras.models import load_model
from sklearn.preprocessing import MinMaxScaler
from keras.layers import LSTM, Dropout
import numpy
from django.views.decorators.csrf import csrf_exempt
import multiprocessing as mp
import random
import math
# Create your views here.
# 여기는 서버에서 처리하는 부분이야
@csrf_exempt
def price(requests):
    print("재신호")
    realprice_01,realprice_02,realprice_03,date,d_arr_01,d_arr_02,d_arr_03=read_firebase(requests)
    dic = {'date':date,'realprice_01':realprice_01,'realprice_02':realprice_02,'realprice_03':realprice_03}
    if requests.method == "POST":
        pre_01,pre_02,pre_03 = get_pre_price(d_arr_01,d_arr_02,d_arr_03)
        dic = {'pre_01': round(pre_01,-1), 'pre_02':round(pre_02,-1), 'pre_03':round(pre_03,-1)}
        return JsonResponse(dic)
    
    return render(requests,'tomato_price.html',dic) #dic


def read_firebase(requests):

    if not firebase_admin._apps:
        cred = credentials.Certificate('static/tomato_disease_recognition_app/id.json')
        firebase_admin.initialize_app(cred,{
            
            'databaseURL': 'https://tomatodisease-edc98-default-rtdb.firebaseio.com'
        })
        requests.session['cred']  = True

    db_array=db.reference('tomato_price').get()
    
    d_arr_01=[] #모델에 input할 배열
    d_arr_02=[]
    d_arr_03=[]
    data_date=[]
    for i in range(0,50):
        d_arr_01.append(db_array[i]['도매-상'])
        d_arr_02.append(db_array[i]['도매-중'])
        d_arr_03.append(db_array[i]['소매-상'])
        data_date.append(db_array[i]['날짜'])
    return read_ten(d_arr_01,d_arr_02,d_arr_03,data_date)

def read_ten(d_arr_01,d_arr_02,d_arr_03,data_date):
    ten_array_01=[] #테이블에 표시할 날짜. 가격 배열
    ten_array_02=[]
    ten_array_03=[]
    ten_array_d=[]
    for i in range(40,50):
        ten_array_01.append(d_arr_01[i])
        ten_array_02.append(d_arr_02[i])
        ten_array_03.append(d_arr_03[i])
        ten_array_d.append(data_date[i])
    return ten_array_01,ten_array_02,ten_array_03,ten_array_d,d_arr_01,d_arr_02,d_arr_03

def get_pre_price(d_arr_01,d_arr_02,d_arr_03):

    pre_price_01=predict_price(d_arr_01)
    pre_price_02=predict_price(d_arr_02)
    pre_price_03=predict_price(d_arr_03)
    return pre_price_01,pre_price_02,pre_price_03

def predict_price(data_array_01):
    look_back=10
    batch_size=2
    dataset=[]
    dataset = [data_array_01[i * 1:(i + 1)] for i in range(len(data_array_01))] 
    dataset=numpy.array(dataset)
    def create_dataset(signal_data, look_back):  
        x_arr, y_arr = [], []
        i=1
        for i in range(1,len(signal_data) - look_back):
            x_arr.append(signal_data[i:(i+look_back), 0])
            y_arr.append(signal_data[i+look_back, 0])
        x_arr = numpy.array(x_arr)
        print(x_arr)
        x_arr = numpy.reshape(x_arr, (x_arr.shape[0], x_arr.shape[1], 1))
        return x_arr, numpy.array(y_arr)
    scaler = MinMaxScaler(feature_range=(0, 1))  
    trade_count = scaler.fit_transform(dataset[1:,0:1])  # 학습을 위해 데이터를 0~1의 값으로 정규화한다.
    test = trade_count[int(len(trade_count) * 0):-1]
    x_test, y_test = create_dataset(test, look_back)  
    #여기부터 테스트 출력
    model = load_model('static/models/priceModel/trade_count_save_state_lstm_train.hdf5')
    predictions = model.predict(x_test, batch_size)
    real_predictions = scaler.inverse_transform(predictions)  # 0~1의 값으로 정규화된 값을 원래의 크기로 되돌린다.  
    return(int(real_predictions[-1]))