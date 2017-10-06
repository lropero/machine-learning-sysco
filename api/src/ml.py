#!c:\Users\Luciano\Anaconda3\envs\sysco\python
import cgi
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import sys

print('Content-Type: application/json\n')

arguments = cgi.FieldStorage()
customer = arguments.getvalue('customer')
if(customer is None):
    sys.exit()

def findLinear(f):
    x = np.array([])
    y = np.array([])
    min = f['date'].min()
    quantity = 0
    for index, row in f.iterrows():
        delta = row['date'] - min
        quantity += row['quantity']
        x = np.append(x, delta.days)
        y = np.append(y, quantity)
    x = x.astype(int)
    return np.linalg.lstsq(np.column_stack((x, np.ones_like(x))), y)[0]

files = [
    'data.csv-6-7-15',
    'data.csv-8-9-15',
    'data.csv-10-11-15',
    'data.csv-12-1-16',
    'data.csv-2-3-16',
    'data.csv-4-5-16'
]

df = pd.read_csv('../data/' + files[0]).query('customer == "' + customer + '"')
for i in range(len(files)):
    if i > 0:
        df = pd.concat([df, pd.read_csv('../data/' + files[i]).query('customer == "' + customer + '"')])

df['date'] = pd.to_datetime(df['date'])
df['quantity'] = pd.to_numeric(df['quantity'].str.replace('-', ''))
df = df.sort_values(['materialId', 'date'])

linear = {}
counts = df['materialId'].value_counts()
ids = counts[counts.map(lambda x: x > 2)].index
for id in ids:
    f = df.query('materialId == ' + str(id))
    linear[id] = findLinear(f)

def h(x, a, b):
    return a * x + b

def plot(df, materialId, a, b):
    f = df.query('materialId == ' + materialId)
    x = np.array([])
    y = np.array([])
    min = f['date'].min()
    quantity = 0
    for index, row in f.iterrows():
        delta = row['date'] - min
        quantity += row['quantity']
        x = np.append(x, delta.days)
        y = np.append(y, quantity)
    x = x.astype(int)
    xx = np.asarray([np.floor(x.min()), np.ceil(x.max())])
    fig, ax = plt.subplots()
    ax.scatter(x, y, color='teal')
    ax.plot(xx, h(xx, a, b), color='red', label='slope ' + str(round(a, 2)) + ' / intercept ' + str(round(b, 2)))
    ax.set_title('Customer ' + customer + ' - ' + 'Material ' + materialId)
    ax.set_xlabel('Days')
    ax.set_ylabel('Quantity')
    ax.legend()
    fig.savefig('../img/' + customer + '-' + materialId + '.png')

for materialId, weights in linear.items():
    plot(df, str(materialId), weights[0], weights[1])

print(linear)
