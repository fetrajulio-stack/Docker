# Utiliser l'image de base officielle de PHP
FROM php:8.2-fpm

# Définir le répertoire de travail
WORKDIR /var/www

# Installer les dépendances système nécessaires
RUN apt-get update && apt-get install -y \
    build-essential \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    locales \
    zip \
    jpegoptim optipng pngquant gifsicle \
    vim \
    unzip \
    git \
    curl \
    libonig-dev \
    libxml2-dev

# Installer les extensions PHP
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Installer Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copier les fichiers de l'application
COPY . .

# Définir les permissions
RUN chown -R www-data:www-data /var/www

# Exposer le port 9000 pour PHP-FPM
EXPOSE 9000

# Commande par défaut pour lancer le serveur PHP-FPM
CMD ["php-fpm"]