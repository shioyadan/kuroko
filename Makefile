TARGET = main.js

all: run

run: $(TARGET)
	electron .

init:
	npm install 
