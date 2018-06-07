FROM node:9.11

RUN mkdir -p /opt/todo-app
RUN mkdir -p /data/db
ADD dist /opt/todo-app/dist
ADD server /opt/todo-app/server
COPY package.json /opt/todo-app/

WORKDIR /opt/todo-app

EXPOSE 3000

COPY start.sh /opt/todo-app/

CMD ["/bin/bash", "/opt/todo-app/start.sh"]