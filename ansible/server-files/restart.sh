#! /bin/bash

cd /home/dev/app/current
pm2 restart ./ecosystem.config.js
