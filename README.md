# 🖋️ Typrr

Typrr is a production-ready full-stack typing speed and accuracy platform
built using a modern cloud-native architecture.

The project demonstrates real-world DevOps practices including:

* Containerization with Docker
* Infrastructure as Code (Terraform)
* CI/CD pipeline with GitHub Actions
* Versioned container deployments (SHA-based)
* Automated ECS deployments with rollback capability
* Autoscaling and high availability
* HTTPS enforcement and security best practices
* Centralized logging and monitoring

---

## 🌍 Live Application

👉 [https://typrr.cloud](https://typrr.cloud)

Hosted in AWS (eu-central-1 region)

---

## 🏗️ Architecture Overview

```
Internet
   ↓
Route53 (DNS)
   ↓
CloudFront (CDN)
   ↓
Application Load Balancer (HTTPS)
   ↓
ECS Fargate
├── Frontend (React + Nginx)
└── Backend (Node.js API)
   ↓
RDS PostgreSQL
```

Additional components:

* AWS ACM (TLS certificates)
* AWS Secrets Manager (credentials)
* CloudWatch (logs & monitoring)
* S3 (frontend hosting + logs)

---

## 🚀 Features

* JWT-based authentication
* Typing test with WPM & accuracy tracking
* Leaderboard system
* Persistent storage
* Production-grade AWS deployment
* Autoscaling backend service
* HTTPS enforced (HTTP → 301 redirect)
* Security headers (HSTS, X-Frame-Options, Referrer-Policy)
* Centralized logging and monitoring

---

## 🚀 CI/CD & Deployment Strategy

The project uses a fully automated CI/CD pipeline built with GitHub Actions.

### 🔄 Deployment Flow

1. Push to `main` triggers pipeline
2. Docker image is built and tagged with commit SHA
3. Image is pushed to AWS ECR
4. ECS task definition is dynamically updated
5. ECS service performs rolling deployment
6. Frontend is built and uploaded to S3
7. CloudFront cache is invalidated

---

### 🧠 Versioned Deployments

Each deployment uses a unique image tag:

```
typrr-backend:<commit-sha>
```

Benefits:

* No reliance on `latest`
* Full traceability of deployments
* Deterministic infrastructure state
* Safer production releases

---

### 🔁 Rollback Capability

Rollback can be performed instantly:

```bash
aws ecs update-service \
  --cluster typrr-cluster \
  --service typrr-backend-service \
  --task-definition typrr-backend:<REVISION>
```

---

### ⚙️ Technologies Used in CI/CD

* GitHub Actions
* Docker
* AWS ECR
* AWS ECS Fargate

---

## 📁 Repository Structure

```
typrr-project/
├── terraform/              # Infrastructure as Code (AWS)
│   ├── modules/
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf
│
├── typrr-backend/         # Node.js + Express API
├── typrr-frontend/        # React + Vite frontend
├── docker-compose.yml     # Local environment
└── README.md
```

---

## 🛠️ Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Nginx

### Backend

* Node.js
* Express
* Prisma ORM

### Database

* SQLite (development)
* PostgreSQL (production)

### DevOps / Cloud

* AWS ECS Fargate
* Application Load Balancer
* CloudFront
* Route53
* AWS ACM
* RDS PostgreSQL
* S3
* CloudWatch
* AWS Secrets Manager
* Terraform
* Docker

---

## ⚙️ Local Development

### 1️⃣ Clone repository

```bash
git clone https://github.com/RagarRW-c/typrr.git
cd typrr-project
```

---

### 2️⃣ Backend

```bash
cd typrr-backend
npm install
npx prisma migrate dev
npm run dev
```

Backend:

```
http://localhost:3003/api/health
```

---

### 3️⃣ Frontend

```bash
cd typrr-frontend
npm install
npm run dev
```

Frontend:

```
http://localhost:5173
```

---

### 4️⃣ Environment variables

Create `.env` in `typrr-backend/`:

```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_secret_key"
PORT=3003
```

---

## 🐳 Docker (Local)

```bash
docker compose up --build
```

---

## ☁️ Infrastructure (Terraform)

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

---

## 📊 Monitoring & Logging

* CloudWatch logs for ECS tasks
* CloudWatch alarms (CPU, errors, health checks)
* ALB access logs stored in S3

---

## 🔐 Security

* HTTPS enforced (ALB + CloudFront)
* HSTS enabled
* Secure headers configured
* JWT authentication
* Secrets stored in AWS Secrets Manager
* Private subnets for ECS tasks

---

## 📜 License

MIT License

---

## 👨‍💻 Author

Witalij Rapicki
GitHub: [https://github.com/RagarRW-c](https://github.com/RagarRW-c)
Email: [witalij.rapicki@gmail.com](mailto:witalij.rapicki@gmail.com)
