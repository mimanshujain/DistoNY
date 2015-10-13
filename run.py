# coding: utf-8
import cPickle
import xlrd
from flask import Flask, render_template, jsonify, request
import os
import numpy as np
import re
import simplejson
# from bson.json_util import dumps
import json
# import requests
app = Flask(__name__)

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response

@app.route('/', methods=['GET'])
def index():
    path = os.getcwd()
    return render_template(path+'/index.html')

# @app.route('/bank', methods=['GET'])
# def bank():
# 	return render_template('bank.html')
#
# @app.route('/merchant', methods=['GET'])
# def get_merchant():
# 	r = requests.get("http://api.reimaginebanking.com/merchants?key=b3ecb3d19e91b8fa639d3f798dbbfaca")
# 	return json.dumps(r.text)

# @app.route('/get_user_purchase_info', methods=['POST', 'GET'])
# def get_user_purchase_info():
# 	#Get account IDs, customer names from customer (get customer by account ID), purchases on account, and the locations of the purchases from the merchant. money spent, etc.
# 	account_id = request.form['account_id']
# 	print account_id
# 	Purchase = db.Purchase
# 	a = list(Purchase.find({'payer_id':str(account_id)}))
# 	for item in a:
# 		doc = db.Merchant.find_one({'_id' : item['merchant_id']})
# 		#print type(doc['geocode'])
# 		if doc != None and 'geocode' in doc:
# 			print  doc['geocode']
# 			lat = doc['geocode']['lat']
# 			lng = doc['geocode']['lng']
# 			item['lat'] = lat
# 			item['lng'] = lng
# 			item['name'] = doc['name']

	
	# print a
	# return dumps(a)

# @app.route('/get_branches', methods=['GET'])
# def get_branches():
# 	Branch = db.Branch
# 	cursor = Branch.find()
# 	return dumps(cursor)

def generate_JSON(workbook, type1):
    worksheet = workbook.sheet_by_name('Data')
    num_rows = worksheet.nrows
    data = []
    header = worksheet.row(0)
    year_dict = {}
    for i in range(7,header.__len__()):
        cell = worksheet.cell_value(0, i)
        length = len(cell)
        type = cell[length - 1:]
        if type == 'D':
            year = cell[length-4:length-1]
            year = 1800 + int(year)
            year_dict[year] = i
            # print year
    temp = {}
    curr_row = 1
    while curr_row < (num_rows):
        row = worksheet.row(curr_row)

        county = row[0]
        # temp1["County"] = str(county.value)
        value = []
        for year in year_dict:
            # if year > 1999 and year < 2004:
            val = str(row[int(year_dict[year])])
            val = re.sub('number|:','',val)
            if type1 == "Poverty":
                val = float(val)/1000
            if type1 == "Health":
                val = float(val)*1000
            if type1 == "Crime" and float(val) > 10000:
                val = float(val)/1000
            if type1 == "Crime" and float(val) < 10000 and float(val) > 1000:
                val = float(val)/10
            value.append([str(year), val])

        # data[curr_row] = {}
        # temp2 = {}
        # temp2[type] = ed_value
        # data.append((temp1,temp2))
        # data = data + "{"+'count : '+str(county) +", Edu_Value : " + ed_value + " },"
        temp[str(county.value)] = value
        curr_row += 1

    # json_data = json.dumps(data)
    return temp
    # cPickle.dump(json_data, open("json_data.json", "w"))


if __name__ == '__main__':
    path = os.getcwd()
    path += "/data/"
    workbook_pov = xlrd.open_workbook(path+"Poverty.xls")
    poverty_data = generate_JSON(workbook_pov, "Poverty")
    workbook_health = xlrd.open_workbook(path+"Health.xls")
    health_data = generate_JSON(workbook_health, "Health")
    workbook_Edu = xlrd.open_workbook(path+"Education.xls")
    edu_data = generate_JSON(workbook_Edu, "Education")
    workbook_Crime = xlrd.open_workbook(path+"Crime.xls")
    crime_data = generate_JSON(workbook_Crime, "Crime")
    workbook_Bank = xlrd.open_workbook(path+"Banking.xls")
    bank_data = generate_JSON(workbook_Bank, "Banking")
    data = []
    i = 0
    # if poverty_data.__len__() == health_data.__len__() and health_data.__len__() == edu_data.__len__():
    for county in poverty_data:
        temp = {}
        temp["name"] = str(county)
        temp["region"] = str(county)
        # temp["population"] = health_data[county] # Circle
        # temp["lifeExpectancy"] = poverty_data[county] # y -axis
        # temp["income"] = edu_data[county] # x -axis
        temp["health"] = health_data[county] # Circle
        temp["poverty"] = poverty_data[county] # y -axis
        temp["education"] = edu_data[county] # x -axis
        temp["crime"] = crime_data[county]
        temp["banking"] = bank_data[county]
        data.append(temp)
        # if i > 0:
        #     break
        # break
        # i += 1

    simplejson.dump(data, open("Data.json", "w"))
    # app.run(debug=True)







    # worksheet = workbook.sheet_by_name('Data')
    # num_rows = worksheet.nrows
    # data = []
    # header = worksheet.row(0)
    # year_dict = {}
    # for i in range(1,header.__len__()):
    #     cell = worksheet.cell_value(0, i)
    #     length = len(cell)
    #     type = cell[length - 1:]
    #     if type == 'D':
    #         year = cell[length-4:length-1]
    #         year = 1800 + int(year)
    #         year_dict[year] = i
    #         # print year
    #
    # curr_row = 1
    # while curr_row < (num_rows):
    #     row = worksheet.row(curr_row)
    #     temp1 = {}
    #     county = row[0]
    #     temp1["County"] = str(county.value)
    #     ed_value = []
    #     for year in year_dict:
    #         val = str(row[int(year_dict[year])])
    #         ed_value.append([str(year),re.sub('number|:','',val)])
    #
    #     # data[curr_row] = {}
    #     temp2 = {}
    #     temp1["Heath_ValueS"] = ed_value
    #     data.append((temp1))
    #     # data = data + "{"+'count : '+str(county) +", Edu_Value : " + ed_value + " },"
    #     curr_row += 1
    #
    # json_data = json.dumps(data)