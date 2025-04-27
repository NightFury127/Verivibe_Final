from flask import Blueprint, request, jsonify
import os
import tempfile
from app.services.mesonet_service import detect_deepfake_image_mesonet, detect_deepfake_video_mesonet
from app.services.fact_checker import FactChecker

api_bp = Blueprint('api', __name__)
fact_checker = FactChecker()

@api_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'message': 'VeriVibe API is running'})

@api_bp.route('/deepfake_image', methods=['POST'])
def deepfake_image_detection():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        file = request.files['file']
        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as tmp:
            file.save(tmp.name)
            result = detect_deepfake_image_mesonet(tmp.name)
        os.unlink(tmp.name)
        return jsonify({'status': 'success', 'result': result})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@api_bp.route('/deepfake_video', methods=['POST'])
def deepfake_video_detection():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        file = request.files['file']
        with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as tmp:
            file.save(tmp.name)
            result = detect_deepfake_video_mesonet(tmp.name)
        os.unlink(tmp.name)
        return jsonify({'status': 'success', 'result': result})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@api_bp.route('/check', methods=['POST'])
def check_claim():
    try:
        data = request.get_json()
        if not data or 'claim' not in data:
            return jsonify({'error': 'No claim provided'}), 400
        claim = data['claim']
        claim_type = data.get('type', 'text')  # 'text' or 'url'
        if claim_type == 'url':
            extracted_text = claim  # Use the URL as is, or add extraction logic if needed
            claim = extracted_text
        results = fact_checker.check_claim(claim)
        return jsonify({'status': 'success', 'data': results})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500 