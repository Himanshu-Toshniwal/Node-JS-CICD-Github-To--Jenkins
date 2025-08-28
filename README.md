# Node-JS-CICD-Github-To--Jenkins

📋 Overview
A production-ready Node.js weather application with automated CI/CD pipeline from GitHub to Jenkins featuring automatic deployments on code changes.

🎯 Features
Real-time Weather Data: Current weather and 5-day forecasts

Location Detection: Automatic GPS-based weather detection

Responsive UI: Beautiful animated interface with weather-based themes

RESTful API: Complete API endpoints for weather data

CI/CD Pipeline: Automated testing and deployment


🛠️ Technology Stack
Backend: Node.js, Express.js

Frontend: HTML5, CSS3, JavaScript (Vanilla)

API: OpenWeatherMap API

Testing: Jest, Supertest

CI/CD: Jenkins, GitHub Webhooks

📱 Application Features
Frontend Components
Dynamic Backgrounds: Changes based on weather conditions

Responsive Design: Works on desktop, tablet, and mobile

Real-time Updates: Live weather data refresh

Location Services: GPS integration for local weather

Weather Conditions Supported
☀️ Sunny/Clear

☁️ Cloudy

🌧 Rainy

⛈ Thunderstorm

❄️ Snowy

🌫 Mist/Fog


🌐 API Endpoints
Endpoint	Method	Description
/	GET	Weather application UI
/api/weather?city={city}	GET	Weather by city name
/api/weather?lat={lat}&lon={lon}	GET	Weather by coordinates



.

🚀 Quick Start
Prerequisites
bash
# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node -v
npm -v


# Clone repository
git clone https://github.com/Himanshu-Toshniwal/Node-JS-CICD-Github-To--Jenkins.git
cd Node-JS-CICD-Github-To--Jenkins

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env file with your OpenWeatherMap API key

# Start the application
npm start

The app will be available at http://localhost:3000


📊 CI/CD Pipeline Architecture
GitHub Webhook Setup
Go to repository Settings → Webhooks

Add webhook URL: http://JENKINS_SERVER/github-webhook/

Set content type to application/json

Select events: Push events, Pull request events


Jenkins Pipeline Stages
Checkout: Pull latest code from GitHub

Build: Install dependencies with npm install

Test: Execute tests with npm test

Lint: Code quality check with npm run lint

Deploy: Automated deployment to production

🚀 Deployment Commands

# Stop existing process (if any)
pkill -f "node server.js"

# Pull latest code
git pull origin main

# Install dependencies
npm install

# Start application
npm start

