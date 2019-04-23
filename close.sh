#!/bin/bash
echo "Stopping services"
docker stop notes_service
docker stop courses_service
echo "Removing local network"
docker network rm ws_bridge
echo "Clearing empty images"
docker rmi $(docker images --filter dangling=true -q --no-trunc)
echo "Done"