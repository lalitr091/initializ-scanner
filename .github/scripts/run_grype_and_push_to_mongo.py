# .workflow/script/run_grype_and_push_to_mongo.py

import subprocess
import pymongo
import json

# Run Grype and store the output in a variable
grype_output = subprocess.run(["grype", "alpine:latest", "-o", "json"], capture_output=True, text=True)

# Print Grype output
print(grype_output.stdout)

# Connect to MongoDB
client = pymongo.MongoClient("mongodb+srv://ratnesh:ratnesh@cluster0.3ka0uom.mongodb.net/cve_db?retryWrites=true&w=majority")
db = client.cve_db
collection = db.cve_list

# Parse Grype output and insert into MongoDB
try:
    cve_data = json.loads(grype_output.stdout)
    
    if isinstance(cve_data, list):
        # If Grype output is a list, insert each item separately
        for item in cve_data:
            collection.insert_one(item)
    elif isinstance(cve_data, dict):
        # If Grype output is a dictionary, insert it as a single document
        collection.insert_one(cve_data)

    print("Data inserted into MongoDB successfully.")
except json.JSONDecodeError as e:
    print(f"Error parsing Grype output: {e}")
except Exception as e:
    print(f"Error inserting data into MongoDB: {e}")
