# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.18.0
COPY ./dist /usr/share/nginx/html
# Copy the default nginx.conf provided by tiangolo/node-frontend
COPY ./_nginx/default.conf /etc/nginx/conf.d/default.conf
COPY ./_nginx/nginx.conf /etc/nginx/nginx.conf