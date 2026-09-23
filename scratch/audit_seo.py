import os
import re
from html.parser import HTMLParser

workspace_dir = "/Users/erenkonca/Desktop/nevra website"

html_files = [f for f in os.listdir(workspace_dir) if f.endswith(".html") and f != "nevracms.html"]

class SEOParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title_content = []
        self.in_title = False
        self.meta_desc = None
        self.viewport = None
        self.canonical = None
        self.h1_count = 0
        self.images = [] # list of dicts with id, class, alt
        self.og_title = None
        self.og_desc = None
        self.og_image = None
        
    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        
        if tag == 'title':
            self.in_title = True
            
        elif tag == 'meta':
            name = attrs_dict.get('name', '').lower()
            prop = attrs_dict.get('property', '').lower()
            content = attrs_dict.get('content', '')
            
            if name == 'description':
                self.meta_desc = content
            elif name == 'viewport':
                self.viewport = content
            elif prop == 'og:title':
                self.og_title = content
            elif prop == 'og:description':
                self.og_desc = content
            elif prop == 'og:image':
                self.og_image = content
                
        elif tag == 'link':
            rel = attrs_dict.get('rel', '').lower()
            if rel == 'canonical':
                self.canonical = attrs_dict.get('href', '')
                
        elif tag == 'h1':
            self.h1_count += 1
            
        elif tag == 'img':
            self.images.append({
                'id': attrs_dict.get('id', ''),
                'class': attrs_dict.get('class', ''),
                'alt': attrs_dict.get('alt')
            })
            
    def handle_endtag(self, tag):
        if tag == 'title':
            self.in_title = False
            
    def handle_data(self, data):
        if self.in_title:
            self.title_content.append(data)

def analyze_seo(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()
        
    parser = SEOParser()
    parser.feed(html)
    
    report = []
    score = 100
    
    # 1. Title Tag (15 points)
    title_text = "".join(parser.title_content).strip()
    if not title_text:
        score -= 15
        report.append(("[CRITICAL] Title tag is missing or empty", -15))
    else:
        title_len = len(title_text)
        if title_len < 30 or title_len > 70:
            score -= 5
            report.append((f"[WARNING] Title length is not optimal ({title_len} chars, should be 30-70)", -5))
            
    # 2. Meta Description (20 points)
    if not parser.meta_desc:
        score -= 20
        report.append(("[CRITICAL] Meta Description tag is missing", -20))
    elif not parser.meta_desc.strip():
        score -= 20
        report.append(("[CRITICAL] Meta Description content is empty", -20))
    else:
        desc_len = len(parser.meta_desc.strip())
        if desc_len < 100 or desc_len > 160:
            score -= 5
            report.append((f"[WARNING] Meta Description length is not optimal ({desc_len} chars, should be 100-160)", -5))
            
    # 3. Viewport (10 points)
    if not parser.viewport:
        score -= 10
        report.append(("[CRITICAL] Viewport meta tag is missing (critical for mobile SEO)", -10))
        
    # 4. Canonical Tag (10 points)
    if not parser.canonical:
        score -= 10
        report.append(("[CRITICAL] Canonical URL link tag is missing", -10))
        
    # 5. Heading 1 (15 points)
    if parser.h1_count == 0:
        score -= 15
        report.append(("[CRITICAL] Page is missing an H1 heading", -15))
    elif parser.h1_count > 1:
        score -= 5
        report.append((f"[WARNING] Multiple H1 headings found ({parser.h1_count}), should only have one per page", -5))
        
    # 6. Image Alts (15 points)
    missing_alt = 0
    valid_images = 0
    for img in parser.images:
        # Skip preloader or hidden tracking pixels if empty alt
        if img.get('id') == 'PreloaderLogo' or 'preloader' in str(img.get('class', '')):
            continue
        valid_images += 1
        if img.get('alt') is None or not img.get('alt', '').strip():
            missing_alt += 1
            
    if valid_images > 0 and missing_alt > 0:
        penalty = min(missing_alt * 3, 15)
        score -= penalty
        report.append((f"[WARNING] {missing_alt} out of {valid_images} images are missing alt descriptive text", -penalty))
        
    # 7. Open Graph (15 points)
    missing_og = 0
    if not parser.og_title: missing_og += 5
    if not parser.og_desc: missing_og += 5
    if not parser.og_image: missing_og += 5
    
    if missing_og > 0:
        score -= missing_og
        report.append((f"[WARNING] Missing Open Graph social sharing tags (-{missing_og} pts)", -missing_og))
        
    score = max(score, 0)
    return score, report

total_score = 0
file_count = 0
audit_results = {}

for filename in html_files:
    filepath = os.path.join(workspace_dir, filename)
    score, report = analyze_seo(filepath)
    audit_results[filename] = {"score": score, "report": report}
    total_score += score
    file_count += 1

avg_score = round(total_score / file_count) if file_count > 0 else 0

print("--- SEO AUDIT RESULTS ---")
for file, res in sorted(audit_results.items()):
    print(f"File: {file} | Score: {res['score']}/100")
    for r in res['report']:
        print(f"  {r[0]} ({r[1]} pts)")
print(f"Average Site SEO Score: {avg_score}/100")
