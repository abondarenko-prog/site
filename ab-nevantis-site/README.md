# АБ Невантис - Сайт IT-интегратора

Современный сайт для компании АБ Невантис - IT-интегратора полного цикла.

## Структура проекта

```
ab-nevantis-site/
├── index.html          # Главная страница сайта
├── server.js           # Node.js сервер (Express)
├── package.json        # Зависимости и скрипты
├── .env.example        # Пример переменных окружения
└── .gitignore          # Игнорируемые файлы
```

## Установка на VPS Ubuntu

### 1. Подготовка сервера

```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Установка PM2 для управления процессом
sudo npm install -g pm2
```

### 2. Развёртывание приложения

```bash
# Клонирование репозитория (или загрузка файлов)
cd /var/www
sudo git clone <your-repo-url> ab-nevantis-site
cd ab-nevantis-site

# Установка зависимостей
npm install --production

# Создание файла .env
cp .env.example .env
nano .env  # Отредактируйте под ваши настройки
```

### 3. Настройка环境变量 (.env)

Откройте `.env` и настройте:
- `PORT` - порт приложения (по умолчанию 3000)
- `ALLOWED_ORIGINS` - разрешённые домены
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` - настройки почтового сервера
- `EMAIL_TO` - email для получения заявок

### 4. Запуск приложения через PM2

```bash
# Запуск в production режиме
pm2 start server.js --name ab-nevantis-site

# Автозапуск при загрузке системы
pm2 startup systemd -u root --hp /root
pm2 save
```

### 5. Настройка Nginx (опционально, для HTTPS)

```bash
sudo apt install -y nginx

# Создание конфига
sudo nano /etc/nginx/sites-available/ab-nevantis
```

Конфигурация Nginx:
```nginx
server {
    listen 80;
    server_name yourdomain.ru www.yourdomain.ru;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
# Активация сайта
sudo ln -s /etc/nginx/sites-available/ab-nevantis /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Установка SSL сертификата (Let's Encrypt)
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.ru -d www.yourdomain.ru
```

### 6. Мониторинг

```bash
# Просмотр логов
pm2 logs ab-nevantis-site

# Статус приложения
pm2 status

# Перезапуск
pm2 restart ab-nevantis-site

# Остановка
pm2 stop ab-nevantis-site
```

## Контакты

- **Компания:** АБ Невантис
- **Адрес:** Кожевенная линия, 30, Санкт-Петербург
- **Телефон:** +7 (812) 01-01-01
- **Email:** info@ab-nevantis.ru

## Лицензия

© 2026 АБ Невантис. Все права защищены.
