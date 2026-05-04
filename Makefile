CC = gcc
CFLAGS = -Wall -Wextra -pthread
TARGET = reserva_cine

all: $(TARGET)

$(TARGET): reserva_cine.c
	$(CC) $(CFLAGS) reserva_cine.c -o $(TARGET)

clean:
	rm -f $(TARGET) reserva_cine.exe
