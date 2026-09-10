# АБ Невантис — Сайт ИТ-интегратора

## Описание
Официальный сайт компании «АБ Невантис» — ИТ-интегратора полного цикла.

## Установка и запуск

### 1. Установка зависимостей
```bash
npm install
```

### 2. Настройка переменных окружения
Скопируйте файл `.env.example` в `.env` и заполните необходимыми значениями:
```bash
cp .env.example .env
```

### 3. Запуск сервера
```bash
npm start
```

Сервер запустится на порту 3000 (или на порту, указанном в `.env`).

## Деплой на VPS Ubuntu

### 1. Подготовка сервера
```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Установка PM2 для управления процессами
sudo npm install -g pm2
```

### 2. Развёртывание приложения
```bash
# Клонирование репозитория
git clone <repository-url>
cd <project-directory>

# Установка зависимостей
npm install --production

# Копирование и настройка .env
cp .env.example .env
nano .env  # Заполните реальными значениями
```

### 3. Запуск через PM2
```bash
pm2 start server.js --name ab-nevantis
pm2 save
pm2 startup
```

### 4. Настройка Nginx (опционально)
```bash
sudo apt install nginx -y
sudo nano /etc/nginx/sites-available/ab-nevantis
```

Конфигурация Nginx:
```nginx
server {
    listen 80;
    server_name ab-nevantis.ru www.ab-nevantis.ru;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Активация сайта:
```bash
sudo ln -s /etc/nginx/sites-available/ab-nevantis /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. SSL сертификат (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d ab-nevantis.ru -d www.ab-nevantis.ru
```

## Структура проекта
- `server.js` — основной серверный файл (Express)
- `index.html` — главная страница сайта
- `package.json` — зависимости проекта
- `.env.example` — шаблон переменных окружения

## Контакты
- Email: info@ab-nevantis.ru
- Телефон: +7 (812) 01-01-01
- Адрес: Кожевенная линия, 30, Санкт-Петербург
