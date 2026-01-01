#!/usr/bin/env python3
"""
Fix icon and text visibility by adding dark mode variants
"""
import os
import re

# Patterns to fix
REPLACEMENTS = [
    # Icons without dark variants
    (r'className="text-gray-400(\s+[^"]*)"', r'className="text-gray-400 dark:text-gray-500\1"'),
    (r'className="text-gray-500(\s+[^"]*)"', r'className="text-gray-500 dark:text-gray-400\1"'),
    (r'className="text-gray-600(\s+[^"]*)"', r'className="text-gray-600 dark:text-gray-400\1"'),
    (r'className="text-gray-700(\s+[^"]*)"', r'className="text-gray-700 dark:text-gray-300\1"'),

    # Simple cases with no additional classes
    (r'className="text-gray-400"', r'className="text-gray-400 dark:text-gray-500"'),
    (r'className="text-gray-500"', r'className="text-gray-500 dark:text-gray-400"'),
    (r'className="text-gray-600"', r'className="text-gray-600 dark:text-gray-400"'),
    (r'className="text-gray-700"', r'className="text-gray-700 dark:text-gray-300"'),
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
