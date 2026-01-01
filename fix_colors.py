#!/usr/bin/env python3
"""
Fix all remaining hardcoded blue, emerald, teal, cyan colors to use primary colors
"""
import os
import re

# Color mappings from hardcoded to primary
COLOR_MAPPINGS = {
    # Gradients
    r'from-blue-(\d+)': r'from-primary-\1',
    r'to-blue-(\d+)': r'to-primary-\1',
    r'from-emerald-(\d+)': r'from-primary-\1',
    r'to-emerald-(\d+)': r'to-primary-\1',
    r'from-teal-(\d+)': r'from-primary-\1',
    r'to-teal-(\d+)': r'to-primary-\1',
    r'from-cyan-(\d+)': r'from-primary-\1',
    r'to-cyan-(\d+)': r'to-primary-\1',
    r'from-indigo-(\d+)': r'from-primary-\1',
    r'to-indigo-(\d+)': r'to-primary-\1',
    r'from-violet-(\d+)': r'from-primary-\1',
    r'to-violet-(\d+)': r'to-primary-\1',

    # Backgrounds
    r'bg-blue-(\d+)': r'bg-primary-\1',
    r'bg-emerald-(\d+)': r'bg-primary-\1',
    r'bg-teal-(\d+)': r'bg-primary-\1',
    r'bg-cyan-(\d+)': r'bg-primary-\1',
    r'bg-indigo-(\d+)': r'bg-primary-\1',

    # Text colors
    r'text-blue-(\d+)': r'text-primary-\1',
    r'text-emerald-(\d+)': r'text-primary-\1',
    r'text-teal-(\d+)': r'text-primary-\1',
    r'text-cyan-(\d+)': r'text-primary-\1',
    r'text-indigo-(\d+)': r'text-primary-\1',

    # Borders
    r'border-blue-(\d+)': r'border-primary-\1',
    r'border-emerald-(\d+)': r'border-primary-\1',
    r'border-teal-(\d+)': r'border-primary-\1',
    r'border-cyan-(\d+)': r'border-primary-\1',
    r'border-indigo-(\d+)': r'border-primary-\1',

    # Ring/Focus
    r'ring-blue-(\d+)': r'ring-primary-\1',
    r'ring-emerald-(\d+)': r'ring-primary-\1',
    r'focus:ring-blue-(\d+)': r'focus:ring-primary-\1',
    r'focus:ring-emerald-(\d+)': r'focus:ring-primary-\1',
}

def fix_file(filepath):
    """Fix colors in a single file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    changes_made = []

    for pattern, replacement in COLOR_MAPPINGS.items():
        matches = re.findall(pattern, content)
        if matches:
            content = re.sub(pattern, replacement, content)
            changes_made.append(f"{pattern} -> {replacement} ({len(matches)} occurrences)")

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return changes_made
    return None

def main():
    admin_dir = '/home/user/bhub-re-f/src/pages/admin'
    total_files_fixed = 0

    for root, dirs, files in os.walk(admin_dir):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                filepath = os.path.join(root, file)
                changes = fix_file(filepath)
                if changes:
                    total_files_fixed += 1
                    print(f"\n✓ Fixed {filepath}")
                    for change in changes:
                        print(f"  - {change}")

    print(f"\n{'='*60}")
    print(f"✓ Total files fixed: {total_files_fixed}")
    print(f"{'='*60}")

if __name__ == '__main__':
    main()
