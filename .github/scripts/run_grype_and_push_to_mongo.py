import subprocess
import json

image_name = "public.ecr.aws/initializ/kubectl"

try:
    # Run Grype for the image and store the output in a variable
    grype_output = subprocess.run(["grype", image_name, "-o", "json"], capture_output=True, text=True, check=True)

    # Print Grype output
    print("Grype stdout:", grype_output.stdout)
    print("Grype stderr:", grype_output.stderr)

    # Parse Grype output
    grype_data = json.loads(grype_output.stdout)
    matches = grype_data.get("matches", [])

    if not matches:
        print(f"No vulnerabilities found in Grype output for {image_name}.")
    else:
        print(f"Vulnerabilities found in Grype output for {image_name}.")

except subprocess.CalledProcessError as e:
    print(f"Error running Grype for {image_name}: {e}")
except json.JSONDecodeError as e:
    print(f"Error parsing Grype output for {image_name}: {e}")
except Exception as e:
    print(f"Error for {image_name}: {e}")
