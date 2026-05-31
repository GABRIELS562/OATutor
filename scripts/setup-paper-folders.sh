#!/bin/bash
# Setup folder structure for local past papers storage
# Run from project root: ./scripts/setup-paper-folders.sh

echo "Creating past papers folder structure..."

# Base folder
mkdir -p public/papers

# Mathematics folders
mkdir -p public/papers/mathematics/grade10
mkdir -p public/papers/mathematics/grade11
mkdir -p public/papers/mathematics/grade12

# Physical Sciences folders
mkdir -p public/papers/physical_sciences/grade10
mkdir -p public/papers/physical_sciences/grade11
mkdir -p public/papers/physical_sciences/grade12

echo "Folder structure created!"
echo ""
echo "Place your PDF files according to this naming convention:"
echo "  /papers/<subject>/grade<N>/<year>_<type>_p<num>_<lang>.pdf"
echo ""
echo "Examples:"
echo "  /papers/mathematics/grade12/2024_nsc_p1_en.pdf"
echo "  /papers/mathematics/grade12/2024_nsc_p1_en_memo.pdf"
echo "  /papers/physical_sciences/grade11/2023_nsc_p2_af.pdf"
echo ""
echo "Subjects: mathematics, physical_sciences"
echo "Types: nsc, ieb, provincial, supplementary"
echo "Languages: en (English), af (Afrikaans)"
