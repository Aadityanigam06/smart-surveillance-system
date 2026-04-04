import mysql.connector
from datetime import datetime

#Connection
conn  = mysql.connector.connect(
    host = 'localhost',
    user = 'root',
    password = 'Rain',
    database = 'surveillance'
) 

cursor = conn.cursor()

def log_event(name, status):
    query = "INSERT INTO events (name, status, timestamp) VALUES (%s, %s, %s)"
    
    values = (name, status, datetime.now())
    
    cursor.execute(query, values)
    conn.commit()
    
    print(f"Logged: {name} ({status})")