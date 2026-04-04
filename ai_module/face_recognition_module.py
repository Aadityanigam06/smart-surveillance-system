import cv2
import face_recognition
import os
import numpy as np
from database_handler import log_event
import time

known_encodings = []
known_names = []

known_faces_dir = "ai_module/known_faces"

print("Loading known faces...")

# Load and encode known faces
for file in os.listdir(known_faces_dir):
    image_path = os.path.join(known_faces_dir, file)

    image = face_recognition.load_image_file(image_path)
    encodings = face_recognition.face_encodings(image)

    if len(encodings) > 0:
        encoding = encodings[0]
        known_encodings.append(encoding)

        # Extract name (aaditya_1.jpg → aaditya)
        name = file.split('_')[0]
        known_names.append(name)

        print(f"Loaded: {name}")
    else:
        print(f"❌ No face found in {file}")

print("Known faces:", known_names)


# Start webcam
cap = cv2.VideoCapture(0)
last_logged = {}

while True:
    ret, frame = cap.read()

    if not ret:
        print("Camera error")
        break

    small_frame = cv2.resize(frame, (0, 0), fx=0.5, fy=0.5)
    rgb_small = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)

    face_locations = face_recognition.face_locations(rgb_small)
    face_encodings = face_recognition.face_encodings(rgb_small, face_locations)

    current_time = time.time()

    detected_names = []   # 🔥 store names first

    for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):

        name = "Unknown"
        status = "unknown"

        if len(known_encodings) > 0:
            face_distances = face_recognition.face_distance(known_encodings, face_encoding)
            best_match_index = np.argmin(face_distances)

            if face_distances[best_match_index] < 0.6:
                name = known_names[best_match_index]
                status = "known"

        detected_names.append((name, status))   # 🔥 store result

        # Draw rectangle
        top *= 2
        right *= 2
        bottom *= 2
        left *= 2

        cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
        cv2.putText(frame, name, (left, top - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

    # 🔥 LOGGING OUTSIDE LOOP
    for name, status in detected_names:
        if name not in last_logged or (current_time - last_logged[name]) > 5:
            log_event(name, status)
            last_logged[name] = current_time

    cv2.imshow("Face Recognition", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()