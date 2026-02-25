# 🖋️ Typrr

Typrr is a production-ready full-stack typing speed and accuracy
platform built using a modern cloud-native architecture.

The project demonstrates real-world DevOps practices including
containerization, infrastructure as code, autoscaling, HTTPS
enforcement, centralized logging, and monitoring.

------------------------------------------------------------------------

## 🌍 Live Application

Production environment:

👉 https://typrr.cloud

Hosted in AWS (eu-central-1 region).

------------------------------------------------------------------------

## 🏗️ Architecture Overview

Production architecture:

Internet\
↓\
Route53 (DNS)\
↓\
Application Load Balancer (HTTPS)\
↓\
ECS Fargate\
├── Frontend (Nginx + React SPA)\
└── Backend (Node.js API)\
↓\
RDS PostgreSQL

Additional components:

-   AWS ACM (TLS certificate)\
-   CloudWatch monitoring & alarms\
-   ECS autoscaling\
-   ALB access logs stored in S3\
-   AWS Secrets Manager for credentials

------------------------------------------------------------------------

## 🚀 Features

-   JWT-based authentication\
-   Typing test with WPM & accuracy tracking\
-   Leaderboard system\
-   Persistent storage\
-   Production-grade AWS deployment\
-   Autoscaling backend service\
-   HTTPS enforced (HTTP → 301 redirect)\
-   Security headers (HSTS, X-Frame-Options, Referrer-Policy)\
-   Centralized logging and monitoring

------------------------------------------------------------------------

## 📁 Repository Structure

typrr-project/\
├── terraform/ \# Infrastructure as Code (AWS)\
│ ├── modules/\
│ ├── main.tf\
│ ├── variables.tf\
│ └── outputs.tf\
│\
├── typrr-backend/ \# Node.js + Express API\
├── typrr-frontend/ \# React + Vite frontend\
├── docker-compose.yml \# Local multi-service setup\
└── README.md

------------------------------------------------------------------------

## 🛠️ Tech Stack

### Frontend

-   React\
-   TypeScript\
-   Vite\
-   Nginx

### Backend

-   Node.js\
-   Express\
-   Prisma ORM

### Database

-   SQLite (development)\
-   PostgreSQL (production)

### DevOps / Cloud

-   AWS ECS Fargate\
-   Application Load Balancer\
-   Route53\
-   AWS ACM\
-   RDS PostgreSQL\
-   S3\
-   CloudWatch\
-   AWS Secrets Manager\
-   Terraform\
-   Docker

------------------------------------------------------------------------

## ⚙️ Local Development

### 1️⃣ Clone the repository

git clone https://github.com/RagarRW-c/typrr.git\
cd typrr-project

### 2️⃣ Backend setup

cd typrr-backend\
npm install\
npx prisma migrate dev\
npm run dev

Backend runs at:\
http://localhost:3003/api/health

### 3️⃣ Frontend setup

cd typrr-frontend\
npm install\
npm run dev

Frontend runs at:\
http://localhost:5173

### 4️⃣ Backend Environment Variables

Create `.env` file inside `typrr-backend/`:

DATABASE_URL="file:./dev.db"\
JWT_SECRET="your_secret_key"\
PORT=3003

------------------------------------------------------------------------

## 🐳 Running with Docker (Local)

docker compose up --build

------------------------------------------------------------------------

## ☁️ Infrastructure Deployment (Terraform)

cd terraform\
terraform init\
terraform plan\
terraform apply

------------------------------------------------------------------------

## 📊 Monitoring & Logging

-   CloudWatch alarms (CPU, 5xx, unhealthy targets)\
-   ALB access logs stored in S3\
-   ECS logs streamed to CloudWatch

------------------------------------------------------------------------

## 🔐 Security

-   HTTPS enforced at ALB\
-   HSTS enabled\
-   Security headers configured in Nginx\
-   JWT authentication\
-   Secrets stored in AWS Secrets Manager\
-   Private subnets for ECS tasks

------------------------------------------------------------------------

## 📜 License

MIT License

------------------------------------------------------------------------

## 👨‍💻 Author

Witalij Rapicki\
GitHub: https://github.com/RagarRW-c\
Email: witalij.rapicki@gmail.com