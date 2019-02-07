#!/bin/bash

# Fail script when any non-zero command
set -e

# Config GIT
git config --global user.email "$GH_EMAIL"
git config --global user.name "$GH_NAME"

# Clone GitHub Pages branch
git clone --single-branch --branch gh-pages $CIRCLE_REPOSITORY_URL gh-pages

# Clean GitHub Pages
cd gh-pages
git rm -rf .

# Copy docs to GitHub Pages
cd ..
cp -a docs/. gh-pages/.

# Publish new GitHub Pages
cd gh-pages
git add -A
git commit -m "Circle CI deplayment to GitHub Pages: ${CIRCLE_SHA1}" --allow-empty
git push origin gh-pages

# Clean GitHub Pages directory
cd ..
rm -rf gh-pages
