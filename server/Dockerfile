FROM python:3.8-slim-buster

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .

ARG SERVER_PORT=5000

ENV SERVER_PORT ${SERVER_PORT}
EXPOSE ${SERVER_PORT}
CMD [ "python3", "-u", "app.py"]