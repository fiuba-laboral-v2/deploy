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
DEFAULT_SETTINGS_FILE=/etc/apache2/sites-available/$HOSTNAME.conf
SERVED_HTML_PATH=/var/www/$HOSTNAME/html/

sudo touch "$DEFAULT_SETTINGS_FILE"
cat <<EOT > "./$HOSTNAME.conf"
<VirtualHost *:80>
    ProxyPass /graphql http://localhost:5006/graphql
    ServerAdmin admin@$HOSTNAME
    ServerName $HOSTNAME
    ServerAlias www.$HOSTNAME
    DocumentRoot $SERVED_HTML_PATH
    Alias "$FRONTEND_PATH" $SERVED_HTML_PATH
    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
EOT

sudo cp "./$HOSTNAME.conf" "$DEFAULT_SETTINGS_FILE"
rm "./$HOSTNAME.conf"

sudo a2ensite "$HOSTNAME.conf"
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo systemctl restart apache2

echo "Set up docker permissions"
sudo groupadd docker
sudo usermod -aG docker $USER
