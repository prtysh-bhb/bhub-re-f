#!/usr/bin/env python3
"""
Find and fix remaining text/icon visibility issues
"""
import os
import re

# Additional patterns for missed elements
REPLACEMENTS = [
    # Fix text-neutral without dark variants
    (r'className="([^"]*\s)?text-neutral-500(\s[^"]*)"', r'className="\1text-neutral-500 dark:text-neutral-400\2"'),
    (r'className="([^"]*\s)?text-neutral-600(\s[^"]*)"', r'className="\1text-neutral-600 dark:text-neutral-400\2"'),
    (r'className="([^"]*\s)?text-neutral-700(\s[^"]*)"', r'className="\1text-neutral-700 dark:text-neutral-300\2"'),
    (r'className="([^"]*\s)?text-neutral-800(\s[^"]*)"', r'className="\1text-neutral-800 dark:text-neutral-200\2"'),

    # Simple cases
    (r'className="text-neutral-500"', r'className="text-neutral-500 dark:text-neutral-400"'),
    (r'className="text-neutral-600"', r'className="text-neutral-600 dark:text-neutral-400"'),
    (r'className="text-neutral-700"', r'className="text-neutral-700 dark:text-neutral-300"'),
    (r'className="text-neutral-800"', r'className="text-neutral-800 dark:text-neutral-200"'),
]

def already_has_dark_text(line):
    """Check if line already has dark:text variant"""
    return 'dark:text' in line

def fix_file(filepath):
    """Fix a single file line by line"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            lines = f.readlines()

        original_lines = lines[:]
        replacements_made = 0

        for i, line in enumerate(lines):
            # Skip if already has dark mode variant
            if already_has_dark_text(line):
                continue

            original_line = line
            for pattern, replacement in REPLACEMENTS:
                line = re.sub(pattern, replacement, line)

            if line != original_line:
                replacements_made += 1
                lines[i] = line

        if lines != original_lines:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.writelines(lines)
            print(f"✓ Fixed {filepath} ({replacements_made} replacements)")
            return True
        return False
    except Exception as e:
        print(f"✗ Error fixing {filepath}: {e}")
        return False

def main():
    """Main function"""
    files_fixed = 0

    # Fix admin pages
    for root, dirs, files in os.walk('src/pages/admin'):
        for file in files:
            if file.endswith('.tsx'):
                filepath = os.path.join(root, file)
                if fix_file(filepath):
                    files_fixed += 1

    print(f"\n✅ Complete! Fixed {files_fixed} files")

if __name__ == '__main__':
    main()
