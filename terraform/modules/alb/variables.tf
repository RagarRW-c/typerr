variable "project_name" {
  description = "Project name"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "public_subnet_ids" {
  description = "List of public subnet IDs for ALB"
  type        = list(string)
}

variable "alb_security_group_id" {
  description = "Security group ID for ALB"
  type        = string
}

variable "certificate_arn" {
  type = string
}

variable "alb_logs_bucket" {
  type = string
}

variable "frontend_image_url" {
  type    = string
  default = null
}

variable "frontend_image_tag" {
  type    = string
  default = null
}

variable "frontend_target_group_arn" {
  type    = string
  default = null
}

variable "frontend_cpu" {
  type    = number
  default = null
}

variable "frontend_memory" {
  type    = number
  default = null
}

variable "frontend_desired_count" {
  type    = number
  default = 0
}