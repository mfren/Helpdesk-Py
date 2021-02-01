FROM python:3.8

WORKDIR /usr/src/app

COPY build ./build

COPY main.py ./
COPY requirements.txt ./

RUN pip install -r requirements.txt

EXPOSE 5000

CMD ["python", "./main.py"]
