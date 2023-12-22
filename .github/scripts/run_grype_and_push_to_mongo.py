import subprocess
import pymongo
from datetime import datetime
import json

# Read image names from the image.txt file in the config folder
image_file_path = "config/image.txt"
try:
    with open(image_file_path, "r") as file:
        image_names = [line.strip() for line in file.readlines()]
except FileNotFoundError:
    print(f"Error: Image file '{image_file_path}' not found.")
    exit(1)

# Connect to MongoDB
client = pymongo.MongoClient("mongodb+srv://ratnesh:ratnesh@cluster0.3ka0uom.mongodb.net/cve_db?retryWrites=true&w=majority")
today_date = datetime.now().strftime("%d-%m-%Y")
collection_name = f"{today_date}_cve_list"
db = client.cve_db
collection = db[collection_name]

for image_name in image_names:
    try:
        # Run Grype for each image and store the output in a variable
        grype_output = subprocess.run(["grype", image_name, "-o", "json"], capture_output=True, text=True, check=True)

        # Parse Grype output and delete existing data in MongoDB
        collection.delete_many({"image": image_name})

        # Insert the vulnerability count into MongoDB with epoch timestamp
        grype_data = json.loads(grype_output.stdout)
        vulnerability_count = len(grype_data.get("matches", []))

        if vulnerability_count > 0:
            # Insert vulnerability count into MongoDB
            collection.insert_one({"image": image_name, "timestamp": datetime.now().strftime("%d-%m-%Y %H:%M:%S"),
                                   "vulnerability_count": vulnerability_count})
            print(f"{vulnerability_count} vulnerabilities found for {image_name}. Count inserted into MongoDB.")
        else:
            # Insert a message into MongoDB if no vulnerabilities found
            collection.insert_one({"image": image_name, "timestamp": datetime.now().strftime("%d-%m-%Y %H:%M:%S"),
                                   "message": "No vulnerabilities found."})
            print(f"No vulnerabilities found in Grype output for {image_name}. Message inserted into MongoDB.")

    except subprocess.CalledProcessError as e:
        print(f"Error running Grype for {image_name}: {e}")
