#!/usr/bin/env python3
"""
Fix remaining border inconsistencies across all files.
Updates old border patterns to match new neutral border system.
"""

import os
import re
from pathlib import Path

# Define the root directory
ROOT_DIR = Path(__file__).parent

# Border replacements
REPLACEMENTS = [
    # Old primary borders -> neutral borders
    (
        r'border-primary-200/40 dark:border-primary-800/40',
        r'border-neutral-200/50 dark:border-neutral-800/50'
    ),
    (
        r'border-primary-200/50 dark:border-primary-800/50',
        r'border-neutral-200/50 dark:border-neutral-800/50'
    ),
    (
        r'border-primary-300/40 dark:border-primary-700/40',
        r'border-neutral-200/50 dark:border-neutral-800/50'
    ),
    # Update hover states
    (
        r'hover:border-primary-300/60 dark:hover:border-primary-700/60',
        r'hover:border-primary-400/60 dark:hover:border-primary-600/60'
    ),
    (
        r'hover:border-primary-300 dark:hover:border-primary-700',
        r'hover:border-primary-400/60 dark:hover:border-primary-600/60'
    ),
    # Border transparent -> neutral (for card-like elements)
    (
        r'border border-transparent',
        r'border border-neutral-200/50 dark:border-neutral-800/50'
    ),
]

def fix_borders_in_file(file_path: Path) -> int:
    """Apply border fixes to a single file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content
        replacements_count = 0

        for old_pattern, new_pattern in REPLACEMENTS:
            new_content = re.sub(old_pattern, new_pattern, content)
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

            replacements = fix_borders_in_file(file_path)
            if replacements > 0:
                files_processed += 1
                total_replacements += replacements
                print(f"✓ {file_path.relative_to(ROOT_DIR)}: {replacements} replacements")

    print(f"\n{'='*60}")
    print(f"Border fixes completed!")
    print(f"Files processed: {files_processed}")
    print(f"Total replacements: {total_replacements}")
    print(f"{'='*60}")

if __name__ == '__main__':
    main()
