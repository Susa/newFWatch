## Installation

- Clone, install dependencies and change cache and storage folder permission

```sh
git clone https://gitlab.com/psalmeight/FriendwatchAPI.git
cd FriendwatchAPI

composer install
chmod -R 777 bootstrap/cache storage
```

- Create a MySQL database and name it "watchdb"
- Edit .env file located on your project folder and update the database credentials

```sh
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=watchdb
DB_USERNAME=<mysql_user>
DB_PASSWORD=<mysql_password>
```
- If you don't have .env file, create one (BE SURE TO PLACE IT ON THE ROOT FOLDER)

```sh
touch .env
sudo pico .env
```
- Copy/Paste the code below inside .env file

```sh
APP_NAME=WatchAPI
APP_ENV=local
APP_KEY=base64:g1rIe5mQA36Q+vGVA6fft5Av6hOz2YZigTWgk+CXG4w=
APP_DEBUG=true
APP_LOG_LEVEL=debug
APP_URL=http://localhost

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=watchdb
DB_USERNAME=<mysql_user>
DB_PASSWORD=<mysql_password>

BROADCAST_DRIVER=log
CACHE_DRIVER=file
SESSION_DRIVER=file
QUEUE_DRIVER=sync

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_DRIVER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null

PUSHER_APP_ID=
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
```

- Execute Database migration

```sh
php artisan migrate
```

- Generate Application Key

```sh
php artisan key:generate
```

- Generate Passport Client

```sh
php artisan passport:install
```

- Run Server

```sh
php artisan serve
```

## Laravel Framework License

The Laravel framework is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT).
