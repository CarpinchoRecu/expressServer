
# Configuración de Servidor VPS con Ubuntu, Express y SSL

Este es un conjunto de instrucciones paso a paso para configurar un servidor virtual privado (VPS) con Ubuntu y Node.js utilizando el framework Express, además de habilitar SSL para una mayor seguridad. Sigue estos pasos para implementar tu aplicación web en un entorno similar.

## Paso 1: Adquisición del VPS

1.1 Compra un plan de hosting y establece un usuario y contraseña.

## Paso 2: Configuración de Dominio

2.1 Adquiere un dominio o un subdominio y configura los registros DNS (A y AAAA) para IPv4 e IPv6.

2.2 Accede al servidor SSH utilizando la dirección IP, el nombre de usuario y la contraseña.

## Paso 3: Instalación de Dependencias

3.1 Verifica si Node.js y npm están preinstalados; si no lo están, instálalos.

3.2 Actualiza las dependencias con los comandos `sudo apt-get update` y `sudo apt-get upgrade`.

## Paso 4: Transferencia de Archivos

4.1 Utiliza WinSCP o git para mover todos los archivos a la ubicación `/var/www/html/`.

## Paso 5: Certificado SSL

5.1 Configura un certificado SSL utilizando Apache y Let's Encrypt con Certbot y Python para mejorar la seguridad y evitar problemas de CORS.

## Paso 6: Configuración de Apache

6.1 Modifica la instancia predeterminada de Apache en `/etc/apache2/sites-available/` para habilitar los puertos 80 y 443 con SSL.

6.2 Actualiza Apache con los comandos:
sudo a2ensite tusitio-ssl
sudo systemctl restart apache2
sudo iptables -L -n
curl http://localhost:4000
sudo ufw status
netstat -tuln | grep 4000
sudo systemctl status apache2
sudo ufw allow 4000/tcp
sudo ufw enable

## Paso 7: Configuración de Proxy

<VirtualHost *:80>
    ServerAdmin webmaster@tusitio.com
    ServerName tusitio.com

    DocumentRoot /var/www/html

    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined

    <Directory /var/www/html>
        Options FollowSymLinks
        AllowOverride All
    </Directory>

    # Redirige todo el tráfico del puerto 80 al puerto 443 (SSL)
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</VirtualHost>

<VirtualHost *:443>
    ServerAdmin webmaster@tusitio.com
    ServerName tusitio.com

    DocumentRoot /var/www/html

    SSLEngine on
    SSLCertificateFile /ruta/al/certificado.crt
    SSLCertificateKeyFile /ruta/a/clave-privada.key

    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined

    <Directory /var/www/html>
        Options FollowSymLinks
        AllowOverride All
    </Directory>
</VirtualHost>


7.1 Habilita los módulos de proxy de Apache con los comandos:
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod proxy_balancer
sudo a2enmod lbmethod_byrequests
Luego, reinicia Apache.

## Paso 8: Instalación de PM2

8.1 Instala PM2 globalmente con `npm install pm2 -g`.

8.2 Inicia una instancia de tu aplicación con PM2 utilizando `pm2 start app.js --name nombre_personalizado`.

¡Y listo! Ahora tienes un servidor configurado con Ubuntu, Express y SSL para tu aplicación web.
