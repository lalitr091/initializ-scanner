# .workflow/script/run_grype_and_push_to_mongo.py

import subprocess
import pymongo
import json

# Run Grype and store the output in a variable
grype_output = subprocess.run(["grype", "public.ecr.aws/t4s8c0c3/go:latest", "-o", "json"], capture_output=True, text=True)


# Print Grype output
print(grype_output.stdout)

# Connect to MongoDB
client = pymongo.MongoClient("mongodb+srv://ratnesh:ratnesh@cluster0.3ka0uom.mongodb.net/cve_db?retryWrites=true&w=majority")
db = client.cve_db
collection = db.cve_list

# Parse Grype output and insert into MongoDB
try:
    grype_data = json.loads(grype_output.stdout)

    if "matches" in grype_data:
        matches = grype_data["matches"]

        for match in matches:
            # Insert each vulnerability match separately
            collection.insert_one(match)

        print("Data inserted into MongoDB successfully.")
    else:
        print("No vulnerability matches found in Grype output.")
except json.JSONDecodeError as e:
    print(f"Error parsing Grype output: {e}")
except Exception as e:
    print(f"Error inserting data into MongoDB: {e}")
