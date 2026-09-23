import os

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) # parent of scratch
print("Base directory:", base_dir)
print("Files in base directory:", os.listdir(base_dir))

potential_file = os.path.join(base_dir, "nevracms.html")
print("Does nevracms.html exist?", os.path.exists(potential_file))
