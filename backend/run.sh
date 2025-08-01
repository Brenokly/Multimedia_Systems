
# Incluindo envs...
#export $(grep -v '^#' .env | xargs)

# Iniciando ou criando container do Postgres...
docker compose up -d

# Iniciando aplicação...
mvn clean install spring-boot:run

## A aplicação assume o controle do terminal,
## suspendendo a execução do script até que ela finalize

# Parando o container do Postgres...
docker compose stop
