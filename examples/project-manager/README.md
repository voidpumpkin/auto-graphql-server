# auto-graphql-server (ags) project-manager example

## 🏃‍♀️ Steps to run:

1. run with docker compose from the root of this repo:

    `docker-compose -f ./examples/project-manager/docker-compose.yml -p ags_pm up`

2. Head to [localhost](http://localhost) or [localhost/graphql](http://localhost/graphql) and play around! 🥳

### 🧹 Comand for powering down (this will not delete the volume):

`docker-compose -f ./examples/project-manager/docker-compose.yml -p ags_pm down --rmi local`
