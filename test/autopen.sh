#!/usr/bin/env fish

# Configuration
set BASE_URL "http://localhost:3001"  # Change this to your actual API URL
set ENDPOINT "/api/agent/publish"

# Base64 PDF file
set PDF_BASE64_FILE "pdfbase64.txt"

# Check if PDF base64 file exists
if not test -f $PDF_BASE64_FILE
    echo "Error: PDF base64 file '$PDF_BASE64_FILE' not found!"
    exit 1
end

# Read the base64 PDF content
set PDF_BASE64 (cat $PDF_BASE64_FILE)

# Create JSON payload
set JSON_PAYLOAD '{
  "metadata": {
    "title": "Sample Document",
    "author": "John Doe",
    "date": "'(date -u +"%Y-%m-%dT%H:%M:%SZ")'",
    "type": "extraction"
  },
  "pdf": "'$PDF_BASE64'",
  "template": "default"
}'

# Make the POST request
echo "Sending request to: $BASE_URL$ENDPOINT"
echo "Reading PDF base64 from: $PDF_BASE64_FILE"
echo ""

curl -POST \
  "$BASE_URL$ENDPOINT" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d $JSON_PAYLOAD \
  --verbose

echo ""
echo "Request completed."