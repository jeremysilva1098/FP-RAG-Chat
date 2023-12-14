
https://github.com/jeremysilva1098/FP-RAG-Chat/assets/58676494/4e86f975-0aa3-4d1f-bf4f-b8be097a490a
# FP-RAG-Chat
RAG Powered Chat Client for freeplay content

## Freeplay Components
### Chat Client Demo Video
(sorry file to large to embed directly!)
[![](https://markdown-videos-api.jorgenkh.no/youtube/oQNFPXezXdY)](https://youtu.be/oQNFPXezXdY)

### Configuring evaluation criteria for our RAG prompt template
https://github.com/jeremysilva1098/FP-RAG-Chat/assets/58676494/74bd88f1-51bd-43e2-87b2-d7e66f9ab7e9

### Labeling real time sessions
https://github.com/jeremysilva1098/FP-RAG-Chat/assets/58676494/8855ce76-3a75-4bfb-8d44-524ab0d61d04

### Auto evaluation via Test Run
https://github.com/jeremysilva1098/FP-RAG-Chat/assets/58676494/aa1e835c-e2bc-4309-867d-4d492a6807d1

## Running the client
### Configure ENV variables
Need the following env variables in a .env file at root
```
OPENAI_API_KEY=
FREEPLAY_KEY=
FREEPLAY_PROJECT_ID=
FREEPLAY_URL=
```

### Run the client
```
/bin/bash runApp.sh
```
That will spin up a vector db with the embeddings.
Need docker installed to run
After shutting down the client you'll want to shut down the docker container as well
```
docker container ls
docker stop <CONTAINER ID>
```
