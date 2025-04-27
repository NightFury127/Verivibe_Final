import torch
import torch.nn as nn
import cv2
import numpy as np
import sys
import traceback
from PIL import Image
from helper_codes.transform import transform_xception
from helper_codes.xception import xception

def preprocess_image(image_path):
    """Preprocess image for the model."""
    try:
        # Load and resize image
        image = cv2.imread(image_path)
        if image is None:
            raise ValueError(f"Could not load image from {image_path}")
        
        # Convert BGR to RGB
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        # Convert to PIL Image and resize
        image = Image.fromarray(image)
        
        # Apply transformations
        preprocess = transform_xception['test']
        preprocessed_image = preprocess(image)
        
        # Add batch dimension
        preprocessed_image = preprocessed_image.unsqueeze(0)
        return preprocessed_image
    except Exception as e:
        print(f"Error in preprocess_image: {str(e)}")
        print(traceback.format_exc())
        raise

def load_model(model_path, num_classes):
    """Load the model from the given path."""
    try:
        print(f"Loading model from {model_path}")
        device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        print(f"Using device: {device}")
        
        # Create model
        model = xception(num_classes=num_classes)
        print("Model created successfully")
        
        # Load state dict with weights_only=False since we trust our own model file
        print("Loading state dict...")
        state_dict = torch.load(model_path, map_location=device, weights_only=False)
        print(f"Loaded state dict type: {type(state_dict)}")
        
        if hasattr(state_dict, 'state_dict'):
            state_dict = state_dict.state_dict()
        elif isinstance(state_dict, dict):
            if 'state_dict' in state_dict:
                state_dict = state_dict['state_dict']
            elif 'model_state_dict' in state_dict:
                state_dict = state_dict['model_state_dict']
        
        print("Processing state dict...")
        # Remove module prefix if present
        new_state_dict = {}
        for k, v in state_dict.items():
            name = k.replace('module.', '') if k.startswith('module.') else k
            new_state_dict[name] = v
        
        # Load the weights
        try:
            model.load_state_dict(new_state_dict)
            print("Weights loaded successfully")
        except Exception as e:
            print(f"Error loading state dict: {str(e)}")
            print("Attempting to load with strict=False...")
            model.load_state_dict(new_state_dict, strict=False)
            print("Weights loaded successfully with strict=False")
        
        model.eval()
        model = model.to(device)
        return model, device
    except Exception as e:
        print(f"Error in load_model: {str(e)}")
        print(traceback.format_exc())
        raise

def main():
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('model', help='Path to the model file')
    parser.add_argument('classes', help='Path to the classes file')
    parser.add_argument('image', help='Path to the image file')
    args = parser.parse_args()

    try:
        print(f"Processing image: {args.image}")
        print(f"Using model: {args.model}")
        print(f"Using classes file: {args.classes}")

        # Load classes
        with open(args.classes, 'r') as f:
            classes = [line.strip() for line in f.readlines()]
            if not classes:
                raise ValueError("Classes file is empty")
            print(f"Loaded {len(classes)} classes: {classes}")

        # Load model
        model, device = load_model(args.model, len(classes))

        # Preprocess image
        input_tensor = preprocess_image(args.image)
        input_tensor = input_tensor.to(device)

        # Predict
        print("Running prediction...")
        with torch.no_grad():
            output = model(input_tensor)
            probabilities = nn.Softmax(dim=1)(output)
        
        # Get predictions
        probs = probabilities[0].cpu().numpy()
        
        # Print results
        print("\nPrediction Results:")
        for i, (class_name, prob) in enumerate(zip(classes, probs), 1):
            print(f"Top {i} =")
            print(f"Class: {class_name}")
            print(f"Probability: {prob * 100:.2f}%")
            
    except Exception as e:
        print(f"Error in main: {str(e)}")
        print(traceback.format_exc())
        sys.exit(1)

if __name__ == '__main__':
    main()
