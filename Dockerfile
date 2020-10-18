FROM nginx:1.17.9-alpine

MAINTAINER AnaVis Team <info@anavis.de>

COPY build /html
COPY nginx.conf /etc/nginx/nginx.conf

ENV VIRTUAL_HOST anavis.app,www.anavis.app
ENV LETSENCRYPT_HOST anavis.app,www.anavis.app
