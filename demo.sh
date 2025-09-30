# Create solarshare/demo.sh (make executable with chmod +x demo.sh). This script uses curl to call backend endpoints and demonstrates a typical flow.

#!/usr/bin/env bash
# set -e

# API="http://localhost:3000/api"

# echo "1) Initialize token..."
# curl -s -X POST "$API/init-token" | jq .

# echo
# echo "2) Register consumer and provider..."
# # Unique IDs for demo
# CONSUMER_ID="consumer-$(date +%s)"
# PROVIDER_ID="provider-$(date +%s)"

# curl -s -X POST "$API/register" -H "Content-Type: application/json" -d "{\"id\":\"$CONSUMER_ID\",\"name\":\"Demo Consumer\",\"role\":\"consumer\"}" | jq .
# curl -s -X POST "$API/register" -H "Content-Type: application/json" -d "{\"id\":\"$PROVIDER_ID\",\"name\":\"Demo Provider\",\"role\":\"provider\"}" | jq .

# echo
# echo "3) Top up consumer with 5 eKWh"
# curl -s -X POST "$API/topup" -H "Content-Type: application/json" -d "{\"userId\":\"$CONSUMER_ID\",\"amount\":5}" | jq .

# echo
# echo "4) Check balances"
# curl -s "$API/balance/$CONSUMER_ID" | jq .
# curl -s "$API/balance/$PROVIDER_ID" | jq .

# echo
# echo "5) Simulate 1 kWh consumption (consumer->provider)"
# curl -s -X POST "$API/consume" -H "Content-Type: application/json" -d "{\"consumerId\":\"$CONSUMER_ID\",\"providerId\":\"$PROVIDER_ID\",\"kwh\":1}" | jq .

# echo
# echo "6) Balances after consumption"
# curl -s "$API/balance/$CONSUMER_ID" | jq .
# curl -s "$API/balance/$PROVIDER_ID" | jq .

# echo
# echo "7) List usage events"
# curl -s "$API/usage" | jq .


#!/bin/bash
set -e

cd backend
echo "Starting backend..."
npm run dev &
BACK_PID=$!
sleep 3

echo "Init token"
curl -s -X POST localhost:3000/api/init-token

echo -e "\nRegistering consumer and provider"
curl -s -X POST localhost:3000/api/register -H "Content-Type: application/json" \
  -d '{"id":"alice","role":"consumer"}'
curl -s -X POST localhost:3000/api/register -H "Content-Type: application/json" \
  -d '{"id":"bob","role":"provider"}'

echo -e "\nTopping up Alice with 50"
curl -s -X POST localhost:3000/api/topup -H "Content-Type: application/json" \
  -d '{"id":"alice","amount":50}'

echo -e "\nSimulating consumption of 10 from Alice to Bob"
curl -s -X POST localhost:3000/api/consume -H "Content-Type: application/json" \
  -d '{"consumerId":"alice","providerId":"bob","kwh":10}'

echo -e "\nBalances now:"
curl -s localhost:3000/api/users

kill $BACK_PID
