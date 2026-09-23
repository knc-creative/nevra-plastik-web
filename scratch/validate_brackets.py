import re

html_path = "/Users/erenkonca/Desktop/nevra website/nevracms.html"

with open(html_path, 'r', encoding='utf-8') as f:
    html_content = f.read()

# Extract all script contents
scripts = re.findall(r'<script\b[^>]*>(.*?)</script>', html_content, re.DOTALL)

for i, script_content in enumerate(scripts):
    print(f"Checking script block {i+1}...")
    
    # Remove strings and comments to avoid counting characters inside them
    # Remove single line comments
    clean_js = re.sub(r'//.*$', '', script_content, flags=re.MULTILINE)
    # Remove multi line comments
    clean_js = re.sub(r'/\*.*?\*/', '', clean_js, flags=re.DOTALL)
    # Remove single quoted strings
    clean_js = re.sub(r"'.*?'", "''", clean_js)
    # Remove double quoted strings
    clean_js = re.sub(r'".*?"', '""', clean_js)
    # Remove template literals
    clean_js = re.sub(r'`.*?`', '``', clean_js, flags=re.DOTALL)

    # Count braces
    open_curly = clean_js.count('{')
    close_curly = clean_js.count('}')
    open_round = clean_js.count('(')
    close_round = clean_js.count(')')
    open_square = clean_js.count('[')
    close_square = clean_js.count(']')
    
    print(f"  Curly braces: Open={open_curly}, Close={close_curly} (Diff={open_curly - close_curly})")
    print(f"  Parentheses:  Open={open_round}, Close={close_round} (Diff={open_round - close_round})")
    print(f"  Square brackets: Open={open_square}, Close={close_square} (Diff={open_square - close_square})")
    
    if open_curly != close_curly or open_round != close_round or open_square != close_square:
        print("  WARNING: Mismatched brackets found in this block!")
