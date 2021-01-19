#!/bin/bash

echo "Allow Apache"
sudo ufw allow 'Apache'
echo "enable ufw"
sudo ufw enable

echo "creating '/var/www/$HOSTNAME/html' folder"
sudo mkdir -p "/var/www/$HOSTNAME/html"

echo "creating user permissions for the '/var/www/$HOSTNAME/html' folder"
sudo chown -R "$USER:$USER" "/var/www/$HOSTNAME/html"
sudo chmod -R 755 "/var/www/$HOSTNAME"

echo "creating apache configuration"
HOSTNAME=$HOSTNAME FRONTEND_PATH=$FRONTEND_PATH bash fiuba-laboral-v2/scripts/set_default_settings.sh

echo "Set up docker permissions"
sudo groupadd docker
sudo usermod -aG docker $USER
