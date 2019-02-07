#!/bin/bash

# Fail script when any non-zero command
set -e

# Config GIT
git config --global user.email "$GH_EMAIL"
git config --global user.name "$GH_NAME"

# Clone GitHub Pages branch
git clone --single-branch --branch gh-pages $CIRCLE_REPOSITORY_URL gh-pages

# Clean GitHub Pages
echo "\nClean gh-pages directory"
cd gh-pages
git rm -rfv .

# Copy docs to GitHub Pages
echo "\nCopy docs into gh-pages directory"
cd ..
cp -av docs/. gh-pages/.
# Copy Circle CI config
mkdir -p gh-pages/.circleci
cp -av .circleci/config.yml gh-pages/.circleci/config.yml

# Publish new GitHub Pages
echo "\nDeploy gh-pages branch"
cd gh-pages
git add -A
git commit -m "Circle CI deplayment to GitHub Pages: ${CIRCLE_SHA1}" --allow-empty
git push origin gh-pages

# Clean GitHub Pages directory
echo "\nClean gh-pages directory"
cd ..
rm -rfv gh-pages
