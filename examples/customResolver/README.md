# auto-graphql-server (ags) custom resolver example

## 🏃‍♀️ Steps to run:

1. run with docker compose from the root of this repo:

    `docker-compose -f ./examples/customResolver/docker-compose.yml -p ags_customresolver up`

2. copy contents of **data** folder to the data volume docker created
3. Do step 1 again
4. Head to [localhost:3001](http://localhost:3001) and play around! 🥳

    _NOTE_ - there are example queries to copy paste in **queries.graphql** file

### 🧹 Comand for powering down (this will not delete the volume):

`docker-compose -f ./examples/customResolver/docker-compose.yml -p ags_customresolver down --rmi local`
