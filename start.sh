echo "Creating a user-based network bridge"
docker network create ws_bridge
echo "Done."
echo "cd notes"
cd notes
echo "Creating a network bridge. Done."
echo "Launching notes service"
docker-compose up --build --force-recreate -d
echo "Done."
cd ..
echo "Creating a network bridge. Done."
echo "Launching courses service\e[39m" 
docker-compose up --build --force-recreate -d
echo "Done."
echo "Ready"