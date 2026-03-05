terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }

    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }

  backend "s3" {
    bucket         = "typrr-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "eu-central-1"
    dynamodb_table = "terraform-locks"
  }
}

provider "aws" {
  region = var.aws_region
}

provider "aws" {
  alias  = "use1"
  region = "us-east-1"
}

#random suffix

resource "random_id" "suffix" {
  byte_length = 4
}

#s3-alb logs

resource "aws_s3_bucket" "alb_logs" {
  bucket        = "${var.project_name}-alb-logs-${random_id.suffix.hex}"
  force_destroy = true
}

data "aws_caller_identity" "current" {}

resource "aws_s3_bucket_policy" "alb_logs" {
  bucket = aws_s3_bucket.alb_logs.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AWSLoadBalancerWrite"
        Effect = "Allow"

        Principal = {
          Service = "logdelivery.elasticloadbalancing.amazonaws.com"
        }

        Action = "s3:PutObject"

        Resource = "${aws_s3_bucket.alb_logs.arn}/AWSLogs/${data.aws_caller_identity.current.account_id}/*"
      },
      {
        Sid    = "AWSLoadBalancerAclCheck"
        Effect = "Allow"

        Principal = {
          Service = "logdelivery.elasticloadbalancing.amazonaws.com"
        }

        Action   = "s3:GetBucketAcl"
        Resource = aws_s3_bucket.alb_logs.arn
      }
    ]
  })
}

module "github_actions" {
  source = "./modules/github_actions"

  github_repo = "RagarRW-c/typerr"
}

module "frontend_static" {
  source        = "./modules/frontend_static"
  bucket_name   = "typrr-frontend-prod"
  project_name  = "typrr"
  alb_dns_name  = module.alb.alb_dns_name
  acm_arn       = module.dns.cloudfront_acm_arn
  domain_name = var.domain_name
}

#networking

module "networking" {
  source = "./modules/networking"

  project_name = var.project_name
  vpc_cidr     = var.vpc_cidr
  aws_region = var.aws_region

}

#database

module "database" {
  source = "./modules/database"

  project_name          = var.project_name
  private_subnet_ids    = module.networking.private_subnet_ids
  rds_security_group_id = module.networking.rds_security_group_id

  db_instance_class   = "db.t3.micro"
  skip_final_snapshot = true
}

#ECR

module "ecr" {
  source       = "./modules/ecr"
  project_name = var.project_name
}

# alb

module "alb" {
  source = "./modules/alb"

  project_name          = var.project_name
  vpc_id                = module.networking.vpc_id
  public_subnet_ids     = module.networking.public_subnet_ids
  alb_security_group_id = module.networking.alb_security_group_id

  alb_logs_bucket = aws_s3_bucket.alb_logs.bucket

  certificate_arn = module.dns.certificate_arn
}

# dns + acm

module "dns" {
  source = "./modules/dns"

  providers = {
    aws       = aws
    aws.use1  = aws.use1
  }

  domain_name  = var.domain_name
  alb_dns_name = module.alb.alb_dns_name
  alb_zone_id  = module.alb.alb_zone_id
  cloudfront_domain_name = module.frontend_static.cloudfront_domain_name
}
#jwt secret

resource "aws_secretsmanager_secret" "jwt_secret" {
  name = "${var.project_name}/jwt-secret"
}

resource "aws_secretsmanager_secret_version" "jwt_secret_value" {
  secret_id     = aws_secretsmanager_secret.jwt_secret.id
  secret_string = var.jwt_secret
}

# database url secret

data "aws_secretsmanager_secret_version" "db_password" {
  secret_id = module.database.db_password_secret_arn
}

resource "aws_secretsmanager_secret" "database_url" {
  name = "${var.project_name}/database-url"
}

resource "aws_secretsmanager_secret_version" "database_url_value" {
  secret_id = aws_secretsmanager_secret.database_url.id

  secret_string = "postgresql://typrr_admin:${data.aws_secretsmanager_secret_version.db_password.secret_string}@${module.database.db_instance_address}:5432/typrr"
}

#ecs

module "ecs" {
  source = "./modules/ecs"

  project_name          = var.project_name
  aws_region            = var.aws_region
  private_subnet_ids    = module.networking.private_subnet_ids
  public_subnet_ids = module.networking.public_subnet_ids
  ecs_security_group_id = module.networking.ecs_security_group_id

  backend_image_url  = module.ecr.backend_repository_url
  #frontend_image_url = module.ecr.frontend_repository_url
  #frontend_image_tag = var.frontend_image_tag
  backend_target_group_arn  = module.alb.backend_target_group_arn
  #frontend_target_group_arn = module.alb.frontend_target_group_arn

  backend_cpu     = 256
  backend_memory  = 512
  #frontend_cpu    = 256
  #frontend_memory = 512

  backend_desired_count  = 1
  #frontend_desired_count = 1

  jwt_secret_arn          = aws_secretsmanager_secret.jwt_secret.arn
  database_url_secret_arn = aws_secretsmanager_secret.database_url.arn
}