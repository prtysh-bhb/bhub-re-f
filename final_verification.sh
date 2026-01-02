#!/bin/bash
echo "=========================================="
echo "FINAL THEME CONSISTENCY VERIFICATION"
echo "=========================================="
echo ""

echo "1. Checking for old border patterns..."
OLD_BORDERS=$(grep -r "border-primary-200/40\|border-primary-300/40" src --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l)
echo "   Old border patterns found: $OLD_BORDERS"

echo ""
echo "2. Checking for gray backgrounds in dark mode..."
GRAY_BG=$(grep -r "dark:bg-gray-900\|dark:bg-gray-800" src --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l)
echo "   Gray backgrounds found: $GRAY_BG"

echo ""
echo "3. Checking for old hover patterns..."
OLD_HOVER=$(grep -r "hover:border-primary-300/60 dark:hover:border-primary-700/60" src --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l)
echo "   Old hover patterns found: $OLD_HOVER"

echo ""
echo "4. Checking proper neutral borders..."
NEUTRAL_BORDERS=$(grep -r "border-neutral-200/50 dark:border-neutral-800/50" src --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l)
echo "   ✓ Neutral border patterns found: $NEUTRAL_BORDERS"

echo ""
echo "5. Checking proper neutral backgrounds..."
NEUTRAL_BG=$(grep -r "dark:bg-neutral-900\|dark:bg-neutral-800" src --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l)
echo "   ✓ Neutral background patterns found: $NEUTRAL_BG"

echo ""
echo "6. Checking Card component usage..."
CARD_IMPORTS=$(grep -r "from.*@/components/ui/card" src --include="*.tsx" 2>/dev/null | wc -l)
echo "   ✓ Card component imports: $CARD_IMPORTS"

echo ""
echo "=========================================="
if [ "$OLD_BORDERS" -eq 0 ] && [ "$GRAY_BG" -eq 0 ] && [ "$OLD_HOVER" -eq 0 ]; then
    echo "✓ ALL CONSISTENCY CHECKS PASSED!"
else
    echo "⚠ Issues found - review needed"
fi
echo "=========================================="
