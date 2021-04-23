# auto-graphql-server (ags) mysql example

## 🏃‍♀️ Steps to run:

1. run with docker compose from the root of this repo:

    `docker-compose -f ./examples/mysql/docker-compose.yml -p ags_mysql up`

2. copy contents of **data** folder to the data volume docker created
3. Do step 1 again
4. Head to [localhost:3001](http://localhost:3001) and play around! 🥳

### 🧹 Comand for powering down (this will not delete the volume):

`docker-compose -f ./examples/mysql/docker-compose.yml -p ags_mysql down --rmi local`
