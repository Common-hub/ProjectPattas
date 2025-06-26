
default_ip=$(hostname -I | awk '{print $1}')

read -p "Enter your local IP (press Enter to use [$default_ip]): " ip
ip=${ip:-$default_ip}

echo "Using IP: $ip"

gnome-terminal -- bash -c "echo 'Starting Angular frontend...'; ng serve --host \"$ip\" --port 4200 --open; exec bash"

sleep 2

gnome-terminal -- bash -c "echo 'Starting Spring Boot backend...'; java -jar projectPattas_jar/crackers-shop-0.0.1-SNAPSHOT.jar; exec bash"
