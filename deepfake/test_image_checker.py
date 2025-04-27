import os
import sys

# Add the project root to Python path
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, project_root)

from app.services.deepfake_service import detect_deepfake_image

def test_image_checker():
    # Test with a real image
    real_image_path = os.path.join('dataset', 'real', 'example_real.png')
    if not os.path.exists(real_image_path):
        print(f"Test image not found at {real_image_path}")
        return

    print("Testing with a real image...")
    result = detect_deepfake_image(real_image_path)
    print("Result:", result)

    # Test with a fake image
    fake_image_path = os.path.join('dataset', 'fake', 'example_fake.png')
    if not os.path.exists(fake_image_path):
        print(f"Test image not found at {fake_image_path}")
        return

    print("\nTesting with a fake image...")
    result = detect_deepfake_image(fake_image_path)
    print("Result:", result)

if __name__ == '__main__':
    # Change to the deepfake directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    test_image_checker() 