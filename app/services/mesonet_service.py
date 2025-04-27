import subprocess
import os

def detect_deepfake_image_mesonet(image_path):
    base_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'mesonet')
    script_path = os.path.join(base_dir, 'example.py')
    # The script expects an image path as argument
    result = subprocess.run(
        ['python', script_path, '--image', image_path],
        capture_output=True, text=True
    )
    return result.stdout.strip()

def detect_deepfake_video_mesonet(video_path):
    base_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'mesonet')
    script_path = os.path.join(base_dir, 'pipeline.py')
    # The script expects a video path as argument
    result = subprocess.run(
        ['python', script_path, '--video', video_path],
        capture_output=True, text=True
    )
    return result.stdout.strip() 