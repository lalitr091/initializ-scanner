import subprocess
import pymongo
from datetime import datetime
import json
import pytz  # Import the pytz library

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

# Define the Indian Standard Time (IST) timezone
ist_timezone = pytz.timezone("Asia/Kolkata")

for image_name in image_names:
    try:
        # Run Grype for each image and store the output in a variable
        grype_output = subprocess.run(["grype", image_name, "-o", "json"], capture_output=True, text=True, check=True)

        # Parse Grype output and delete existing data in MongoDB
        collection.delete_many({"image": image_name})

        # Insert the vulnerability count into MongoDB with IST timestamp
        grype_data = json.loads(grype_output.stdout)
        vulnerability_count = len(grype_data.get("matches", []))

        # Get the current time in IST
        current_time_ist = datetime.now(ist_timezone).strftime("%d-%m-%Y %H:%M:%S")

        # Insert vulnerability count into MongoDB with IST timestamp
        collection.insert_one({"image": image_name, "timestamp": current_time_ist, "vulnerability_count": vulnerability_count})
        print(f"{vulnerability_count} vulnerabilities found for {image_name}. Count inserted into MongoDB.")

    except subprocess.CalledProcessError as e:
        print(f"Error running Grype for {image_name}: {e}")



# import subprocess
# import pymongo
# import json
# from datetime import datetime

# # Read image names from the image.txt file in the config folder
# image_file_path = "config/image.txt"
# try:
#     with open(image_file_path, "r") as file:
#         image_names = [line.strip() for line in file.readlines()]
# except FileNotFoundError:
#     print(f"Error: Image file '{image_file_path}' not found.")
#     exit(1)

# # Connect to MongoDB
# client = pymongo.MongoClient("mongodb+srv://ratnesh:ratnesh@cluster0.3ka0uom.mongodb.net/cve_db?retryWrites=true&w=majority")
# today_date = datetime.now().strftime("%d-%m-%Y")
# collection_name = f"{today_date}_cve_list"
# db = client.cve_db
# collection = db[collection_name]

# for image_name in image_names:
#     try:
#         # Run Grype for each image and store the output in a variable
#         grype_output = subprocess.run(["grype", image_name, "-o", "json"], capture_output=True, text=True, check=True)

#         # Parse Grype output and delete existing data in MongoDB
#         collection.delete_many({"image": image_name})

#         # Insert the new data into MongoDB with epoch timestamp
#         grype_data = json.loads(grype_output.stdout)
#         matches = grype_data.get("matches", [])
#         for match in matches:
#             # Include the image name, epoch timestamp in the MongoDB document
#             match["image"] = image_name
#             match["timestamp"] = datetime.now().strftime("%d-%m-%Y %H:%M:%S")
#             match["message"] = "Vulnerability found."
#             collection.insert_one(match)

#         if not matches:
#             # Insert a message into MongoDB if no vulnerabilities found
#             collection.insert_one({"image": image_name, "timestamp": datetime.now().strftime("%d-%m-%Y %H:%M:%S"), "message": "No vulnerabilities found."})
#             print(f"No vulnerability matches found in Grype output for {image_name}. Message inserted into MongoDB.")
#         else:
#             print(f"Data inserted into MongoDB for {image_name} successfully, Vulnerability found")
#     except subprocess.CalledProcessError as e:
#         print(f"Error running Grype for {image_name}: {e}")
