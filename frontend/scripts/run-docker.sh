docker stop frontend-dev
docker rm frontend-dev
docker build -f ./Dockerfile-dev -t frontend . &&
docker run \
        --publish=3000:3000 \
        --publish=3001:3001 \
        -v $PWD/src:/usr/app/src/src \
        -v $PWD/scripts:/usr/app/src/scripts \
        -v $PWD/config:/usr/app/src/config \
        -i -t \
        --name "frontend-dev"\
        frontend-dev

