from rembg import remove
from PIL import Image
import os

input_path = "/home/ravi/Downloads/WhatsApp Image 2026-06-14 at 9.43.21 AM.jpeg"
output_path = "/home/ravi/radhe_insurance/frontend/public/logo-no-bg.png"

def process_logo():
    if not os.path.exists(input_path):
        print(f"Error: {input_path} not found")
        return

    print("Removing background... Please wait.")
    input_image = Image.open(input_path)
    output_image = remove(input_image)
    
    # Crop to content to remove extra space
    bbox = output_image.getbbox()
    if bbox:
        output_image = output_image.crop(bbox)
        
    output_image.save(output_path)
    print(f"Success! Logo saved to {output_path}")

if __name__ == "__main__":
    process_logo()
