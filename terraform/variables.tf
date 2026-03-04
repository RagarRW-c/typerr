variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "eu-central-1"
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "typrr"
}

variable "vpc_cidr" {
  description = "VPC CIDR block"
  type        = string
  default     = "10.0.0.0/16"
}

variable "jwt_secret" {
  description = "JWT secret for backend authentication"
  type        = string
  sensitive   = true
}


variable "domain_name" {
  description = "Domain name"
  type        = string
  default     = "typrr.cloud"
}

variable "frontend_image_tag" {
  type = string
}