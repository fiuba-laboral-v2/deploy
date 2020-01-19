#!/bin/bash

DEFAULT_SETTINGS_FILE=/etc/apache2/sites-available/$HOSTNAME.conf
SERVED_HTML_PATH=/var/www/$HOSTNAME/html

sudo touch "$DEFAULT_SETTINGS_FILE"
cat <<EOT > "./scripts/$HOSTNAME.conf"
<VirtualHost *:80>
    ProxyPass /laboral-api http://localhost:5000
    ServerAdmin admin@$HOSTNAME
    ServerName $HOSTNAME
    ServerAlias www.$HOSTNAME
    DocumentRoot /var/www/html
    Alias "/laboral" $SERVED_HTML_PATH
    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
EOT

sudo cp "./scripts/$HOSTNAME.conf" "$DEFAULT_SETTINGS_FILE"
rm "./scripts/$HOSTNAME.conf"

sudo a2ensite "$HOSTNAME.conf"
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo systemctl restart apache2
