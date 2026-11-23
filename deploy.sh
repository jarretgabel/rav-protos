#!/usr/bin/env bash
# Deploy the prototypes to S3 + CloudFront.
#   ./deploy.sh            sync files and invalidate the cache
#   ./deploy.sh --infra    also create/update the CloudFormation stack first
# Credentials for the Basic Auth prompt live in .deploy.env (never commit it).
set -euo pipefail
cd "$(dirname "$0")"

STACK=rav-protos
REGION=us-east-1
PROFILE="${AWS_PROFILE:-stereobuyers}"  # resolutionavnyc user lacks s3:CreateBucket
AWS="aws --profile $PROFILE --region $REGION"

if [[ ! -f .deploy.env ]]; then
  echo "Missing .deploy.env. Create it with PROTO_USER=... and PROTO_PASS=..." >&2
  exit 1
fi
source .deploy.env
AUTH_B64=$(printf '%s:%s' "$PROTO_USER" "$PROTO_PASS" | base64)

if [[ "${1:-}" == "--infra" ]]; then
  $AWS cloudformation deploy \
    --stack-name "$STACK" \
    --template-file infra/template.yaml \
    --parameter-overrides "AuthB64=$AUTH_B64" \
    --no-fail-on-empty-changeset
fi

out() { $AWS cloudformation describe-stacks --stack-name "$STACK" --query "Stacks[0].Outputs[?OutputKey=='$1'].OutputValue" --output text; }
BUCKET=$(out BucketName)
DIST=$(out DistributionId)
URL=$(out URL)

$AWS s3 sync . "s3://$BUCKET" --delete \
  --exclude "*" \
  --include "index.html" --include "robots.txt" \
  --include "assets/*" --include "concepts/*" \
  --exclude "*.DS_Store"

$AWS cloudfront create-invalidation --distribution-id "$DIST" --paths "/*" --query "Invalidation.Id" --output text >/dev/null

echo "Deployed: $URL"
