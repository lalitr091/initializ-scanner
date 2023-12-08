import subprocess
from pymongo import MongoClient
from datetime import datetime
import os
import json

# Read the image name from the file
with open("config/image.txt", "r") as file:
    image_name = file.read().strip()

# Run Grype scan and capture the JSON output
grype_output = subprocess.check_output(["grype", "--json", image_name])
grype_results = json.loads(grype_output.decode("utf-8"))

# Extract CVE information from Grype results
cve_list = []
for package in grype_results.get("artifacts", []):
    for vulnerability in package.get("vulnerabilities", []):
        cve_list.append(vulnerability.get("id"))

# Connect to MongoDB using the secret
mongo_connection_string = os.getenv("MONGODB_CONNECTION_STRING")
client = MongoClient(mongo_connection_string)
db = client["cve_db"]
collection = db["cve_list"]

# Create a document with CVE information
cve_document = {
    "image_name": image_name,
    "cve_list": cve_list,
    "scan_date": datetime.now()
}

# Insert the document into MongoDB
collection.insert_one(cve_document)

# Close MongoDB connection
client.close()
