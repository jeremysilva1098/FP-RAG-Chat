#!/bin/bash

docker run -p 6333:6333 -v $(pwd):/snapshots qdrant/qdrant ./qdrant --storage-snapshot /snapshots/latest.snapshot