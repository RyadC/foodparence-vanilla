#! /bin/bash

sudo docker run -i -v ./:/home/node/code:delegated -v /home/node/code/node_modules/ -p 5173:5173 node-dev