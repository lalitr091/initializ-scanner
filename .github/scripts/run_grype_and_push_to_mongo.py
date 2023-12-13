import subprocess
import pymongo
import json

# Read image names from the image.txt file in the config folder
image_file_path = "public.ecr.aws/initializ/kubectl"
# try:
#     with open(image_file_path, "r") as file:
#         image_names = [line.strip() for line in file.readlines()]
# except FileNotFoundError:
#     print(f"Error: Image file '{image_file_path}' not found.")
#     exit(1)

# Connect to MongoDB
client = pymongo.MongoClient("mongodb+srv://ratnesh:ratnesh@cluster0.3ka0uom.mongodb.net/cve_db?retryWrites=true&w=majority")
db = client.cve_db
collection = db.cve_list

# for image_name in image_names:
#     try:
        # Run Grype for each image and store the output in a variable
        grype_output = subprocess.run(["grype", image_name, "-o", "json"], capture_output=True, text=True, check=True)

        # Print Grype output
        print(grype_output.stdout)

        # Parse Grype output and insert into MongoDB
        grype_data = json.loads(grype_output.stdout)
        matches = grype_data.get("matches", [])

        for match in matches:
            # Include the image name in the MongoDB document
            match["image"] = image_name
            collection.insert_one(match)

        if not matches:
            # Insert a message into MongoDB if no vulnerabilities found
            collection.insert_one({"image": image_name, "message": "No vulnerabilities found."})
            print(f"No vulnerability matches found in Grype output for {image_name}. Message inserted into MongoDB.")
        else:
            print(f"Data inserted into MongoDB for {image_name} successfully.")
    except subprocess.CalledProcessError as e:
        print(f"Error running Grype for {image_name}: {e}")
    except json.JSONDecodeError as e:
        print(f"Error parsing Grype output for {image_name}: {e}")
    except Exception as e:
        print(f"Error for {image_name}: {e}")
