#!/bin/bash

echo "Starting frontend development server..."

#Start the frontend development server
osascript -e 'tell app "Terminal" to do script "cd ~/mlc-project/student-login-frontend/ && npm run dev"'

echo "Frontend development server started."

echo "Start up process complete."