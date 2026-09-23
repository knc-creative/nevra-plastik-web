filepath = "/Users/erenkonca/Desktop/nevra website/scratch/admin_script.js"

with open(filepath, 'r', encoding='utf-8') as f:
    script_content = f.read()

# Let's check matching brackets, braces, and parentheses
stack = []
mapping = {')': '(', '}': '{', ']': '['}
lines = script_content.split('\n')

for i, line in enumerate(lines):
    # Skip simple comments or strings (approximated)
    # We do a basic token parsing
    char_idx = 0
    while char_idx < len(line):
        char = line[char_idx]
        
        # Skip comments
        if char == '/' and char_idx + 1 < len(line) and line[char_idx + 1] == '/':
            break # Rest of the line is comment
            
        if char in '({[':
            stack.append((char, i + 1, char_idx + 1))
        elif char in ')}]':
            if not stack:
                print(f"Error: Unmatched closing character '{char}' at line {i + 1}, column {char_idx + 1}")
            else:
                top, line_num, col_num = stack.pop()
                if top != mapping[char]:
                    print(f"Error: Mismatched opening/closing character. Expected closure for '{top}' (opened at line {line_num}, col {col_num}), but found '{char}' at line {i + 1}, col {char_idx + 1}")
        char_idx += 1

if stack:
    print(f"Error: {len(stack)} unclosed brackets left:")
    for item in stack[:10]:
        print(f"  Unclosed '{item[0]}' opened at line {item[1]}, column {item[2]}")
else:
    print("Brackets are balanced!")
