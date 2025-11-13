terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

module "networking" {
  source = "./modules/networking"
  
  project_name = var.project_name
  vpc_cidr     = var.vpc_cidr
}

module "database" {
  source = "./modules/database"

  project_name           = var.project_name
  private_subnet_ids     = module.networking.private_subnet_ids
  rds_security_group_id  = module.networking.rds_security_group_id

  db_instance_class   = "db.t3.micro"
  skip_final_snapshot = true
}

module "ecr" {
  source = "./modules/ecr"

  project_name = var.project_name
}

module "alb" {
  source = "./modules/alb"

  project_name          = var.project_name
  vpc_id                = module.networking.vpc_id
  public_subnet_ids     = module.networking.public_subnet_ids
  alb_security_group_id = module.networking.alb_security_group_id
}

module "ecs" {
  source = "./modules/ecs"

  project_name          = var.project_name
  aws_region            = var.aws_region
  private_subnet_ids    = module.networking.private_subnet_ids
  ecs_security_group_id = module.networking.ecs_security_group_id

  backend_image_url         = module.ecr.backend_repository_url
  frontend_image_url        = module.ecr.frontend_repository_url

  backend_target_group_arn  = module.alb.backend_target_group_arn
  frontend_target_group_arn = module.alb.frontend_target_group_arn

  db_endpoint             = module.database.db_instance_address
  db_name                 = "typrr"
  db_username             = "typrr_admin"
  db_password_secret_arn  = module.database.db_password_secret_arn

  backend_cpu    = 512
  backend_memory = 1024
  frontend_cpu   = 256
  frontend_memory = 512

  backend_desired_count  = 1
  frontend_desired_count = 1
}
