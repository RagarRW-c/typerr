output "cloudfront_domain" {
  value = aws_cloudfront_distribution.frontend.domain_name
}

output "cloudfront_zone_id" {
  value = aws_cloudfront_distribution.frontend.hosted_zone_id
}

output "cloudfront_domain_name" {
  value = aws_cloudfront_distribution.frontend.domain_name
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.frontend.id
}

output "bucket_name" {
  description = "Frontend S3 bucket"
  value       = aws_s3_bucket.frontend.bucket
}