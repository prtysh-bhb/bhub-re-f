#!/usr/bin/env python3
"""
Fix all card backgrounds and borders to use elegant primary theme integration
"""
import os
import re

# Card styling patterns to replace
CARD_REPLACEMENTS = [
    # Pattern 1: Cards with neutral background and borders
    (
        r'className="(group )?bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60',
        r'className="\1bg-gradient-to-br from-white via-white to-primary-50/30 dark:from-neutral-900 dark:via-neutral-900 dark:to-primary-950/20 border border-primary-200/40 dark:border-primary-800/40'
    ),
    # Pattern 2: Stats cards (divs) with old styling
    (
        r'className="group relative bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-md shadow-neutral-200/50 dark:shadow-black/20 border border-neutral-200/60 dark:border-neutral-800/60',
        r'className="group relative bg-gradient-to-br from-white via-white to-primary-50/30 dark:from-neutral-900 dark:via-neutral-900 dark:to-primary-950/20 rounded-2xl p-6 shadow-lg shadow-primary-100/20 dark:shadow-black/20 border border-primary-200/40 dark:border-primary-800/40'
    ),
    # Pattern 3: Header cards with neutral styling
    (
        r'bg-gradient-to-br from-white via-white to-primary-50/30 dark:from-neutral-900 dark:via-neutral-900 dark:to-primary-950/20 py-\d+ px-\d+ rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80',
        r'bg-gradient-to-br from-white via-white to-primary-50/40 dark:from-neutral-900 dark:via-neutral-900 dark:to-primary-950/30 py-10 px-8 rounded-2xl border border-primary-200/50 dark:border-primary-800/50'
    ),
]

def fix_file(filepath):
    """Fix a single file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content
        replacements_made = 0

        for pattern, replacement in CARD_REPLACEMENTS:
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
    admin_pages_dir = 'src/pages/admin'
    files_fixed = 0

    # Find all .tsx files in admin pages
    for root, dirs, files in os.walk(admin_pages_dir):
        for file in files:
            if file.endswith('.tsx'):
                filepath = os.path.join(root, file)
                if fix_file(filepath):
                    files_fixed += 1

    print(f"\n✅ Complete! Fixed {files_fixed} files")

if __name__ == '__main__':
    main()
