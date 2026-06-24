#!/usr/bin/env python3
"""
Pellazgo JSX Auto-Fixer
Analyzes build errors and automatically fixes them until the build succeeds.
"""

import subprocess
import re
import os
import sys

PROJECT_DIR = os.path.expanduser("~/PellazgoApp")
MAX_ITERATIONS = 20

def run_build():
    """Run npm build and return output"""
    result = subprocess.run(
        ["npm", "run", "build"],
        cwd=PROJECT_DIR,
        capture_output=True,
        text=True,
        shell=True
    )
    return result.stdout + result.stderr

def extract_errors(output):
    """Extract all JSX errors from build output"""
    errors = []
    for line in output.split('\n'):
        match = re.search(r'(src/[^\s]+\.jsx):(\d+):(\d+):\s*(.*)', line)
        if match:
            errors.append({
                'file': match.group(1),
                'line': int(match.group(2)),
                'col': int(match.group(3)),
                'message': match.group(4).strip()
            })
    return errors

def fix_unexpected_else(filepath, line_num):
    """Fix 'Unexpected else' — remove extra closing brace before else"""
    with open(os.path.join(PROJECT_DIR, filepath), 'r') as f:
        lines = f.readlines()
    
    # Remove the line before 'else' if it's just '}'
    if line_num > 0 and lines[line_num-2].strip() == '}':
        del lines[line_num-2]
    
    with open(os.path.join(PROJECT_DIR, filepath), 'w') as f:
        f.writelines(lines)
    print(f"  Fixed: {filepath} — removed extra }} before else")

def fix_unexpected_end(filepath):
    """Fix 'Unexpected end of file' — add closing tags"""
    fullpath = os.path.join(PROJECT_DIR, filepath)
    with open(fullpath, 'r') as f:
        content = f.read()
    
    # Count unclosed tags
    divs_open = len(re.findall(r'<div[^>]*>', content))
    divs_close = len(re.findall(r'</div>', content))
    
    with open(fullpath, 'a') as f:
        for _ in range(divs_open - divs_close):
            f.write('\n</div>')
    
    # Ensure component export
    if 'export default' not in content and 'export {' not in content:
        with open(fullpath, 'a') as f:
            f.write('\n);\n}\n')
    
    print(f"  Fixed: {filepath} — added {divs_open - divs_close} closing divs")

def fix_unexpected_closing(filepath, line_num):
    """Fix 'Unexpected closing tag' — wrong closing tag"""
    fullpath = os.path.join(PROJECT_DIR, filepath)
    with open(fullpath, 'r') as f:
        lines = f.readlines()
    
    line = lines[line_num-1]
    # Replace </form> with </div>
    if '</form>' in line:
        lines[line_num-1] = line.replace('</form>', '</div>')
        with open(fullpath, 'w') as f:
            f.writelines(lines)
        print(f"  Fixed: {filepath} — replaced </form> with </div>")

def fix_expected_gt_but_found_paren(filepath, line_num):
    """Fix 'Expected > but found )' — broken JSX expression"""
    fullpath = os.path.join(PROJECT_DIR, filepath)
    with open(fullpath, 'r') as f:
        lines = f.readlines()
    
    line = lines[line_num-1]
    # Fix onClick handler
    if 'onClick' in line and line.strip().endswith(')'):
        lines[line_num-1] = line.rstrip() + '>\n'
        # Add button text if missing
        if line_num < len(lines) and not lines[line_num].strip().startswith('<'):
            lines.insert(line_num, '                            Go Back\n')
        with open(fullpath, 'w') as f:
            f.writelines(lines)
        print(f"  Fixed: {filepath} — fixed onClick handler")

def fix_hanging_link(filepath):
    """Fix hanging <Link tag"""
    fullpath = os.path.join(PROJECT_DIR, filepath)
    with open(fullpath, 'r') as f:
        content = f.read()
    
    # Find last complete </Link> and truncate
    last_complete = content.rfind('</Link>')
    if last_complete > 0:
        # Find the end of that line
        end_of_line = content.find('\n', last_complete)
        content = content[:end_of_line] + '\n            </div>\n          )}\n        </div>\n      )}\n    </div>\n  );\n}\nexport default Cart;'
        with open(fullpath, 'w') as f:
            f.write(content)
        print(f"  Fixed: {filepath} — removed hanging Link")

def fix_error(error):
    """Fix a single error based on its message"""
    msg = error['message'].lower()
    filepath = error['file']
    line = error['line']
    
    if 'unexpected "else"' in msg or 'unexpected else' in msg:
        fix_unexpected_else(filepath, line)
    elif 'unexpected end of file' in msg:
        fix_unexpected_end(filepath)
    elif 'unexpected closing' in msg:
        fix_unexpected_closing(filepath, line)
    elif 'expected ">" but found ")"' in msg:
        fix_expected_gt_but_found_paren(filepath, line)
    elif 'expected ")" but found "{"' in msg:
        fix_unexpected_end(filepath)
    elif 'cart.jsx' in filepath.lower() and ('expected ">"' in msg or 'hanging' in msg):
        fix_hanging_link(filepath)
    else:
        print(f"  Unknown error at {filepath}:{line} — {msg}")
        return False
    return True

def main():
    print("=" * 60)
    print("PELLAZGO JSX AUTO-FIXER")
    print("=" * 60)
    
    for i in range(MAX_ITERATIONS):
        print(f"\n--- Iteration {i+1} ---")
        output = run_build()
        
        if '✓ built' in output or 'built in' in output:
            print("\n✅ BUILD SUCCEEDED!")
            print(output.split('\n')[-5][:200] if 'built in' not in output else 
                  [l for l in output.split('\n') if 'built in' in l][0])
            return True
        
        errors = extract_errors(output)
        if not errors:
            # Show last error
            error_lines = [l for l in output.split('\n') if 'ERROR' in l or 'error' in l.lower()]
            print("No parsable JSX errors. Last errors:")
            for l in error_lines[-5:]:
                print(f"  {l}")
            return False
        
        # Fix first error
        print(f"Fixing: {errors[0]['file']}:{errors[0]['line']} — {errors[0]['message'][:60]}")
        fix_error(errors[0])
    print(f"\n❌ Could not fix all errors after {MAX_ITERATIONS} iterations")
    return False

if __name__ == '__main__':
    os.chdir(PROJECT_DIR)
    success = main()

    sys.exit(0 if success else 1)
