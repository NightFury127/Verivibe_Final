import os
import sys

# Add the project root to Python path
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, project_root)

from app.services.deepfake_service import detect_deepfake_image

def test_image_checker():
    # Test with a real image
    real_image_path = os.path.join('test_images', 'real', 'real00240.jpg')
    if not os.path.exists(real_image_path):
        print(f"Test image not found at {real_image_path}")
        return

    print("Testing with a real image...")
    result = detect_deepfake_image(real_image_path)
    print("Result:", result)

    # Test with another real image
    real_image_path = os.path.join('test_images', 'real', 'real00772.jpg')
    if not os.path.exists(real_image_path):
        print(f"Test image not found at {real_image_path}")
        return

    print("\nTesting with another real image...")
    result = detect_deepfake_image(real_image_path)
    print("Result:", result)

if __name__ == '__main__':
    # Change to the mesonet directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    test_image_checker() 