#!/usr/bin/env python3
"""
Fix remaining dark background inconsistencies across all files.
Updates gray backgrounds to neutral for theme consistency.
"""

import os
import re
from pathlib import Path

# Define the root directory
ROOT_DIR = Path(__file__).parent

# Background replacements
REPLACEMENTS = [
    # Gray backgrounds -> Neutral backgrounds
    (r'dark:bg-gray-900', r'dark:bg-neutral-900'),
    (r'dark:bg-gray-800', r'dark:bg-neutral-800'),
    (r'dark:bg-gray-700', r'dark:bg-neutral-700'),

    # Gray borders -> Neutral borders (for consistency)
    (r'dark:border-gray-900', r'dark:border-neutral-900'),
    (r'dark:border-gray-800', r'dark:border-neutral-800'),
    (r'dark:border-gray-700', r'dark:border-neutral-700'),
    (r'dark:border-gray-600', r'dark:border-neutral-600'),

    # Gray text -> Neutral text (for consistency)
    (r'dark:text-gray-900', r'dark:text-neutral-900'),
    (r'dark:text-gray-800', r'dark:text-neutral-800'),
]

def fix_backgrounds_in_file(file_path: Path) -> int:
    """Apply background fixes to a single file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content
        replacements_count = 0

        for old_pattern, new_pattern in REPLACEMENTS:
            new_content = content.replace(old_pattern, new_pattern)
            if new_content != content:
                count = content.count(old_pattern)
                replacements_count += count
                content = new_content

        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return replacements_count

        return 0
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return 0

def main():
    """Main function to process all files."""
    files_processed = 0
    total_replacements = 0

    # Process all .tsx and .ts files
    for ext in ['tsx', 'ts']:
        for file_path in ROOT_DIR.rglob(f'*.{ext}'):
            # Skip node_modules and build directories
            if 'node_modules' in str(file_path) or 'dist' in str(file_path) or 'build' in str(file_path):
                continue

            replacements = fix_backgrounds_in_file(file_path)
            if replacements > 0:
                files_processed += 1
                total_replacements += replacements
                print(f"✓ {file_path.relative_to(ROOT_DIR)}: {replacements} replacements")

    print(f"\n{'='*60}")
    print(f"Dark background fixes completed!")
    print(f"Files processed: {files_processed}")
    print(f"Total replacements: {total_replacements}")
    print(f"{'='*60}")

if __name__ == '__main__':
    main()
