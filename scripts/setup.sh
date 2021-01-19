#!/bin/bash

sudo ufw allow 'Apache'
sudo ufw enable

echo "creating '/var/www/$HOSTNAME/html' folder"
sudo mkdir -p "/var/www/$HOSTNAME/html"

echo "creating user permissions for the '/var/www/$HOSTNAME/html' folder"
sudo chown -R "$USER:$USER" "/var/www/$HOSTNAME/html"
sudo chmod -R 755 "/var/www/$HOSTNAME"

echo "creating apache configuration"
HOSTNAME=$HOSTNAME FRONTEND_PATH=$FRONTEND_PATH sh ./set_default_settings.sh

echo "Set up docker permissions"
sudo groupadd docker
sudo usermod -aG docker $USER
