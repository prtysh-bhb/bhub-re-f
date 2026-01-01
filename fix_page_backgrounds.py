#!/usr/bin/env python3
"""
Fix page backgrounds and headers to be more elegant and theme-cohesive
"""
import os
import re

REPLACEMENTS = [
    # Page backgrounds - add subtle primary gradient
    (
        r'className="p-6 space-y-6 bg-gradient-to-br from-neutral-50 via-neutral-100/30 to-neutral-50 dark:from-neutral-950 dark:via-neutral-900/50 dark:to-neutral-950',
        r'className="p-6 space-y-6 bg-gradient-to-br from-neutral-50 via-primary-50/10 to-neutral-50 dark:from-neutral-950 dark:via-primary-950/5 dark:to-neutral-950'
    ),
    # Header welcome sections - enhance primary integration
    (
        r'className="relative bg-gradient-to-br from-white via-white to-primary-50/30 dark:from-neutral-900 dark:via-neutral-900 dark:to-primary-950/20 py-\d+ px-\d+ rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80',
        r'className="relative bg-gradient-to-br from-white via-primary-50/20 to-primary-100/40 dark:from-neutral-900 dark:via-primary-950/20 dark:to-primary-900/30 py-10 px-8 rounded-2xl border border-primary-200/60 dark:border-primary-800/60'
    ),
    # Alternative header pattern
    (
        r'bg-gradient-to-br from-white via-white to-primary-50/40 dark:from-neutral-900 dark:via-neutral-900 dark:to-primary-950/30 py-10 px-8 rounded-2xl border border-primary-200/50 dark:border-primary-800/50',
        r'bg-gradient-to-br from-white via-primary-50/20 to-primary-100/40 dark:from-neutral-900 dark:via-primary-950/20 dark:to-primary-900/30 py-10 px-8 rounded-2xl border border-primary-200/60 dark:border-primary-800/60'
    ),
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
    admin_pages_dir = 'src/pages/admin'
    files_fixed = 0

    # Find all .tsx files
    for root, dirs, files in os.walk(admin_pages_dir):
        for file in files:
            if file.endswith('.tsx'):
                filepath = os.path.join(root, file)
                if fix_file(filepath):
                    files_fixed += 1

    print(f"\n✅ Complete! Fixed {files_fixed} files")

if __name__ == '__main__':
    main()
