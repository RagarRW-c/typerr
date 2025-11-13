# Typrr Infrastructure

Terraform infrastructure for Typrr application on AWS.

## Architecture

- **VPC**: Custom VPC with public and private subnets across 2 AZs
- **ECS Fargate**: Containerized backend and frontend
- **RDS PostgreSQL**: Managed database
- **ALB**: Application Load Balancer for routing
- **ECR**: Private Docker registries

## Usage

### Initialize
```bash
terraform init
```

### Plan
```bash
terraform plan
```

### Apply
```bash
terraform apply
```

### Destroy
```bash
terraform destroy
```

## Costs (Monthly Estimates)

- NAT Gateway: ~$32
- RDS db.t3.micro: ~$13
- ECS Fargate: ~$30
- ALB: ~$16
- **Total: ~$92/month**

## Modules

- `networking/` - VPC, subnets, security groups
- `database/` - RDS PostgreSQL
- `ecr/` - Docker registries
- `alb/` - Load balancer
- `ecs/` - ECS cluster and services
