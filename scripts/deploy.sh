#!/bin/bash

cd ../

git pull origin main

npm install --production

pm2 restart ecosystem.config.js
