#!/bin/bash

docker run -d -p 6333:6333 -v $(pwd)/vector_db:/snapshots qdrant/qdrant ./qdrant --storage-snapshot /snapshots/latest.snapshot

node src/app.js