#!/usr/bin/env python3
"""
Fix dark theme backgrounds to be consistent (bg-neutral-900 instead of bg-gray-900)
"""
import os
import re

REPLACEMENTS = [
    # Replace bg-gray-900 with bg-neutral-900
    (r'\bdark:bg-gray-900\b', r'dark:bg-neutral-900'),
    # Replace bg-gray-800 with bg-neutral-800
    (r'\bdark:bg-gray-800\b', r'dark:bg-neutral-800'),
    # Replace border-gray-800 with border-neutral-800
    (r'\bdark:border-gray-800\b', r'dark:border-neutral-800'),
    # Replace border-gray-700 with border-neutral-700
    (r'\bdark:border-gray-700\b', r'dark:border-neutral-700'),
]

def fix_file(filepath):
    """Fix a single file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content
        replacements_made = 0

        for pattern, replacement in REPLACEMENTS:
            new_content = re.sub(pattern, replacement, content)
            if new_content != content:
                replacements_made += len(re.findall(pattern, content))
                content = new_content

        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
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

    # Fix admin layout components
    for root, dirs, files in os.walk('src/components/layout/admin'):
        for file in files:
            if file.endswith('.tsx'):
                filepath = os.path.join(root, file)
                if fix_file(filepath):
                    files_fixed += 1

    print(f"\n✅ Complete! Fixed {files_fixed} files")

if __name__ == '__main__':
    main()
