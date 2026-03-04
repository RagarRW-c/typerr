data "aws_iam_openid_connect_provider" "github" {
  url = "https://token.actions.githubusercontent.com"
}

resource "aws_iam_role" "github_actions" {
  name = "github-actions-typrr"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = data.aws_iam_openid_connect_provider.github.arn
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
          }
          StringLike = {
            "token.actions.githubusercontent.com:sub" = "repo:YOUR_GITHUB_USERNAME/typrr-project:*"
          }
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "github_actions_policy" {
  role = aws_iam_role.github_actions.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [

      {
        Effect = "Allow"
        Action = [
          "ecr:*"
        ]
        Resource = "*"
      },

      {
        Effect = "Allow"
        Action = [
          "ecs:*"
        ]
        Resource = "*"
      },

      {
        Effect = "Allow"
        Action = [
          "s3:*"
        ]
        Resource = "*"
      },

      {
        Effect = "Allow"
        Action = [
          "cloudfront:*"
        ]
        Resource = "*"
      }

    ]
  })
}