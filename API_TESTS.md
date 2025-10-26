# API Test Commands

## Test Statistics API
curl "https://fragerwinchatv2.azurewebsites.net/api/statistics?action=statistics&password=ErwinAdmin2025!"

## Test FAQ List (Public)
curl "https://fragerwinchatv2.azurewebsites.net/api/faq-manager?action=list"

## Test FAQ Pagination
curl "https://fragerwinchatv2.azurewebsites.net/api/faq-manager?action=listPaginated&page=1&pageSize=6"

## Test Document List
curl "https://fragerwinchatv2.azurewebsites.net/api/document-manager?action=list&password=ErwinAdmin2025!"

## Test Chat (should now track questions)
curl -X POST "https://fragerwinchatv2.azurewebsites.net/api/chat" \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"Wie funktioniert die Abwassergebühr?\"}"
