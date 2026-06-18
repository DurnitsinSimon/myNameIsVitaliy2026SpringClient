# syntax=docker/dockerfile:1

##############################
# Стадия 1 — сборка (build)  #
##############################
FROM node:20-slim AS build

WORKDIR /app

# Сначала только манифесты — чтобы слой с npm ci кешировался,
# пока package.json / package-lock.json не меняются.
COPY package.json package-lock.json ./

# npm ci ставит ТОЧНО версии из lock-файла, в т.ч. devDependencies
# (typescript, vite нужны для сборки). Не добавляем --omit=dev.
RUN npm ci

# Копируем исходники
COPY . .

# --- Адрес backend API ---
# Vite зашивает import.meta.env.VITE_* в бандл во время сборки,
# поэтому значение нужно передать ИМЕННО здесь, как build arg.
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Собираем статику в /app/dist
RUN npm run build


##############################
# Стадия 2 — раздача (nginx) #
##############################
FROM nginx:alpine AS runtime

# Свой конфиг вместо дефолтного (SPA-fallback + порт 80)
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/app.conf

# Готовая статика из стадии сборки
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
