#!/usr/bin/env bash

#ansible api -m ping -i inventory.ini  --ask-pass

PASSWORD=$1

echo "pass $PASSWORD"
#ansible-playbook setup_server.yml -i inventory.ini --extra-vars "user_password=$PASSWORD" --ask-pass
