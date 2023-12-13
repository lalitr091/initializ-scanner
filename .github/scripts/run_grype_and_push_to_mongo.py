# .workflow/script/run_grype_and_push_to_mongo.py

import subprocess
import pymongo
import json

# Run Grype and store the output in a variable
grype_output = subprocess.run(["grype", "ubuntu:latest", "-o", "json"], capture_output=True, text=True)

# Print Grype output
print(grype_output.stdout)

# Connect to MongoDB
client = pymongo.MongoClient("mongodb+srv://ratnesh:ratnesh@cluster0.3ka0uom.mongodb.net/cve_db?retryWrites=true&w=majority")
db = client.cve_db
collection = db.cve_list

# Parse Grype output and insert into MongoDB
try:
    # Insert a message into MongoDB if no vulnerabilities found
    if not grype_output.stdout:
        collection.insert_one({"message": "No vulnerabilities found."})
        print("No vulnerability matches found in Grype output. Message inserted into MongoDB.")
    else:
        grype_data = json.loads(grype_output.stdout)

        # Insert each vulnerability match separately
        matches = grype_data.get("matches", [])
        for match in matches:
            collection.insert_one(match)

        print("Data inserted into MongoDB successfully.")
except json.JSONDecodeError as e:
    print(f"Error parsing Grype output: {e}")
except Exception as e:
    print(f"Error inserting data into MongoDB: {e}")
