#!/bin/bash
# The current domain configuration at ngrok
ngrok http --url=welcome-terrier-ideally.ngrok-free.app 3000

# STEPS TO UPDATE

## REMOVE PREVIOUS CONFIG
# /Users/<username>/Library/Application Support/ngrok/ngrok.yml

## ADD new AuthToken
# https://dashboard.ngrok.com/get-started/setup/macos

## GENERATE NEW DOMAIN AND UPDATE THIS SCRIPTS
# https://dashboard.ngrok.com/domains

## RUN THIS SCRIPT


